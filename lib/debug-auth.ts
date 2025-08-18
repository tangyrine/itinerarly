// Add this debug helper function to your codebase to analyze JWT token issues
import Cookies from 'js-cookie';

/**
 * Debug function to check for JWT token and other authentication cookies
 * Run this in browser console to diagnose authentication issues
 */
function debugAuthTokens(): string {
  console.log("=== Authentication Debug Info ===");
  
  // 1. Check document.cookie for visible cookies
  console.log("1. Visible cookies from document.cookie:");
  console.log(document.cookie || "No visible cookies");
  
  // 2. Check js-cookie for specific cookies
  try {
    console.log("2. Cookies from js-cookie library:");
    console.log({
      JSESSIONID: Cookies.get("JSESSIONID") || "Not found/HttpOnly",
      authToken: Cookies.get("auth-token") || "Not found",
      altAuthToken: Cookies.get("authToken") || "Not found",
      JWT: Cookies.get("JWT") || "Not found",
      jwt: Cookies.get("jwt") || "Not found",
      accessToken: Cookies.get("access_token") || "Not found"
    });
  } catch (e) {
    console.log("js-cookie library not available:", e);
  }
  
  // 3. Check localStorage for tokens
  console.log("3. Local storage tokens:");
  console.log({
    token: localStorage.getItem("token") || "Not found",
    accessToken: localStorage.getItem("access_token") || "Not found",
    idToken: localStorage.getItem("id_token") || "Not found",
    refreshToken: localStorage.getItem("refresh_token") || "Not found"
  });
  
  // 4. Make a test request to check auth status
  console.log("4. Making test request to check auth status...");
  
  fetch('https://itinerarly-be.onrender.com/api/v1/tokens/remaining', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
  .then(response => {
    console.log("Auth Status Response:", {
      status: response.status,
      statusText: response.statusText,
      headers: Array.from(response.headers.entries()).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>)
    });
    return response.json().catch(() => ({ error: "Failed to parse JSON" }));
  })
  .then(data => {
    console.log("Auth Status Data:", data);
    
    // If authenticated, try a token consume request too
    if (data && !data.error && data.remainingTokens !== undefined) {
      console.log("Authentication successful! Testing token consumption...");
      return fetch('https://itinerarly-be.onrender.com/api/v1/tokens/consume', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log("Token consumption test result:", data);
      })
      .catch(error => {
        console.error("Token consumption test error:", error);
      });
    }
  })
  .catch(error => {
    console.error("Auth Status Error:", error);
  });
  
  // 5. Analyze authentication status
  console.log("5. Analysis:");
  
  if (document.cookie.includes("JSESSIONID")) {
    console.log("✅ JSESSIONID cookie is present (visible to JavaScript)");
  } else {
    console.log("⚠️ JSESSIONID cookie is not visible to JavaScript (may be HttpOnly)");
    console.log("👉 This is NORMAL if the backend sets it as HttpOnly for security");
  }
  
  console.log("💡 HttpOnly cookies cannot be accessed by JavaScript directly");
  console.log("💡 But they ARE sent with API requests automatically");
  console.log("💡 Check network tab for requests to see if auth is working");
  
  return "Authentication debug complete. Check console for details.";
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.debugAuthTokens = debugAuthTokens;
}

export default debugAuthTokens;
