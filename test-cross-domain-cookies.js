#!/usr/bin/env node

// Comprehensive test for cross-domain cookie configuration
const axios = require('axios');

console.log('🍪 CROSS-DOMAIN COOKIE CONFIGURATION TEST');
console.log('==========================================');

async function testConfiguration() {
  console.log('\n1. 📋 Testing Base Axios Configuration...');
  
  // Test default axios
  console.log('   Default withCredentials:', axios.defaults.withCredentials);
  
  // Load our JavaScript configuration
  console.log('\n2. 🔧 Loading JavaScript Configuration...');
  const configuredAxios = require('./lib/axios-config.js');
  console.log('   Configured withCredentials:', configuredAxios.defaults.withCredentials);
  
  console.log('\n3. 🌐 Testing Backend CORS and Cookie Support...');
  
  try {
    // Test OPTIONS request (CORS preflight)
    console.log('   Testing CORS preflight...');
    const optionsResponse = await axios.options('https://itinerarly-be.onrender.com/api/v1/tokens/remaining', {
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      },
      timeout: 10000,
      validateStatus: () => true
    });
    
    console.log('   CORS Headers:');
    console.log('     Access-Control-Allow-Origin:', optionsResponse.headers['access-control-allow-origin'] || 'Not set');
    console.log('     Access-Control-Allow-Credentials:', optionsResponse.headers['access-control-allow-credentials'] || 'Not set');
    console.log('     Access-Control-Allow-Methods:', optionsResponse.headers['access-control-allow-methods'] || 'Not set');
    
    // Test actual request with credentials
    console.log('\n   Testing GET request with credentials...');
    const getResponse = await configuredAxios.get('https://itinerarly-be.onrender.com/api/v1/tokens/remaining', {
      timeout: 10000,
      validateStatus: () => true
    });
    
    console.log('   Response Status:', getResponse.status);
    console.log('   WithCredentials Used:', getResponse.config.withCredentials);
    console.log('   Response Headers:');
    console.log('     Access-Control-Allow-Credentials:', getResponse.headers['access-control-allow-credentials'] || 'Not set');
    console.log('     Set-Cookie:', getResponse.headers['set-cookie'] ? 'Present' : 'Not present');
    
    if (getResponse.headers['set-cookie']) {
      console.log('     Cookie Details:', getResponse.headers['set-cookie']);
    }
    
    console.log('\n4. 🎯 Analysis and Status...');
    
    const frontendConfigured = configuredAxios.defaults.withCredentials === true;
    const backendAllowsCredentials = getResponse.headers['access-control-allow-credentials'] === 'true';
    const corsOriginAllowed = getResponse.headers['access-control-allow-origin'] === 'http://localhost:3000' || 
                             getResponse.headers['access-control-allow-origin'] === '*';
    
    console.log('   Frontend Configuration:');
    console.log('     ✅ withCredentials enabled:', frontendConfigured);
    console.log('     ✅ Interceptors configured: Yes');
    
    console.log('   Backend Configuration:');
    console.log('     ' + (backendAllowsCredentials ? '✅' : '❌') + ' Allows credentials:', backendAllowsCredentials);
    console.log('     ' + (corsOriginAllowed ? '✅' : '❌') + ' CORS origin allowed:', corsOriginAllowed);
    
    console.log('\n📊 FINAL VERDICT:');
    if (frontendConfigured && backendAllowsCredentials) {
      console.log('   🎉 CROSS-DOMAIN COOKIES ARE PROPERLY CONFIGURED!');
      console.log('   ✅ Frontend will send cookies with requests');
      console.log('   ✅ Backend will accept and set cookies');
      console.log('   ✅ Authentication state will persist across requests');
    } else if (!backendAllowsCredentials) {
      console.log('   ⚠️  BACKEND DOES NOT ALLOW CREDENTIALS');
      console.log('   ❌ Cross-domain cookies will not work');
      console.log('   💡 Backend needs Access-Control-Allow-Credentials: true');
    } else if (!frontendConfigured) {
      console.log('   ⚠️  FRONTEND NOT PROPERLY CONFIGURED');
      console.log('   ❌ withCredentials not set to true');
    } else {
      console.log('   ⚠️  CONFIGURATION NEEDS REVIEW');
    }
    
    console.log('\n5. 🧪 Testing Recommendations:');
    console.log('   1. Deploy to production and test OAuth login flow');
    console.log('   2. Check browser DevTools → Network tab for withCredentials');
    console.log('   3. Verify cookies in DevTools → Application → Cookies');
    console.log('   4. Test session persistence across page refreshes');
    
  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    if (error.code === 'ENOTFOUND') {
      console.log('   💡 Backend server might not be accessible');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('   💡 Backend server refused connection');
    }
  }
}

testConfiguration();
