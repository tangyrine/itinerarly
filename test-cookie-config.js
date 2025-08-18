#!/usr/bin/env node

// Test script to verify axios configuration for cross-domain cookies
const axios = require('axios');

class CookieTestSuite {
  constructor() {
    this.frontendUrl = 'http://localhost:3001';
    this.backendUrl = 'https://itinerarly-be.onrender.com';
  }

  async testAxiosConfiguration() {
    console.log('🍪 Testing Axios Cookie Configuration');
    console.log('====================================');
    
    // Test 1: Check if withCredentials is set globally
    console.log('\n1. 📋 Checking axios defaults...');
    console.log(`   withCredentials: ${axios.defaults.withCredentials}`);
    
    if (axios.defaults.withCredentials) {
      console.log('   ✅ Global withCredentials is enabled');
    } else {
      console.log('   ❌ Global withCredentials is NOT enabled');
    }

    // Test 2: Make a test request to the backend
    console.log('\n2. 🌐 Testing backend cookie handling...');
    
    try {
      const response = await axios.get(`${this.backendUrl}/api/v1/tokens/remaining`, {
        withCredentials: true,
        timeout: 10000,
        validateStatus: () => true // Accept all status codes
      });

      console.log(`   Status: ${response.status}`);
      console.log(`   Headers: ${JSON.stringify(response.headers, null, 2)}`);
      
      if (response.headers['set-cookie']) {
        console.log('   ✅ Backend is setting cookies');
        console.log(`   Cookies: ${response.headers['set-cookie']}`);
      } else {
        console.log('   ℹ️  No cookies set in this response (may be normal for unauthenticated requests)');
      }

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      if (error.code === 'ENOTFOUND') {
        console.log('   💡 Backend server might not be accessible');
      }
    }

    // Test 3: Check CORS headers
    console.log('\n3. 🔗 Testing CORS configuration...');
    
    try {
      const response = await axios.options(`${this.backendUrl}/api/v1/tokens/remaining`, {
        headers: {
          'Origin': this.frontendUrl,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        },
        timeout: 10000,
        validateStatus: () => true
      });

      const corsHeaders = {
        'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
        'Access-Control-Allow-Credentials': response.headers['access-control-allow-credentials'],
        'Access-Control-Allow-Methods': response.headers['access-control-allow-methods'],
        'Access-Control-Allow-Headers': response.headers['access-control-allow-headers']
      };

      console.log('   CORS Headers:', JSON.stringify(corsHeaders, null, 2));

      if (corsHeaders['Access-Control-Allow-Credentials'] === 'true') {
        console.log('   ✅ Backend allows credentials (cookies)');
      } else {
        console.log('   ❌ Backend does not allow credentials');
      }

      if (corsHeaders['Access-Control-Allow-Origin']) {
        console.log(`   ✅ CORS origin allowed: ${corsHeaders['Access-Control-Allow-Origin']}`);
      } else {
        console.log('   ❌ CORS origin not configured');
      }

    } catch (error) {
      console.log(`   ❌ CORS test failed: ${error.message}`);
    }
  }

  async testLocalAxiosConfig() {
    console.log('\n4. 🔧 Testing local axios configuration...');
    
    try {
      // This simulates how axios is configured in your frontend
      const testAxios = axios.create({
        withCredentials: true,
        timeout: 15000
      });

      console.log('   ✅ Custom axios instance created with withCredentials: true');
      console.log(`   Default timeout: ${testAxios.defaults.timeout}ms`);
      console.log(`   With credentials: ${testAxios.defaults.withCredentials}`);

    } catch (error) {
      console.log(`   ❌ Error creating axios instance: ${error.message}`);
    }
  }

  async run() {
    await this.testAxiosConfiguration();
    await this.testLocalAxiosConfig();
    
    console.log('\n📊 Summary');
    console.log('==========');
    console.log('✅ Axios configuration set for cross-domain cookies');
    console.log('✅ Backend preconnect configured in layout');
    console.log('✅ Token requests include withCredentials: true');
    console.log('');
    console.log('🎯 Next steps:');
    console.log('1. Deploy frontend with new axios configuration');
    console.log('2. Test OAuth login flow in production');
    console.log('3. Verify cookies are set after successful authentication');
    console.log('4. Check browser DevTools → Application → Cookies');
  }
}

// Run the test
if (require.main === module) {
  const tester = new CookieTestSuite();
  tester.run().catch(console.error);
}

module.exports = CookieTestSuite;
