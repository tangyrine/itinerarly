"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { sanitizeCookieValue, setCookieSafely, extractJwtToken } from "./cookie-utils";

const SiteUrl: string = process.env.NEXT_PUBLIC_SITE_URL || "https://itinerarly-be.onrender.com";


function checkAuthenticationMechanisms() {
  
  const visibleCookies = document.cookie;
  const hasCookies = visibleCookies.length > 0;
  const hasVisibleJsessionId = visibleCookies.includes('JSESSIONID');
  const hasVisibleAuthToken = visibleCookies.includes('auth-token') || visibleCookies.includes('authToken');
  
  const jsessionidFromJsCookie = Cookies.get("JSESSIONID");

  let authTokenRaw = Cookies.get("auth-token");
  let altAuthTokenRaw = Cookies.get("authToken");

  let authTokenFromJsCookie = authTokenRaw ? extractJwtToken(authTokenRaw) : undefined;
  let altAuthTokenFromJsCookie = altAuthTokenRaw ? extractJwtToken(altAuthTokenRaw) : undefined;

  if (authTokenRaw && authTokenRaw !== authTokenFromJsCookie) {
    console.log("Sanitizing malformed auth-token cookie");
    setCookieSafely(Cookies, "auth-token", authTokenFromJsCookie);
  }
  
  if (altAuthTokenRaw && altAuthTokenRaw !== altAuthTokenFromJsCookie) {
    console.log("Sanitizing malformed authToken cookie");
    setCookieSafely(Cookies, "authToken", altAuthTokenFromJsCookie);
  }
  
  const hasLocalStorageToken = 
    localStorage.getItem("token") !== null ||
    localStorage.getItem("X-Auth-Token") !== null ||
    localStorage.getItem("Authorization") !== null;
    
  const oauthFlowStarted = localStorage.getItem("oauthFlowStarted") !== null;
  const authInProgress = sessionStorage.getItem("authInProgress") === "true";

  console.log("Authentication check:", {
    hasCookies,
    hasVisibleJsessionId,
    hasVisibleAuthToken,
    jsessionidFromJsCookie: jsessionidFromJsCookie !== undefined,
    authTokenFromJsCookie: authTokenFromJsCookie !== undefined,
    altAuthTokenFromJsCookie: altAuthTokenFromJsCookie !== undefined,
    hasLocalStorageToken,
    oauthFlowStarted,
    authInProgress,
    isAuthenticatedInStorage: localStorage.getItem("isAuthenticated") === "true"
  });
  
  return (
    hasVisibleJsessionId || 
    jsessionidFromJsCookie !== undefined ||
    hasVisibleAuthToken ||
    authTokenFromJsCookie !== undefined ||
    altAuthTokenFromJsCookie !== undefined ||
    hasLocalStorageToken ||
    
    sessionStorage.getItem("isAuthenticated") === "true" ||
    localStorage.getItem("isAuthenticated") === "true" ||
    
    authInProgress
  );
}

// Import debug utility if it exists
let debugAuthTokens: (() => string) | undefined;
try {
  if (typeof window !== 'undefined') {
    import('@/lib/debug-auth').then(module => {
      debugAuthTokens = module.default;
    });
  }
} catch (e) {
  console.log("Debug auth module not available");
}

interface TokenContextType {
  token: number | undefined;
  isLoading: boolean;
  error: string | null;
  refreshTokenCount: () => Promise<void>;
  consumeToken: () => Promise<boolean>;
  isTokenAvailable: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const TokenContext = createContext<TokenContextType>({
  token: undefined,
  isLoading: false,
  error: null,
  refreshTokenCount: async () => {},
  consumeToken: async () => false,
  isTokenAvailable: false,
  isAuthenticated: false,
  logout: () => {},
});

export function TokenProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const isTokenAvailable = typeof token === 'number' && token > 0;

