#!/usr/bin/env node

/**
 * Performance Testing Script for Itinerarly
 * Tests Core Web Vitals including LCP improvements
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class PerformanceTest {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      tests: []
    };
  }

  async runTest(url = 'http://localhost:3000') {
    console.log('🚀 Starting Performance Test...');
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    });

    try {
      // Test with different network conditions
      const testConditions = [
        { name: 'Fast 3G', download: 1.5 * 1024, upload: 750, latency: 150 },
        { name: 'Slow 3G', download: 0.5 * 1024, upload: 250, latency: 300 },
        { name: 'Regular 4G', download: 4 * 1024, upload: 3 * 1024, latency: 20 }
      ];

      for (const condition of testConditions) {
        console.log(`\n📡 Testing with ${condition.name} network...`);
        await this.testWithCondition(browser, url, condition);
      }

    } finally {
      await browser.close();
    }

    this.generateReport();
  }

  async testWithCondition(browser, url, networkCondition) {
    const page = await browser.newPage();
    
    try {
      // Set network conditions
      const client = await page.target().createCDPSession();
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        downloadThroughput: networkCondition.download,
        uploadThroughput: networkCondition.upload,
        latency: networkCondition.latency
      });

      // Enable performance metrics
      await client.send('Performance.enable');
      await page.setCacheEnabled(false);

      // Collect performance metrics
      const metrics = {
        networkCondition: networkCondition.name,
        url,
        startTime: Date.now()
      };

      // Navigate and collect Core Web Vitals
      await page.goto(url, { waitUntil: 'networkidle0' });

      // Wait for initial content to load
      await page.waitForTimeout(3000);

      // Get Web Vitals using browser APIs
      const webVitals = await page.evaluate(() => {
        return new Promise((resolve) => {
          const vitals = {};
          let metricsCollected = 0;
          const totalMetrics = 3; // LCP, FID, CLS

          // Largest Contentful Paint
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              vitals.lcp = entries[entries.length - 1].startTime;
              metricsCollected++;
              if (metricsCollected === totalMetrics) resolve(vitals);
            }
          }).observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay (simulated)
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              vitals.fid = entries[0].processingStart - entries[0].startTime;
              metricsCollected++;
              if (metricsCollected === totalMetrics) resolve(vitals);
            }
          }).observe({ entryTypes: ['first-input'] });

          // Cumulative Layout Shift
          new PerformanceObserver((list) => {
            let clsValue = 0;
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
            vitals.cls = clsValue;
            metricsCollected++;
            if (metricsCollected === totalMetrics) resolve(vitals);
          }).observe({ entryTypes: ['layout-shift'] });

          // Fallback timeout
          setTimeout(() => {
            resolve(vitals);
          }, 10000);
        });
      });

      // Get additional performance metrics
      const performanceMetrics = await client.send('Performance.getMetrics');
      const navigationTiming = await page.evaluate(() => {
        const timing = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
          loadComplete: timing.loadEventEnd - timing.loadEventStart,
          firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
        };
      });

      // Check if video is loaded
      const videoStatus = await page.evaluate(() => {
        const video = document.querySelector('video');
        return {
          present: !!video,
          loaded: video ? video.readyState >= 2 : false,
          autoplay: video ? video.autoplay : false,
          preload: video ? video.preload : null
        };
      });

      // Check image optimization
      const imageOptimization = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        const nextImages = images.filter(img => img.srcset || img.sizes);
        return {
          totalImages: images.length,
          optimizedImages: nextImages.length,
          optimizationRate: images.length > 0 ? (nextImages.length / images.length * 100).toFixed(1) : 0
        };
      });

      metrics.endTime = Date.now();
      metrics.duration = metrics.endTime - metrics.startTime;
      metrics.webVitals = webVitals;
      metrics.navigation = navigationTiming;
      metrics.videoStatus = videoStatus;
      metrics.imageOptimization = imageOptimization;

      // Extract specific performance metrics
      const jsHeapUsedSize = performanceMetrics.metrics.find(m => m.name === 'JSHeapUsedSize')?.value || 0;
      const jsHeapTotalSize = performanceMetrics.metrics.find(m => m.name === 'JSHeapTotalSize')?.value || 0;

      metrics.memory = {
        jsHeapUsed: Math.round(jsHeapUsedSize / 1024 / 1024 * 100) / 100, // MB
        jsHeapTotal: Math.round(jsHeapTotalSize / 1024 / 1024 * 100) / 100 // MB
      };

      this.results.tests.push(metrics);

      console.log(`✅ ${networkCondition.name} Test Complete:`);
      console.log(`   LCP: ${webVitals.lcp ? (webVitals.lcp / 1000).toFixed(2) + 's' : 'N/A'}`);
      console.log(`   FCP: ${navigationTiming.firstContentfulPaint ? (navigationTiming.firstContentfulPaint / 1000).toFixed(2) + 's' : 'N/A'}`);
      console.log(`   CLS: ${webVitals.cls ? webVitals.cls.toFixed(3) : 'N/A'}`);
      console.log(`   Video Status: ${videoStatus.present ? 'Present' : 'Missing'} | Loaded: ${videoStatus.loaded}`);
      console.log(`   Image Optimization: ${imageOptimization.optimizationRate}% (${imageOptimization.optimizedImages}/${imageOptimization.totalImages})`);

    } finally {
      await page.close();
    }
  }

  generateReport() {
    const reportPath = path.join(__dirname, 'performance-report.json');
    const htmlReportPath = path.join(__dirname, 'performance-report.html');

    // Save JSON report
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    // Generate HTML report
    const htmlReport = this.generateHTMLReport();
    fs.writeFileSync(htmlReportPath, htmlReport);

    console.log('\n📊 Performance Test Complete!');
    console.log(`📄 JSON Report: ${reportPath}`);
    console.log(`🌐 HTML Report: ${htmlReportPath}`);

    // Print summary
    this.printSummary();
  }

  generateHTMLReport() {
    const tests = this.results.tests;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Itinerarly Performance Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
        .metric-card { background: white; border: 1px solid #e1e5e9; border-radius: 8px; padding: 20px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .metric-value { font-size: 2em; font-weight: bold; color: #333; }
        .metric-label { color: #666; margin-bottom: 5px; }
        .good { color: #10b981; }
        .needs-improvement { color: #f59e0b; }
        .poor { color: #ef4444; }
        .status-indicator { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 8px; }
        .timestamp { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Itinerarly Performance Report</h1>
        <p class="timestamp">Generated: ${this.results.timestamp}</p>
    </div>

    <div class="metric-grid">
        ${tests.map(test => `
            <div class="metric-card">
                <h3>📡 ${test.networkCondition}</h3>
                
                <div style="margin: 15px 0;">
                    <div class="metric-label">Largest Contentful Paint (LCP)</div>
                    <div class="metric-value ${this.getLCPClass(test.webVitals.lcp)}">
                        ${test.webVitals.lcp ? (test.webVitals.lcp / 1000).toFixed(2) + 's' : 'N/A'}
                    </div>
                </div>

                <div style="margin: 15px 0;">
                    <div class="metric-label">First Contentful Paint (FCP)</div>
                    <div class="metric-value ${this.getFCPClass(test.navigation.firstContentfulPaint)}">
                        ${test.navigation.firstContentfulPaint ? (test.navigation.firstContentfulPaint / 1000).toFixed(2) + 's' : 'N/A'}
                    </div>
                </div>

                <div style="margin: 15px 0;">
                    <div class="metric-label">Cumulative Layout Shift (CLS)</div>
                    <div class="metric-value ${this.getCLSClass(test.webVitals.cls)}">
                        ${test.webVitals.cls ? test.webVitals.cls.toFixed(3) : 'N/A'}
                    </div>
                </div>

                <div style="margin: 15px 0;">
                    <div class="metric-label">Video Optimization</div>
                    <span class="status-indicator" style="background-color: ${test.videoStatus.present ? '#10b981' : '#ef4444'};"></span>
                    ${test.videoStatus.present ? 'Present' : 'Missing'} | 
                    Preload: ${test.videoStatus.preload || 'N/A'}
                </div>

                <div style="margin: 15px 0;">
                    <div class="metric-label">Image Optimization</div>
                    <span class="status-indicator" style="background-color: ${parseFloat(test.imageOptimization.optimizationRate) > 80 ? '#10b981' : '#f59e0b'};"></span>
                    ${test.imageOptimization.optimizationRate}% optimized 
                    (${test.imageOptimization.optimizedImages}/${test.imageOptimization.totalImages})
                </div>

                <div style="margin: 15px 0;">
                    <div class="metric-label">Memory Usage</div>
                    <div style="font-size: 1.1em;">
                        JS Heap: ${test.memory.jsHeapUsed}MB / ${test.memory.jsHeapTotal}MB
                    </div>
                </div>
            </div>
        `).join('')}
    </div>

    <div class="metric-card">
        <h3>🎯 Performance Goals vs Results</h3>
        <p><strong>Target LCP:</strong> &lt; 2.5s</p>
        <p><strong>Best LCP Result:</strong> ${this.getBestLCP()}</p>
        <p><strong>Improvement from 8.17s:</strong> ${this.getImprovement()}</p>
    </div>
</body>
</html>`;
  }

  getLCPClass(lcp) {
    if (!lcp) return '';
    const seconds = lcp / 1000;
    if (seconds <= 2.5) return 'good';
    if (seconds <= 4) return 'needs-improvement';
    return 'poor';
  }

  getFCPClass(fcp) {
    if (!fcp) return '';
    const seconds = fcp / 1000;
    if (seconds <= 1.8) return 'good';
    if (seconds <= 3) return 'needs-improvement';
    return 'poor';
  }

  getCLSClass(cls) {
    if (!cls) return '';
    if (cls <= 0.1) return 'good';
    if (cls <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  getBestLCP() {
    const lcpValues = this.results.tests
      .map(test => test.webVitals.lcp)
      .filter(lcp => lcp)
      .map(lcp => lcp / 1000);
    
    if (lcpValues.length === 0) return 'N/A';
    return Math.min(...lcpValues).toFixed(2) + 's';
  }

  getImprovement() {
    const originalLCP = 8.17;
    const bestLCP = parseFloat(this.getBestLCP());
    if (isNaN(bestLCP)) return 'N/A';
    
    const improvement = originalLCP - bestLCP;
    const percentageImprovement = (improvement / originalLCP * 100).toFixed(1);
    return `${improvement.toFixed(2)}s (${percentageImprovement}% faster)`;
  }

  printSummary() {
    console.log('\n📈 PERFORMANCE SUMMARY:');
    console.log('========================');
    
    this.results.tests.forEach(test => {
      console.log(`\n${test.networkCondition}:`);
      console.log(`  LCP: ${test.webVitals.lcp ? (test.webVitals.lcp / 1000).toFixed(2) + 's' : 'N/A'} ${this.getStatusEmoji(this.getLCPClass(test.webVitals.lcp))}`);
      console.log(`  FCP: ${test.navigation.firstContentfulPaint ? (test.navigation.firstContentfulPaint / 1000).toFixed(2) + 's' : 'N/A'} ${this.getStatusEmoji(this.getFCPClass(test.navigation.firstContentfulPaint))}`);
      console.log(`  CLS: ${test.webVitals.cls ? test.webVitals.cls.toFixed(3) : 'N/A'} ${this.getStatusEmoji(this.getCLSClass(test.webVitals.cls))}`);
    });

    console.log(`\n🎯 Best LCP: ${this.getBestLCP()}`);
    console.log(`📊 Improvement: ${this.getImprovement()}`);
  }

  getStatusEmoji(className) {
    switch (className) {
      case 'good': return '✅';
      case 'needs-improvement': return '⚠️';
      case 'poor': return '❌';
      default: return '❓';
    }
  }
}

// Check if puppeteer is installed
async function checkDependencies() {
  try {
    require('puppeteer');
    return true;
  } catch (error) {
    console.log('❌ Puppeteer not found. Installing...');
    const { execSync } = require('child_process');
    try {
      execSync('npm install puppeteer --save-dev', { stdio: 'inherit' });
      console.log('✅ Puppeteer installed successfully!');
      return true;
    } catch (installError) {
      console.error('❌ Failed to install Puppeteer:', installError.message);
      return false;
    }
  }
}

// Main execution
async function main() {
  const dependenciesOk = await checkDependencies();
  if (!dependenciesOk) {
    console.log('Please install puppeteer manually: npm install puppeteer --save-dev');
    process.exit(1);
  }

  const tester = new PerformanceTest();
  const url = process.argv[2] || 'http://localhost:3000';
  
  console.log(`🔍 Testing URL: ${url}`);
  
  try {
    await tester.runTest(url);
  } catch (error) {
    console.error('❌ Performance test failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = PerformanceTest;
