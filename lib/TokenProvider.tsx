"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const SiteUrl: string = process.env.NEXT_PUBLIC_SITE_URL || "https://itinerarly-be.onrender.com";

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
    if (!Cookies.get("auth-token")) {
      setToken(0);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${SiteUrl}/api/v1/tokens/remaining`, {
        withCredentials: true,
      });
      
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
    if (!Cookies.get("auth-token")) {
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
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
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
    const authToken = Cookies.get("auth-token");
    if (authToken) {
      refreshTokenCount();
    } else {
      setToken(0); 
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = !!Cookies.get("auth-token");
      if (isLoggedIn) {
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