  const refreshTokenCount = async (): Promise<void> => {
    console.log("🔄 Refreshing token count...");
    setIsLoading(true);
    setError(null);
    
    // Log current authentication state
    console.log("🔍 Current auth state:", {
      cookies: document.cookie,
      isLoggedInCookie: Cookies.get("isLoggedIn"),
      jsessionId: Cookies.get("JSESSIONID"),
      authToken: Cookies.get("auth-token"),
      altAuthToken: Cookies.get("authToken")
    });
    
    const authTokenRaw = Cookies.get("auth-token");
    const altAuthTokenRaw = Cookies.get("authToken");
    
    if (authTokenRaw) {
      const sanitizedToken = extractJwtToken(authTokenRaw);
      if (sanitizedToken !== authTokenRaw) {
        console.log("Sanitizing auth-token before API call");
        setCookieSafely(Cookies, "auth-token", sanitizedToken);
      }
    }
    
    if (altAuthTokenRaw) {
      const sanitizedToken = extractJwtToken(altAuthTokenRaw);
      if (sanitizedToken !== altAuthTokenRaw) {
        console.log("Sanitizing authToken before API call");
        setCookieSafely(Cookies, "authToken", sanitizedToken);
      }
    }
    
    try {
      console.log("🚀 Making request to /tokens/remaining...");
      const response = await axios.get(`${SiteUrl}/api/v1/tokens/remaining`, {
        withCredentials: true // This ensures cookies are sent with the request
      });
      
      // If we get a successful response, we're authenticated
      console.log("✅ Authentication successful:", response.data);
      setToken(response.data.remainingTokens ?? 0);
      setIsAuthenticated(true);
      
      // Set a simple isLoggedIn cookie for middleware to use
      // This avoids the JWT token issues in middleware
      setCookieSafely(Cookies, "isLoggedIn", "true", { 
        expires: 7, // 7 days
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production'
      });
      console.log("✅ Set isLoggedIn cookie to true");

      try {
        sessionStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("lastAuthCheck", new Date().toISOString());
      } catch (e) {
        console.log("Could not store auth state in storage:", e);
      }

      // Disable automatic debug auth tokens to prevent accidental token consumption
      // if (typeof debugAuthTokens === 'function') {
      //   debugAuthTokens();
      // }
      console.log("🔧 Debug auth tokens available - call debugAuthTokens() manually in console if needed");
    } catch (error) {
      console.error("Authentication check failed:", error);
      setToken(0);
      setIsAuthenticated(false);

      Cookies.remove("isLoggedIn");
      console.log("❌ Removed isLoggedIn cookie due to auth failure");
      
      // Clear authentication state in storage
      try {
        sessionStorage.removeItem("isAuthenticated");
        localStorage.removeItem("isAuthenticated");
        localStorage.setItem("lastAuthError", new Date().toISOString());
      } catch (e) {
        console.log("Could not clear auth state in storage:", e);
      }
      
      if (axios.isAxiosError(error)) {
        // Check specifically for OAuth error with invalid character [34]
        const errorMsg = error.response?.data?.error || '';
        const isOAuthCharacterError = 
          errorMsg.includes('OAuth2 authentication failed') && 
          errorMsg.includes('invalid character [34]');
        
        if (isOAuthCharacterError) {
          console.error("Detected OAuth2 invalid character error - cleaning cookies");
          
          // Clean up problematic cookies
          const authTokenRaw = Cookies.get("auth-token");
          const altAuthTokenRaw = Cookies.get("authToken");
          
          if (authTokenRaw) {
            Cookies.remove("auth-token");
            const sanitizedToken = extractJwtToken(authTokenRaw);
            setCookieSafely(Cookies, "auth-token", sanitizedToken);
          }
          
          if (altAuthTokenRaw) {
            Cookies.remove("authToken");
            const sanitizedToken = extractJwtToken(altAuthTokenRaw);
            setCookieSafely(Cookies, "authToken", sanitizedToken);
          }
          
          // Try again with cleaned cookies
          setError("Fixing authentication issue. Please wait...");
          
          // Wait a moment and try again with cleaned cookies
          setTimeout(() => {
            refreshTokenCount();
          }, 500);
          
          return;
        } else if (error.response?.status === 401) {
          setError("Authentication error. Please sign in again.");
        } else {
          setError(`Failed to fetch tokens: ${error.response?.data?.message || error.message}`);
        }
      } else {
        setError("Failed to fetch tokens");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const consumeToken = async (): Promise<boolean> => {
    const isLoggedIn = Cookies.get("isLoggedIn") === "true";
    
    if (!isAuthenticated || !isLoggedIn) {
      console.log("Token consumption blocked - Authentication check failed:", {
        isAuthenticated,
        isLoggedIn,
        hasIsLoggedInCookie: Cookies.get("isLoggedIn") !== undefined
      });
      setError("Please sign in to continue");
      return false;
    }

    if (token === undefined || token <= 0) {
      setError("No tokens remaining or token count not yet loaded");
      return false;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log("🔥 Attempting to consume token...");
      console.log("🍪 Current cookies:", document.cookie);
      console.log("🔑 Auth state:", { isAuthenticated, isLoggedIn });
      
      const response = await axios.post(
        `${SiteUrl}/api/v1/tokens/consume`,
        {}, 
        {
          withCredentials: true,
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Token consume response:", response.data);

      if (response.data?.success === true) {
        if (response.data?.remainingTokens !== undefined) {
          setToken(response.data.remainingTokens);
          console.log(`✅ Token consumed successfully. Remaining: ${response.data.remainingTokens}`);
        } else {
          await refreshTokenCount();
        }
        return true;
      } else {
        const message = response.data?.message || "No tokens remaining";
        setError(message);
        console.log("🚫 Token consumption failed:", message);
        return false;
      }
    } catch (error) {
      console.error("❌ Error consuming token:", error);
      
      // Log detailed error information for debugging
      if (axios.isAxiosError(error)) {
        console.error("📊 Axios error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            withCredentials: error.config?.withCredentials,
            headers: error.config?.headers
          }
        });
      }
      
      let errorMessage = "Failed to consume token";
      let shouldAlert = true;
      
      if (axios.isAxiosError(error)) {
        // Check if response is HTML (login page) instead of JSON
        const responseText = typeof error.response?.data === 'string' ? error.response.data : '';
        const isHtmlResponse = responseText.includes('<!DOCTYPE html>') || responseText.includes('<html');
        
        if (isHtmlResponse) {
          console.log("🔐 Backend returned login page - user session expired or invalid");
          setIsAuthenticated(false);
          Cookies.remove("isLoggedIn");
          try {
            sessionStorage.removeItem("isAuthenticated");
            localStorage.removeItem("isAuthenticated");
            localStorage.setItem("lastAuthError", new Date().toISOString());
          } catch (e) {
            console.log("Could not clear auth state in storage:", e);
          }
          errorMessage = "Your session has expired. Please sign in again.";
          shouldAlert = false; // Don't show alert, let the UI handle this gracefully
        } else if (error.response?.status === 401) {
          console.log("🔐 401 Unauthorized - clearing auth state");
          setIsAuthenticated(false);
          Cookies.remove("isLoggedIn");
          try {
            sessionStorage.removeItem("isAuthenticated");
            localStorage.removeItem("isAuthenticated");
            localStorage.setItem("lastAuthError", new Date().toISOString());
          } catch (e) {
            console.log("Could not clear auth state in storage:", e);
          }
          errorMessage = "Authentication error. Please sign in again.";
          shouldAlert = false;
        } else if (error.response?.status === 403) {
          console.log("🚫 403 Forbidden - checking response details");
          console.log("🔍 Response data:", error.response?.data);
          
          // Try to extract meaningful error message
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          } else {
            errorMessage = "Access denied. You may have run out of daily tokens or your session is invalid.";
          }
        } else if (error.response?.status === 500) {
          console.log("💥 500 Server Error");
          errorMessage = "Server error occurred. Please try again later.";
        } else {
          console.log(`🔴 HTTP ${error.response?.status} Error:`, error.response?.data);
          errorMessage = error.response?.data?.message || error.message;
        }
      } else {
        console.log("🔴 Non-Axios error:", error);
        errorMessage = (error as Error)?.message || "Network error occurred";
      }
      
      setError(errorMessage);
      
      // Only show alert for certain types of errors
      if (shouldAlert) {
        alert(errorMessage);
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if there's any indication of authentication
    const isAuthPresent = checkAuthenticationMechanisms();
    
    // Check session storage first for previous authenticated state
    const isAuthInSession = sessionStorage.getItem("isAuthenticated") === "true";
    
    if (isAuthPresent || isAuthInSession) {
      refreshTokenCount();
    } else {
      setToken(0);
      setIsAuthenticated(false);
    }
    
    // Listen for storage events that might affect authentication
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token' || event.key === 'X-Auth-Token' || 
          event.key === 'Authorization' || event.key === 'isAuthenticated') {
        console.log('Authentication storage changed:', event.key);
        const isAuthPresent = checkAuthenticationMechanisms();
        if (isAuthPresent) {
          refreshTokenCount();
        }
      }
    };
    
    const authCheckInterval = setInterval(() => {
      if (isAuthenticated) {
        console.log("Performing periodic auth check");
        refreshTokenCount();
      }
    }, 5 * 60 * 1000); 
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(authCheckInterval);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthPresent = checkAuthenticationMechanisms();
      
      if (isAuthPresent) {
        refreshTokenCount();
      } else {
        setToken(0);
        setIsAuthenticated(false);
      }
    };

    window.addEventListener("focus", checkAuth);
    return () => window.removeEventListener("focus", checkAuth);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const currentPath = window.location.pathname;
      
      const shouldRedirect = 
        currentPath !== '/start' && 
        !currentPath.startsWith('/start/') &&
        !currentPath.includes('/app/') &&
        !currentPath.includes('/dashboard/');
      
      if (shouldRedirect) {
        // Check for OAuth parameters in URL that might indicate we just completed auth
        const url = new URL(window.location.href);
        const hasAuthParams = url.searchParams.has('token') || 
                            url.searchParams.has('code') || 
                            url.searchParams.has('auth');
        
        // If we have auth parameters or we just completed the OAuth flow, redirect
        if (hasAuthParams || localStorage.getItem("oauthFlowStarted")) {
          console.log("Authentication successful, redirecting to /start");
          console.log("Current isAuthenticated state:", isAuthenticated);
          console.log("Current path:", currentPath);
          
          // Clean up OAuth flow markers before redirecting
          localStorage.removeItem("oauthFlowStarted");
          localStorage.removeItem("oauthFlowTimestamp");
          sessionStorage.removeItem("authInProgress");
          
          // Use window.location for full page navigation to ensure cookies are sent
          window.location.href = "/start";
        }
      }
    }
  }, [isAuthenticated]);

  const logout = () => {
    console.log("🚪 TokenProvider logout called - clearing all authentication state");
    
    // Clear internal state
    setToken(0);
    setIsAuthenticated(false);
    setError(null);
    
    // Clear all authentication cookies with comprehensive approach
    const cookieNames = ["auth-token", "JSESSIONID", "isLoggedIn", "authToken"];
    const domains = [undefined, ".itinerarly-be.onrender.com", "itinerarly-be.onrender.com", window.location.hostname, `.${window.location.hostname}`];
    const paths = ["/", undefined];
    
    cookieNames.forEach(cookieName => {
      domains.forEach(domain => {
        paths.forEach(path => {
          const options: any = {};
          if (domain) options.domain = domain;
          if (path) options.path = path;
          
          Cookies.remove(cookieName, options);
          
          // Also try with secure flag combinations
          Cookies.remove(cookieName, { ...options, secure: true });
          Cookies.remove(cookieName, { ...options, secure: false });
          Cookies.remove(cookieName, { ...options, sameSite: 'Lax' });
          Cookies.remove(cookieName, { ...options, sameSite: 'None', secure: true });
        });
      });
    });
    
    // Force clear by setting expired cookies
    cookieNames.forEach(cookieName => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
    });
    
    // Clear authentication state in storage
    try {
      sessionStorage.removeItem("isAuthenticated");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("oauthFlowStarted");
      localStorage.removeItem("oauthFlowTimestamp");
      sessionStorage.removeItem("authInProgress");
      localStorage.setItem("lastAuthError", new Date().toISOString());
      console.log("✅ Cleared all storage-based authentication state");
    } catch (e) {
      console.log("Could not clear auth state in storage:", e);
    }
    
    console.log("🧹 TokenProvider logout complete - all auth state cleared");
  };

  const value = {
    token,
    isLoading,
    error,
    refreshTokenCount,
    consumeToken,
    isTokenAvailable,
    isAuthenticated,
    logout
  };

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>;
}

export function useToken() {
  return useContext(TokenContext);
}