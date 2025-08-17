#!/usr/bin/env node

let lighthouse;
try {
  // Try ESM default import
  lighthouse = require('lighthouse').default;
  if (typeof lighthouse !== 'function') throw new Error('Not a function');
} catch (e) {
  // Fallback to CommonJS import
  lighthouse = require('lighthouse');
}
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

class PerformanceAuditor {
  constructor() {
    this.baseUrl = 'http://localhost:3001';
    this.testConfigs = [
      {
        name: 'Desktop',
        config: {
          extends: 'lighthouse:default',
          settings: {
            formFactor: 'desktop',
            throttling: {
              rttMs: 40,
              throughputKbps: 10240,
              cpuSlowdownMultiplier: 1,
              requestLatencyMs: 0,
              downloadThroughputKbps: 0,
              uploadThroughputKbps: 0,
            },
            screenEmulation: {
              mobile: false,
              width: 1920,
              height: 1080,
              deviceScaleFactor: 1,
              disabled: false,
            },
          },
        },
      },
      {
        name: 'Mobile',
        config: {
          extends: 'lighthouse:default',
          settings: {
            formFactor: 'mobile',
            throttling: {
              rttMs: 150,
              throughputKbps: 1638.4,
              cpuSlowdownMultiplier: 4,
              requestLatencyMs: 0,
              downloadThroughputKbps: 0,
              uploadThroughputKbps: 0,
            },
            screenEmulation: {
              mobile: true,
              width: 360,
              height: 640,
              deviceScaleFactor: 2.625,
              disabled: false,
            },
          },
        },
      },
    ];
  }

  async launchChrome() {
    return await chromeLauncher.launch({
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
    });
  }

  async runLighthouseAudit(chrome, config) {
    const opts = {
      port: chrome.port,
      logLevel: 'info',
    };

    const result = await lighthouse(this.baseUrl, opts, config);
    return result;
  }

  formatMetrics(result, deviceType) {
    const lhr = result.lhr;
    const metrics = {
      deviceType,
      timestamp: new Date().toISOString(),
      scores: {
        performance: Math.round(lhr.categories.performance.score * 100),
        accessibility: Math.round(lhr.categories.accessibility.score * 100),
        bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
        seo: Math.round(lhr.categories.seo.score * 100),
      },
      metrics: {
        lcp: lhr.audits['largest-contentful-paint'].numericValue,
        fid: lhr.audits['max-potential-fid'].numericValue,
        cls: lhr.audits['cumulative-layout-shift'].numericValue,
        fcp: lhr.audits['first-contentful-paint'].numericValue,
        si: lhr.audits['speed-index'].numericValue,
        tti: lhr.audits['interactive'].numericValue,
      },
      opportunities: {
        unusedJavascript: lhr.audits['unused-javascript']?.details?.overallSavingsMs || 0,
        unusedCSS: lhr.audits['unused-css-rules']?.details?.overallSavingsMs || 0,
        renderBlocking: lhr.audits['render-blocking-resources']?.details?.overallSavingsMs || 0,
        imageOptimization: lhr.audits['uses-optimized-images']?.details?.overallSavingsMs || 0,
        webpImages: lhr.audits['uses-webp-images']?.details?.overallSavingsMs || 0,
      },
    };

    return metrics;
  }

