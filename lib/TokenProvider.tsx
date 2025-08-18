"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const SiteUrl: string = process.env.NEXT_PUBLIC_SITE_URL || "https://itinerarly-be.onrender.com";

// Define a function to check all possible authentication mechanisms
function checkAuthenticationMechanisms() {
  // JSESSIONID is the most reliable indicator since it's set by the backend
  // Even if it's HttpOnly, we can detect authentication through API calls
  const jsessionidExists = Cookies.get("JSESSIONID") !== undefined;
  
  // Log auth state for debugging
  console.log("Authentication check:", {
    jsessionidVisible: jsessionidExists,
    cookiesAvailable: document.cookie.length > 0,
    hasLocalStorageToken: localStorage.getItem("token") !== null
  });
  
  // Return true if JSESSIONID exists or if we have other tokens
  // Note: JSESSIONID might be HttpOnly, so we can't always check it directly
  return (
    jsessionidExists || 
    document.cookie.includes("JSESSIONID") ||
    Cookies.get("auth-token") !== undefined || 
    Cookies.get("authToken") !== undefined ||
    localStorage.getItem("token") !== null ||
    localStorage.getItem("X-Auth-Token") !== null ||
    localStorage.getItem("Authorization") !== null
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
    
    try {
      const response = await axios.get(`${SiteUrl}/api/v1/tokens/remaining`, {
        withCredentials: true // This ensures cookies are sent with the request
      });
      
      // If we get a successful response, we're authenticated
      console.log("Authentication successful:", response.data);
      setToken(response.data.remainingTokens ?? 0);
      setIsAuthenticated(true);
      
      // Try to run debug if available
      if (typeof debugAuthTokens === 'function') {
        debugAuthTokens();
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      setToken(0);
      setIsAuthenticated(false);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
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
    
    if (isAuthPresent) {
      refreshTokenCount();
    } else {
      setToken(0);
      setIsAuthenticated(false);
    }
    
    // Listen for storage events that might affect authentication
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token' || event.key === 'X-Auth-Token' || event.key === 'Authorization') {
        console.log('Authentication storage changed:', event.key);
        const isAuthPresent = checkAuthenticationMechanisms();
        if (isAuthPresent) {
          refreshTokenCount();
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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