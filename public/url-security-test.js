// Security Test Utility for URL Validation
// Run this in browser console to test the URL validation logic

/**
 * Test cases for URL validation security
 * This demonstrates the difference between vulnerable string checks vs secure URL parsing
 */

// ❌ VULNERABLE function (DO NOT USE)
function vulnerableUrlCheck(refererUrl) {
  return refererUrl.includes('github.com') ||
         refererUrl.includes('google.com') ||
         refererUrl.includes('accounts.google.com');
}

// ✅ SECURE function (RECOMMENDED)
function secureUrlCheck(refererUrl) {
  if (!refererUrl) {
    return false;
  }
  
  try {
    const parsedUrl = new URL(refererUrl);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    const allowedOAuthHosts = [
      'github.com',
      'google.com', 
      'accounts.google.com',
      'oauth.google.com',
    ];
    
    return allowedOAuthHosts.some(allowedHost => {
      // Exact match
      if (hostname === allowedHost) {
        return true;
      }
      
      // Valid subdomain check
      if (hostname.endsWith('.' + allowedHost)) {
        const subdomain = hostname.substring(0, hostname.length - allowedHost.length - 1);
        return subdomain.length > 0 && !subdomain.endsWith('.');
      }
      
      return false;
    });
  } catch (error) {
    console.warn('Invalid referer URL format:', refererUrl);
    return false;
  }
}

// Test cases demonstrating security vulnerabilities
const testCases = [
  // ✅ LEGITIMATE URLs - should PASS both checks
  {
    url: 'https://github.com/login/oauth/authorize',
    description: 'Legitimate GitHub OAuth URL',
    shouldPass: true
  },
  {
    url: 'https://accounts.google.com/oauth2/auth',
    description: 'Legitimate Google OAuth URL',
    shouldPass: true
  },
  {
    url: 'https://www.google.com/search',
    description: 'Legitimate Google subdomain',
    shouldPass: true
  },
  
  // 🚨 ATTACK URLs - should FAIL secure check but PASS vulnerable check
  {
    url: 'https://evil-attacker.com/github.com/steal-tokens',
    description: 'Attack: GitHub domain in path',
    shouldPass: false
  },
  {
    url: 'https://malicious-site.net?redirect=google.com',
    description: 'Attack: Google domain in query parameter',
    shouldPass: false
  },
  {
    url: 'https://fake-accounts.google.com.evil.com/oauth',
    description: 'Attack: Subdomain impersonation',
    shouldPass: false
  },
  {
    url: 'https://not-github.com#github.com',
    description: 'Attack: GitHub domain in fragment',
    shouldPass: false
  },
  {
    url: 'https://evilgoogle.com/accounts.google.com/fake',
    description: 'Attack: Google domain embedded in path',
    shouldPass: false
  },
  
  // 🔍 EDGE CASES
  {
    url: 'https://github.com.evil.com',
    description: 'Edge case: Similar domain',
    shouldPass: false
  },
  {
    url: 'https://sub.github.com',
    description: 'Edge case: Valid subdomain',
    shouldPass: true
  },
  {
    url: 'invalid-url-format',
    description: 'Edge case: Invalid URL format',
    shouldPass: false
  },
  {
    url: '',
    description: 'Edge case: Empty URL',
    shouldPass: false
  }
];

// Run security tests
function runSecurityTests() {
  console.log('🔐 URL VALIDATION SECURITY TEST RESULTS');
  console.log('==========================================\n');
  
  let vulnerableCount = 0;
  let securePassCount = 0;
  
  testCases.forEach((testCase, index) => {
    const vulnerableResult = vulnerableUrlCheck(testCase.url);
    const secureResult = secureUrlCheck(testCase.url);
    
    const vulnerableStatus = vulnerableResult ? '✅ PASS' : '❌ FAIL';
    const secureStatus = secureResult ? '✅ PASS' : '❌ FAIL';
    const expectedStatus = testCase.shouldPass ? '✅ PASS' : '❌ FAIL';
    
    // Check if vulnerable function has security issues
    const isVulnerable = (vulnerableResult !== testCase.shouldPass) && !testCase.shouldPass;
    const isSecure = (secureResult === testCase.shouldPass);
    
    if (isVulnerable) vulnerableCount++;
    if (isSecure) securePassCount++;
    
    console.log(`${index + 1}. ${testCase.description}`);
    console.log(`   URL: ${testCase.url}`);
    console.log(`   Expected: ${expectedStatus}`);
    console.log(`   Vulnerable Check: ${vulnerableStatus} ${isVulnerable ? '🚨 SECURITY ISSUE!' : ''}`);
    console.log(`   Secure Check: ${secureStatus} ${isSecure ? '✅' : '⚠️'}`);
    console.log('');
  });
  
  console.log('📊 SUMMARY:');
  console.log(`   Vulnerable function security issues: ${vulnerableCount}/${testCases.length}`);
  console.log(`   Secure function correct results: ${securePassCount}/${testCases.length}`);
  console.log(`   Security improvement: ${securePassCount - (testCases.length - vulnerableCount)} fewer vulnerabilities`);
  
  if (vulnerableCount > 0) {
    console.log('\n🚨 The vulnerable string-based check can be bypassed by malicious URLs!');
    console.log('   Always use proper URL parsing for security-critical validations.');
  }
  
  if (securePassCount === testCases.length) {
    console.log('\n✅ Secure URL validation passed all tests!');
  }
}

// Export for manual testing
window.runUrlSecurityTests = runSecurityTests;
window.testSecureUrlCheck = secureUrlCheck;
window.testVulnerableUrlCheck = vulnerableUrlCheck;

// Auto-run tests
runSecurityTests();

console.log('\n💡 To run tests again: runUrlSecurityTests()');
console.log('💡 To test individual URLs: testSecureUrlCheck("https://example.com")');
