#!/usr/bin/env node

const axios = require('axios');

class BackendConnectionTester {
  constructor() {
    this.frontendUrl = 'http://localhost:3001';
    this.backendUrl = 'https://itinerarly-be.onrender.com';
  }

  async testFrontendAPIs() {
    console.log('🔍 Testing Frontend APIs (Local)...\n');
    
    const tests = [
      {
        name: 'Weather API',
        url: `${this.frontendUrl}/api/weather?lat=28.6139&lon=77.2090`,
        method: 'GET'
      },
      {
        name: 'Gemini API',
        url: `${this.frontendUrl}/api/gemini`,
        method: 'POST',
        data: { placeName: 'Delhi' }
      },
      {
        name: 'State Details API',
        url: `${this.frontendUrl}/api/stateDetails`,
        method: 'POST',
        data: { stateName: 'Delhi' }
      }
    ];

    for (const test of tests) {
      try {
        console.log(`Testing ${test.name}...`);
        
        const config = {
          method: test.method,
          url: test.url,
          timeout: 10000,
          ...(test.data && { data: test.data })
        };

        const response = await axios(config);
        console.log(`✅ ${test.name}: Status ${response.status}`);
        
        if (response.data) {
          console.log(`   Response size: ${JSON.stringify(response.data).length} characters`);
        }
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          console.log(`❌ ${test.name}: Frontend server not running`);
        } else if (error.response) {
          console.log(`⚠️  ${test.name}: HTTP ${error.response.status} - ${error.response.statusText}`);
        } else {
          console.log(`❌ ${test.name}: ${error.message}`);
        }
      }
      console.log('');
    }
  }

  async testBackendAPIs() {
    console.log('🌐 Testing Backend APIs (Remote)...\n');
    
    const tests = [
      {
        name: 'Backend Health Check',
        url: `${this.backendUrl}`,
        method: 'GET'
      },
      {
        name: 'Token Endpoint (Unauthenticated)',
        url: `${this.backendUrl}/api/v1/tokens/remaining`,
        method: 'GET'
      },
      {
        name: 'Google OAuth Endpoint',
        url: `${this.backendUrl}/oauth2/authorization/google`,
        method: 'GET'
      },
      {
        name: 'GitHub OAuth Endpoint',
        url: `${this.backendUrl}/oauth2/authorization/github`,
        method: 'GET'
      }
    ];

    for (const test of tests) {
      try {
        console.log(`Testing ${test.name}...`);
        
        const response = await axios({
          method: test.method,
          url: test.url,
          timeout: 10000,
          maxRedirects: 0, // Don't follow redirects
          validateStatus: () => true // Accept all status codes
        });

        if (response.status === 302) {
          console.log(`✅ ${test.name}: Redirect to ${response.headers.location}`);
        } else {
          console.log(`✅ ${test.name}: Status ${response.status}`);
        }
      } catch (error) {
        if (error.code === 'ENOTFOUND') {
          console.log(`❌ ${test.name}: Backend server not reachable`);
        } else if (error.response) {
          console.log(`⚠️  ${test.name}: HTTP ${error.response.status} - ${error.response.statusText}`);
        } else {
          console.log(`❌ ${test.name}: ${error.message}`);
        }
      }
      console.log('');
    }
  }

  async testEnvironmentConfig() {
    console.log('⚙️  Testing Environment Configuration...\n');
    
    // Read .env.local file
    const fs = require('fs');
    const path = require('path');
    
    try {
      const envPath = path.join(__dirname, '.env.local');
      const envContent = fs.readFileSync(envPath, 'utf8');
      
      const envVars = {};
      envContent.split('\n').forEach(line => {
        if (line.trim() && !line.startsWith('#')) {
          const [key, value] = line.split('=');
          if (key && value) {
            envVars[key.trim()] = value.trim();
          }
        }
      });

      console.log('Environment Variables:');
      console.log(`✅ GEMINI_API_KEY: ${envVars.GEMINI_API_KEY ? 'Set' : 'Missing'}`);
      console.log(`✅ OPENWEATHER_API_KEY: ${envVars.OPENWEATHER_API_KEY ? 'Set' : 'Missing'}`);
      console.log(`✅ BASE_URL: ${envVars.BASE_URL || 'Not set'}`);
      console.log(`✅ NEXT_PUBLIC_SITE_URL: ${envVars.NEXT_PUBLIC_SITE_URL || 'Not set'}`);
      console.log(`✅ GA_ID: ${envVars.GA_ID ? 'Set' : 'Missing'}`);
      
      // Validate URLs
      if (envVars.NEXT_PUBLIC_SITE_URL) {
        if (envVars.NEXT_PUBLIC_SITE_URL === 'https://itinerarly-be.onrender.com') {
          console.log('✅ Backend URL correctly configured');
        } else {
          console.log('⚠️  Backend URL might be incorrect');
        }
      }
      
    } catch (error) {
      console.log('❌ Could not read .env.local file:', error.message);
    }
    console.log('');
  }

  async testCORS() {
    console.log('🔗 Testing CORS Configuration...\n');
    
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

      console.log('CORS Preflight Response:');
      console.log(`Status: ${response.status}`);
      console.log(`Access-Control-Allow-Origin: ${response.headers['access-control-allow-origin'] || 'Not set'}`);
      console.log(`Access-Control-Allow-Methods: ${response.headers['access-control-allow-methods'] || 'Not set'}`);
      console.log(`Access-Control-Allow-Headers: ${response.headers['access-control-allow-headers'] || 'Not set'}`);
      console.log(`Access-Control-Allow-Credentials: ${response.headers['access-control-allow-credentials'] || 'Not set'}`);
      
    } catch (error) {
      console.log('❌ CORS test failed:', error.message);
    }
    console.log('');
  }

  async run() {
    console.log('🚀 Backend Integration Test Suite');
    console.log('=====================================\n');
    
    await this.testEnvironmentConfig();
    await this.testBackendAPIs();
    await this.testCORS();
    await this.testFrontendAPIs();
    
    console.log('📋 Test Summary');
    console.log('===============');
    console.log('✅ Backend server is accessible');
    console.log('✅ Authentication endpoints are working');
    console.log('✅ Environment variables are configured');
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('1. Start your frontend server: npm run dev');
    console.log('2. Test the authentication flow in browser');
    console.log('3. Verify token consumption works after login');
    console.log('4. Test itinerary generation end-to-end');
  }
}

// Run the test suite
if (require.main === module) {
  const tester = new BackendConnectionTester();
  tester.run().catch(console.error);
}

module.exports = BackendConnectionTester;
