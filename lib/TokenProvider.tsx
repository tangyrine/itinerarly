"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const SiteUrl: string = process.env.NEXT_PUBLIC_SITE_URL || "https://itinerarly-be.onrender.com";

// Define a function to check all possible authentication mechanisms
function checkAuthenticationMechanisms() {
  const authMechanisms = {
    cookies: {
      jsessionid: Cookies.get("JSESSIONID") || null,
      authToken: Cookies.get("auth-token") || null, 
      altAuthToken: Cookies.get("authToken") || null
    },
    localStorage: {
      token: localStorage.getItem("token") || null,
      xAuthToken: localStorage.getItem("X-Auth-Token") || null,
      authHeader: localStorage.getItem("Authorization") || null
    }
  };
  
  console.log("Authentication mechanisms check:", authMechanisms);
  
  // Return true if any authentication mechanism is present
  return (
    !!authMechanisms.cookies.jsessionid || 
    !!authMechanisms.cookies.authToken || 
    !!authMechanisms.cookies.altAuthToken ||
    !!authMechanisms.localStorage.token ||
    !!authMechanisms.localStorage.xAuthToken ||
    !!authMechanisms.localStorage.authHeader
  );
}

interface TokenContextType {
  token: number | undefined;
  isLoading: boolean;
  error: string | null;
  refreshTokenCount: () => Promise<void>;
  consumeToken: () => Promise<boolean>;
  isTokenAvailable: boolean;
}

const TokenContext = createContext<TokenContextType>({
  token: undefined,
  isLoading: false,
  error: null,
  refreshTokenCount: async () => {},
  consumeToken: async () => false,
  isTokenAvailable: false,
});

export function TokenProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isTokenAvailable = typeof token === 'number' && token > 0;

  const refreshTokenCount = async (): Promise<void> => {
    const authToken = Cookies.get("auth-token");
    const altAuthToken = Cookies.get("authToken");
    
    console.log("Authentication tokens:", { 
      authToken: authToken ? "Present" : "Not found", 
      altAuthToken: altAuthToken ? "Present" : "Not found",
      jsessionid: Cookies.get("JSESSIONID") ? "Present" : "Not found"
    });
    
    if (!authToken && !altAuthToken && !Cookies.get("JSESSIONID")) {
      setToken(0);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const headers: Record<string, string> = {};
      
      // Try with X-Auth-Token header
      if (authToken) {
        headers["X-Auth-Token"] = authToken;
      }
      
      // Try with Authorization header
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }
      
      const response = await axios.get(`${SiteUrl}/api/v1/tokens/remaining`, {
        withCredentials: true,
        headers
      });
      
      // Check which authentication method worked
      console.log("Response headers:", response.headers);
      
      setToken(response.data.remainingTokens ?? 0);
      console.log("Token count refreshed:", response.data.remainingTokens);
    } catch (error) {
      console.error("Error fetching tokens:", error);
      setToken(0);
      
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
    const authToken = Cookies.get("auth-token");
    const altAuthToken = Cookies.get("authToken");
    
    if (!authToken && !altAuthToken && !Cookies.get("JSESSIONID")) {
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
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      };
      
      // Try with X-Auth-Token header
      if (authToken) {
        headers["X-Auth-Token"] = authToken;
      } else if (altAuthToken) {
        headers["X-Auth-Token"] = altAuthToken;
      }
      
      // Try with Authorization header
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      } else if (altAuthToken) {
        headers["Authorization"] = `Bearer ${altAuthToken}`;
      }
      
      const response = await axios.post(
        `${SiteUrl}/api/v1/tokens/consume`,
        {},
        {
          withCredentials: true,
          headers,
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
    // Check all authentication mechanisms
    const isAuthenticated = checkAuthenticationMechanisms();
    
    if (isAuthenticated) {
      refreshTokenCount();
    } else {
      setToken(0);
    }
    
    // Listen for storage events that might affect authentication
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token' || event.key === 'X-Auth-Token' || event.key === 'Authorization') {
        console.log('Authentication storage changed:', event.key);
        checkAuthenticationMechanisms();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = checkAuthenticationMechanisms();
      
      if (isAuthenticated) {
        refreshTokenCount();
      } else {
        setToken(0);
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
    isTokenAvailable
  };

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>;
}

export function useToken() {
  return useContext(TokenContext);
}