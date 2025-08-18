const axios = require('./lib/axios-config');
const Cookies = require('js-cookie');
const fs = require('fs');

// Backend URL
const BACKEND_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://itinerarly-be.onrender.com";

// Create function to check authentication mechanisms
async function checkAuthMechanisms() {
  console.log("Starting authentication mechanism check...");
  
  // Save original cookies for reference
  const originalCookies = document.cookie;
  console.log("Original cookies:", originalCookies);
  
  try {
    // 1. Test with JSESSIONID cookie only
    await testWithJSESSIONID();
    
    // 2. Test with auth-token cookie
    await testWithAuthToken();
    
    // 3. Test with authToken cookie
    await testWithAltAuthToken();
    
    // 4. Test with X-Auth-Token header
    await testWithXAuthTokenHeader();
    
    // 5. Test with Authorization header
    await testWithAuthorizationHeader();
    
  } catch (error) {
    console.error("Error during authentication tests:", error);
  } finally {
    // Restore original cookies
    document.cookie = originalCookies;
    console.log("Restored original cookies");
  }
}

// Test with JSESSIONID cookie
async function testWithJSESSIONID() {
  console.log("\nTesting with JSESSIONID cookie...");
  
  try {
    // Keep only JSESSIONID cookie if it exists
    const jsessionid = Cookies.get("JSESSIONID");
    
    if (!jsessionid) {
      console.log("No JSESSIONID cookie found, skipping test");
      return;
    }
    
    // Clear other auth cookies
    Cookies.remove("auth-token");
    Cookies.remove("authToken");
    
    // Make request with only JSESSIONID
    const response = await axios.get(`${BACKEND_URL}/api/v1/tokens/remaining`);
    console.log("JSESSIONID test result:", {
      status: response.status,
      data: response.data
    });
    
    return response.status < 400;
  } catch (error) {
    console.log("JSESSIONID test failed:", {
      status: error.response?.status,
      error: error.message
    });
    return false;
  }
}

// Test with auth-token cookie
async function testWithAuthToken() {
  console.log("\nTesting with auth-token cookie...");
  
  try {
    // Set test auth-token cookie
    Cookies.set("auth-token", "test-token");
    
    // Remove other auth cookies
    Cookies.remove("JSESSIONID");
    Cookies.remove("authToken");
    
    // Make request with auth-token cookie
    const response = await axios.get(`${BACKEND_URL}/api/v1/tokens/remaining`);
    console.log("auth-token test result:", {
      status: response.status,
      data: response.data
    });
    
    return response.status < 400;
  } catch (error) {
    console.log("auth-token test failed:", {
      status: error.response?.status,
      error: error.message
    });
    return false;
  } finally {
    Cookies.remove("auth-token");
  }
}

// Test with authToken cookie
async function testWithAltAuthToken() {
  console.log("\nTesting with authToken cookie...");
  
  try {
    // Set test authToken cookie
    Cookies.set("authToken", "test-token");
    
    // Remove other auth cookies
    Cookies.remove("JSESSIONID");
    Cookies.remove("auth-token");
    
    // Make request with authToken cookie
    const response = await axios.get(`${BACKEND_URL}/api/v1/tokens/remaining`);
    console.log("authToken test result:", {
      status: response.status,
      data: response.data
    });
    
    return response.status < 400;
  } catch (error) {
    console.log("authToken test failed:", {
      status: error.response?.status,
      error: error.message
    });
    return false;
  } finally {
    Cookies.remove("authToken");
  }
}

// Test with X-Auth-Token header
async function testWithXAuthTokenHeader() {
  console.log("\nTesting with X-Auth-Token header...");
  
  try {
    // Remove all auth cookies
    Cookies.remove("JSESSIONID");
    Cookies.remove("auth-token");
    Cookies.remove("authToken");
    
    // Make request with X-Auth-Token header
    const response = await axios.get(`${BACKEND_URL}/api/v1/tokens/remaining`, {
      headers: {
        "X-Auth-Token": "test-token"
      }
    });
    console.log("X-Auth-Token header test result:", {
      status: response.status,
      data: response.data
    });
    
    return response.status < 400;
  } catch (error) {
    console.log("X-Auth-Token header test failed:", {
      status: error.response?.status,
      error: error.message
    });
    return false;
  }
}

// Test with Authorization header
async function testWithAuthorizationHeader() {
  console.log("\nTesting with Authorization header...");
  
  try {
    // Remove all auth cookies
    Cookies.remove("JSESSIONID");
    Cookies.remove("auth-token");
    Cookies.remove("authToken");
    
    // Make request with Authorization header
    const response = await axios.get(`${BACKEND_URL}/api/v1/tokens/remaining`, {
      headers: {
        "Authorization": "Bearer test-token"
      }
    });
    console.log("Authorization header test result:", {
      status: response.status,
      data: response.data
    });
    
    return response.status < 400;
  } catch (error) {
    console.log("Authorization header test failed:", {
      status: error.response?.status,
      error: error.message
    });
    return false;
  }
}

// Check redirect response for authentication mechanisms
async function checkRedirectResponseHeaders() {
  console.log("\nChecking redirect response headers...");
  
  try {
    // Remove all auth cookies
    Cookies.remove("JSESSIONID");
    Cookies.remove("auth-token");
    Cookies.remove("authToken");
    
    // Attempt to access protected resource (will cause redirect)
    const response = await axios.get(`${BACKEND_URL}/api/v1/tokens/remaining`, {
      maxRedirects: 0
    });
    
    console.log("Redirect response headers:", response.headers);
  } catch (error) {
    if (error.response?.status === 302) {
      console.log("Redirect detected. Examining headers:", {
        location: error.response.headers.location,
        "set-cookie": error.response.headers["set-cookie"] || "None",
        "authorization": error.response.headers.authorization || "None",
        "x-auth-token": error.response.headers["x-auth-token"] || "None"
      });
    } else {
      console.log("Error checking redirect:", error.message);
    }
  }
}

// Execute tests
if (typeof window !== 'undefined') {
  // Browser environment
  window.addEventListener('load', checkAuthMechanisms);
} else {
  // Node environment (for testing)
  console.log("This script is designed to run in a browser environment");
}

module.exports = {
  checkAuthMechanisms,
  testWithJSESSIONID,
  testWithAuthToken,
  testWithAltAuthToken,
  testWithXAuthTokenHeader,
  testWithAuthorizationHeader,
  checkRedirectResponseHeaders
};