  printResults(metrics) {
    console.log(`\\n🔍 Performance Audit Results - ${metrics.deviceType}`);
    console.log('=' .repeat(50));
    
    console.log('\\n📊 Lighthouse Scores:');
    Object.entries(metrics.scores).forEach(([key, value]) => {
      const emoji = value >= 90 ? '🟢' : value >= 70 ? '🟡' : '🔴';
      console.log(`  ${emoji} ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}/100`);
    });

    console.log('\\n⚡ Core Web Vitals:');
    const lcpStatus = metrics.metrics.lcp <= 2500 ? '🟢 GOOD' : 
                     metrics.metrics.lcp <= 4000 ? '🟡 NEEDS IMPROVEMENT' : '🔴 POOR';
    console.log(`  📈 LCP (Largest Contentful Paint): ${(metrics.metrics.lcp / 1000).toFixed(2)}s ${lcpStatus}`);
    
    const clsStatus = metrics.metrics.cls <= 0.1 ? '🟢 GOOD' : 
                     metrics.metrics.cls <= 0.25 ? '🟡 NEEDS IMPROVEMENT' : '🔴 POOR';
    console.log(`  📐 CLS (Cumulative Layout Shift): ${metrics.metrics.cls.toFixed(3)} ${clsStatus}`);
    
    console.log(`  🎨 FCP (First Contentful Paint): ${(metrics.metrics.fcp / 1000).toFixed(2)}s`);
    console.log(`  🚀 SI (Speed Index): ${(metrics.metrics.si / 1000).toFixed(2)}s`);
    console.log(`  ⚡ TTI (Time to Interactive): ${(metrics.metrics.tti / 1000).toFixed(2)}s`);

    if (Object.keys(metrics.opportunities).length > 0) {
      console.log('\\n💡 Performance Opportunities:');
      Object.entries(metrics.opportunities).forEach(([key, savings]) => {
        if (savings > 100) {
          console.log(`  🔧 ${key}: ${(savings / 1000).toFixed(2)}s potential savings`);
        }
      });
    }
  }

  async saveResults(results) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `performance-audit-${timestamp}.json`;
    const filepath = path.join(__dirname, 'reports', filename);
    
    // Create reports directory if it doesn't exist
    const reportsDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
    console.log(`\\n💾 Results saved to: ${filepath}`);
    
    // Also save a summary report
    const summary = {
      timestamp: new Date().toISOString(),
      summary: results.map(r => ({
        device: r.deviceType,
        performanceScore: r.scores.performance,
        lcp: r.metrics.lcp,
        cls: r.metrics.cls,
        fcp: r.metrics.fcp,
      })),
    };
    
    const summaryPath = path.join(__dirname, 'reports', 'latest-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  }

  async checkServerStatus() {
    try {
      const response = await fetch(this.baseUrl);
      if (response.ok) {
        console.log('✅ Server is running at', this.baseUrl);
        return true;
      }
    } catch (error) {
      console.error('❌ Server is not running. Please start your development server:');
      console.error('   npm run dev  or  npm run build && npm start');
      return false;
    }
  }

  async run() {
    console.log('🚀 Starting comprehensive performance audit...');
    console.log('🎯 Target: LCP < 2.5s for optimal performance');
    
    // Check if server is running
    if (!(await this.checkServerStatus())) {
      process.exit(1);
    }

    const results = [];
    let chrome;

    try {
      chrome = await this.launchChrome();
      console.log('🌐 Chrome browser launched');

      for (const testConfig of this.testConfigs) {
        console.log(`\\n🔄 Running ${testConfig.name} audit...`);
        
        const result = await this.runLighthouseAudit(chrome, testConfig.config);
        const metrics = this.formatMetrics(result, testConfig.name);
        
        results.push(metrics);
        this.printResults(metrics);
      }

      await this.saveResults(results);

      // Print summary
      console.log('\\n' + '='.repeat(60));
      console.log('📋 AUDIT SUMMARY');
      console.log('='.repeat(60));
      
      results.forEach(result => {
        const targetMet = result.metrics.lcp <= 2500 ? '✅' : '❌';
        console.log(`${targetMet} ${result.deviceType}: LCP ${(result.metrics.lcp / 1000).toFixed(2)}s (Performance: ${result.scores.performance}/100)`);
      });

      const allTargetsMet = results.every(r => r.metrics.lcp <= 2500);
      if (allTargetsMet) {
        console.log('\\n🎉 Congratulations! All LCP targets met (< 2.5s)');
      } else {
        console.log('\\n⚠️  Some targets not met. Consider additional optimizations:');
        console.log('   • Video lazy loading with intersection observer');
        console.log('   • Critical CSS inlining');
        console.log('   • Service worker for video caching');
        console.log('   • Image compression and WebP conversion');
      }

    } catch (error) {
      console.error('❌ Error during audit:', error.message);
    } finally {
      if (chrome) {
        await chrome.kill();
        console.log('\\n🔴 Chrome browser closed');
      }
    }
  }
}

// Run the auditor
if (require.main === module) {
  const auditor = new PerformanceAuditor();
  auditor.run().catch(console.error);
}

module.exports = PerformanceAuditor;
