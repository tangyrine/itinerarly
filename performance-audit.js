const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

async function runPerformanceAudit() {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
  });

  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance'],
    port: chrome.port,
  };

  const config = {
    extends: 'lighthouse:default',
    settings: {
      formFactor: 'desktop',
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0
      },
      screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false,
      },
      emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36'
    }
  };

  try {
    console.log('🚀 Starting Lighthouse audit...');
    const runnerResult = await lighthouse('http://localhost:3000', options, config);

    // Extract key metrics
    const lcp = runnerResult.lhr.audits['largest-contentful-paint'];
    const fcp = runnerResult.lhr.audits['first-contentful-paint'];
    const cls = runnerResult.lhr.audits['cumulative-layout-shift'];
    const fid = runnerResult.lhr.audits['max-potential-fid'];
    const performanceScore = runnerResult.lhr.categories.performance.score * 100;

    console.log('\n📊 PERFORMANCE AUDIT RESULTS');
    console.log('================================');
    console.log(`🎯 Performance Score: ${performanceScore.toFixed(1)}/100`);
    console.log(`⚡ Largest Contentful Paint (LCP): ${lcp.displayValue}`);
    console.log(`🎨 First Contentful Paint (FCP): ${fcp.displayValue}`);
    console.log(`📐 Cumulative Layout Shift (CLS): ${cls.displayValue}`);
    console.log(`⚙️  Max Potential FID: ${fid.displayValue}`);
    
    // LCP Analysis
    console.log('\n🔍 LCP ANALYSIS');
    console.log('===============');
    if (parseFloat(lcp.numericValue) / 1000 <= 2.5) {
      console.log('✅ LCP is GOOD (≤ 2.5s)');
    } else if (parseFloat(lcp.numericValue) / 1000 <= 4.0) {
      console.log('⚠️  LCP needs improvement (2.5s - 4.0s)');
    } else {
      console.log('❌ LCP is POOR (> 4.0s)');
    }

    // Performance opportunities
    console.log('\n🚀 OPTIMIZATION OPPORTUNITIES');
    console.log('=============================');
    const opportunities = runnerResult.lhr.audits;
    
    const keyOpportunities = [
      'render-blocking-resources',
      'unused-css-rules',
      'unused-javascript',
      'efficient-animated-content',
      'offscreen-images',
      'unminified-css',
      'unminified-javascript',
      'legacy-javascript'
    ];

    keyOpportunities.forEach(audit => {
      if (opportunities[audit] && opportunities[audit].score !== null && opportunities[audit].score < 1) {
        console.log(`📈 ${opportunities[audit].title}: ${opportunities[audit].displayValue || 'Check required'}`);
      }
    });

    // Save detailed report
    const reportHtml = runnerResult.report;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(__dirname, `lighthouse-report-${timestamp}.html`);
    
    fs.writeFileSync(reportPath, reportHtml);
    console.log(`\n📄 Detailed report saved: ${reportPath}`);

    // Performance comparison
    console.log('\n📈 IMPROVEMENT TRACKING');
    console.log('======================');
    const currentLCP = parseFloat(lcp.numericValue) / 1000;
    const previousLCP = 8.17; // Original LCP
    const improvement = previousLCP - currentLCP;
    const improvementPercent = ((improvement / previousLCP) * 100);

    console.log(`🕐 Previous LCP: ${previousLCP}s`);
    console.log(`🕐 Current LCP: ${currentLCP.toFixed(2)}s`);
    console.log(`📊 Improvement: ${improvement > 0 ? '-' : '+'}${Math.abs(improvement).toFixed(2)}s (${improvementPercent.toFixed(1)}%)`);

    if (currentLCP <= 2.5) {
      console.log('🎉 TARGET ACHIEVED! LCP is now under 2.5s');
    } else {
      console.log(`🎯 Still need ${(currentLCP - 2.5).toFixed(2)}s improvement to reach target`);
    }

  } catch (error) {
    console.error('❌ Error running Lighthouse:', error);
  } finally {
    await chrome.kill();
  }
}

// Run the audit
runPerformanceAudit().catch(console.error);
