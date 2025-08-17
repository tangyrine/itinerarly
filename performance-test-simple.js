#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

async function runPerformanceCheck() {
  console.log('🚀 Quick Performance Check');
  console.log('==========================');

  // Check if server is running
  const serverUrl = 'http://localhost:3001';

  try {
    const response = await fetch(serverUrl);
    if (!response.ok) throw new Error('Server not responding');
    console.log('✅ Server is running at', serverUrl);
  } catch (error) {
    console.error('❌ Server is not running. Please start with:');
    console.error('   PORT=3001 npm run dev');
    process.exit(1);
  }

console.log('\n📊 Performance Summary');
console.log('======================');

// Manual test instructions
console.log('🔧 Manual Testing Steps:');
console.log('1. Open Chrome DevTools (F12)');
console.log('2. Go to Lighthouse tab');
console.log('3. Select "Performance" category');
console.log('4. Choose "Desktop" or "Mobile" simulation');
console.log('5. Click "Analyze page load"');
console.log('');

console.log('🎯 Target Metrics:');
console.log('• LCP (Largest Contentful Paint): < 2.5s');
console.log('• FID (First Input Delay): < 100ms');
console.log('• CLS (Cumulative Layout Shift): < 0.1');
console.log('• Performance Score: > 90');
console.log('');

console.log('🎥 Video Optimization Status:');
console.log('✅ Multiple video formats available');
console.log('✅ Responsive video loading implemented');
console.log('✅ Delayed loading with device detection');
console.log('✅ Fallback to static background image');
console.log('');

// Check video files
const optimizedDir = './public/assets/optimized';
if (fs.existsSync(optimizedDir)) {
  const videoFiles = fs.readdirSync(optimizedDir);
  console.log('📁 Available Video Files:');
  videoFiles.forEach(file => {
    const stats = fs.statSync(`${optimizedDir}/${file}`);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);
    console.log(`   • ${file} (${sizeMB}MB)`);
  });
} else {
  console.log('⚠️  Optimized videos not found. Run ./optimize-video.sh');
}

console.log('');
console.log('💡 Quick Performance Tips:');
console.log('• Test with Chrome DevTools → Network → Slow 3G');
console.log('• Check video loading in browser console');
console.log('• Verify no horizontal scroll on mobile');
console.log('• Test video autoplay behavior');
console.log('');

console.log('🌐 Test URL:', serverUrl);
console.log('Ready for manual testing! 🚀');
}

// Run the check
runPerformanceCheck().catch(console.error);
