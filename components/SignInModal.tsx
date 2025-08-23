import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FaGithub, FaGoogle } from "react-icons/fa";
import React, { useEffect, useState, useRef } from "react";
import { useToken } from "@/lib/TokenProvider";


interface SignInModalProps {
  openModal: boolean;
  onClose: () => void; 
}


const SiteUrl: string = process.env.NEXT_PUBLIC_SITE_URL || "https://itinerarly-be.onrender.com";


const signInWithGithub = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem("oauthFlowStarted", "github");
    sessionStorage.setItem("oauthFlowTimestamp", new Date().toISOString());
    sessionStorage.setItem("authInProgress", "true");
  }

  window.location.href = `${SiteUrl}/oauth2/authorization/github`;
}

const signInWithGoogle = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem("oauthFlowStarted", "google");
    sessionStorage.setItem("oauthFlowTimestamp", new Date().toISOString());
    sessionStorage.setItem("authInProgress", "true");
  }

  window.location.href = `${SiteUrl}/oauth2/authorization/google`;
};

export function SignInModal({ openModal, onClose }: SignInModalProps) {
  const { refreshTokenCount, isAuthenticated } = useToken();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const hasHandled = useRef(false);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const url = new URL(window.location.href);
      const hasAuthParams = url.searchParams.has('token') || 
                            url.searchParams.has('code') || 
                            url.searchParams.has('auth') ||
                            url.searchParams.has('state');

      const oauthFlowStarted = typeof window !== 'undefined' ? sessionStorage.getItem("oauthFlowStarted") : null;
      const authInProgress = typeof window !== 'undefined' ? sessionStorage.getItem("authInProgress") : null;

      if (hasAuthParams || (oauthFlowStarted && authInProgress)) {
        console.log("OAuth flow detected, processing authentication...");
        setIsAuthenticating(true);
        
        try {
          await refreshTokenCount();
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem("oauthFlowStarted");
            sessionStorage.removeItem("oauthFlowTimestamp");
            sessionStorage.removeItem("authInProgress");
          }

          if (hasAuthParams) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          
          setIsAuthenticating(false);
          setTimeout(() => {
            if (isAuthenticated) {
              onClose();
              window.location.replace("/start");
            }
          }, 500);
        } catch (error) {
          console.error("Authentication failed:", error);
          setIsAuthenticating(false);
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem("oauthFlowStarted");
            sessionStorage.removeItem("oauthFlowTimestamp");
            sessionStorage.removeItem("authInProgress");
          }
        }
      }
    };

    if (openModal) {
      handleOAuthCallback();
    }
    
    return () => {
      hasHandled.current = false;
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && typeof window !== 'undefined' && 
        !sessionStorage.getItem("authInProgress") && 
        !hasHandled.current) {
      hasHandled.current = true;
      onClose();
    }
  }, [isAuthenticated, onClose]);

  useEffect(() => {
    if (openModal && isAuthenticated) {
      onClose();
    }
  }, [openModal, isAuthenticated, onClose]);

  return (
    <Dialog open={openModal} onOpenChange={onClose}>
      <DialogContent className="w-[90%] max-w-[425px] p-4 sm:p-6 bg-white shadow-xl rounded-lg border border-gray-300">
        <DialogHeader className="space-y-2 mb-4">
          <DialogTitle className="text-xl sm:text-2xl text-center sm:text-left">Sign In</DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-center sm:text-left">
            Choose your preferred authentication method to access your account.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center gap-6 py-4">
          <button 
            className="flex flex-col items-center gap-2 border border-gray-300 rounded-xl p-4 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500" 
            onClick={signInWithGoogle}
            disabled={isAuthenticating || (typeof window !== 'undefined' && sessionStorage.getItem("authInProgress") === "true")}
          >
            <FaGoogle className="h-8 w-8 text-blue-500"/>
            <span className="text-sm font-medium">Google</span>
          </button>
          <button 
            className="flex flex-col items-center gap-2 border border-gray-300 rounded-xl p-4 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500" 
            onClick={signInWithGithub}
            disabled={isAuthenticating || (typeof window !== 'undefined' && sessionStorage.getItem("authInProgress") === "true")}
          >
            <FaGithub className="h-8 w-8 text-gray-800"/>
            <span className="text-sm font-medium">GitHub</span>
          </button>
        </div>
        
        {(isAuthenticating || (typeof window !== 'undefined' && sessionStorage.getItem("authInProgress") === "true")) && (
          <div className="text-center text-sm text-gray-600 p-2 mt-2 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2 py-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Authenticating... Please wait.</span>
            </div>
          </div>
        )}
        
        <DialogFooter className="mt-4 sm:mt-6">
          <DialogClose asChild>
            <Button 
              variant="outline" 
              disabled={isAuthenticating}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}