"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { sanitizeCookieValue, setCookieSafely, extractJwtToken } from "./cookie-utils";

const SiteUrl: string = process.env.NEXT_PUBLIC_SITE_URL || "https://itinerarly-be.onrender.com";


function checkAuthenticationMechanisms() {
  // Use safe cookie handling for all cookie operations
  // This will help prevent the OAuth2 error with character [34] (double quotes)
  
  const visibleCookies = document.cookie;
  const hasCookies = visibleCookies.length > 0;
  const hasVisibleJsessionId = visibleCookies.includes('JSESSIONID');
  const hasVisibleAuthToken = visibleCookies.includes('auth-token') || visibleCookies.includes('authToken');
  
  // Use getCookieSafely directly from the cookie-utils
  const jsessionidFromJsCookie = Cookies.get("JSESSIONID");
  
  // Get auth tokens and ensure they're properly sanitized
  let authTokenRaw = Cookies.get("auth-token");
  let altAuthTokenRaw = Cookies.get("authToken");
  
  // Clean these tokens proactively to prevent OAuth errors
  let authTokenFromJsCookie = authTokenRaw ? extractJwtToken(authTokenRaw) : undefined;
  let altAuthTokenFromJsCookie = altAuthTokenRaw ? extractJwtToken(altAuthTokenRaw) : undefined;
  
  // If we have tokens with issues, clean and reset them
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
  
  // Log auth state for debugging
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
  
  // Return true if we detect ANY sign of authentication
  // Note: The most reliable check is still the API call made in refreshTokenCount
  return (
    hasVisibleJsessionId || 
    jsessionidFromJsCookie !== undefined ||
    hasVisibleAuthToken ||
    authTokenFromJsCookie !== undefined ||
    altAuthTokenFromJsCookie !== undefined ||
    hasLocalStorageToken ||
    // Also check session/localStorage for auth state
    sessionStorage.getItem("isAuthenticated") === "true" ||
    localStorage.getItem("isAuthenticated") === "true" ||
    // During OAuth redirect, we might be authenticated but cookies not yet visible
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
}

const TokenContext = createContext<TokenContextType>({
  token: undefined,
  isLoading: false,
  error: null,
  refreshTokenCount: async () => {},
  consumeToken: async () => false,
  isTokenAvailable: false,
  isAuthenticated: false,
});

export function TokenProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const isTokenAvailable = typeof token === 'number' && token > 0;

  const refreshTokenCount = async (): Promise<void> => {
    // We'll make an API call to check authentication status
    // The HttpOnly cookies will be sent automatically with the request
    
    setIsLoading(true);
    setError(null);
    
    // Before making the request, ensure cookies are sanitized to prevent OAuth errors
    const authTokenRaw = Cookies.get("auth-token");
    const altAuthTokenRaw = Cookies.get("authToken");
    
    // Clean any potentially malformed tokens before making the API call
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
      const response = await axios.get(`${SiteUrl}/api/v1/tokens/remaining`, {
        withCredentials: true // This ensures cookies are sent with the request
      });
      
      // If we get a successful response, we're authenticated
      console.log("Authentication successful:", response.data);
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
      
      // Store authentication state in session/localStorage for persistence
      // This helps when HttpOnly cookies are present but not visible to JS
      try {
        sessionStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("lastAuthCheck", new Date().toISOString());
      } catch (e) {
        console.log("Could not store auth state in storage:", e);
      }
      
      // Try to run debug if available
      if (typeof debugAuthTokens === 'function') {
        debugAuthTokens();
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      setToken(0);
      setIsAuthenticated(false);
      
      // Remove the isLoggedIn cookie when authentication fails
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
    // Don't need to check for specific cookies since we're relying on withCredentials
    // to send all cookies, including HttpOnly ones
    if (!isAuthenticated) {
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
      const response = await axios.post(
        `${SiteUrl}/api/v1/tokens/consume`,
        {},
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      console.log("Token consume response:", response.data);

      if (response.data?.success === true) {
        if (response.data?.remainingTokens !== undefined) {
          setToken(response.data.remainingTokens);
          console.log(`Token consumed. Remaining: ${response.data.remainingTokens}`);
        } else {
          await refreshTokenCount();
        }
        return true;
      } else {
        const message = response.data?.message || "No tokens remaining";
        setError(message);
        alert(message);
        return false;
      }
    } catch (error) {
      console.error("Error consuming token:", error);
      
      let errorMessage = "Failed to consume token";
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setIsAuthenticated(false);
          // Clear authentication state in storage and cookies
          Cookies.remove("isLoggedIn");
          try {
            sessionStorage.removeItem("isAuthenticated");
            localStorage.removeItem("isAuthenticated");
            localStorage.setItem("lastAuthError", new Date().toISOString());
          } catch (e) {
            console.log("Could not clear auth state in storage:", e);
          }
          errorMessage = "Authentication error. Please sign in again.";
        } else if (error.response?.status === 403) {
          errorMessage = error.response?.data?.message || "No tokens remaining for today";
        } else if (error.response?.status === 500) {
          errorMessage = "Server error occurred. Please try again later.";
        } else {
          errorMessage = error.response?.data?.message || error.message;
        }
      }
      
      setError(errorMessage);
      alert(errorMessage);
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
    
    // Set up periodic authentication verification
    // This helps with HttpOnly cookies that we can't directly check
    const authCheckInterval = setInterval(() => {
      // Only perform check if we believe we're authenticated
      // to avoid unnecessary API calls when logged out
      if (isAuthenticated) {
        console.log("Performing periodic auth check");
        refreshTokenCount();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
    
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

  // Add effect to handle redirection when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Check if we're on a page that should redirect to /start
      const currentPath = window.location.pathname;
      
      // Don't redirect if we're already on the start page or in an authenticated area
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

  const value = {
    token,
    isLoading,
    error,
    refreshTokenCount,
    consumeToken,
    isTokenAvailable,
    isAuthenticated
  };

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>;
}

export function useToken() {
  return useContext(TokenContext);
}