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
import { useEffect } from "react";
import { useToken } from "@/lib/TokenProvider";


interface SignInModalProps {
  openModal: boolean;
  onClose: () => void; 
}


const SiteUrl: string = process.env.NEXT_PUBLIC_SITE_URL || "https://itinerarly-be.onrender.com";

// Debug environment variable loading
if (typeof window !== 'undefined') {
  console.log('Environment check:', {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    SiteUrl,
    isProduction: process.env.NODE_ENV === 'production'
  });
}

const signInWithGithub = () => {
  console.log("Redirecting to:", `${SiteUrl}/oauth2/authorization/github`);
  window.location.href = `${SiteUrl}/oauth2/authorization/github`;
}

const signInWithGoogle = () => {
  console.log("Redirecting to:", `${SiteUrl}/oauth2/authorization/google`);
  window.location.href = `${SiteUrl}/oauth2/authorization/google`;
};

export function SignInModal({ openModal, onClose }: SignInModalProps) {
  const { refreshTokenCount } = useToken();

  // Check for authentication redirect
  useEffect(() => {
    // Check if we've been redirected back from OAuth
    const url = new URL(window.location.href);
    const hasAuthParams = url.searchParams.has('token') || 
                          url.searchParams.has('code') || 
                          url.searchParams.has('auth');
    
    // If we have auth params, we were redirected back from OAuth
    if (hasAuthParams) {
      console.log("OAuth redirect detected");
      
      // Refresh token count to check authentication status
      refreshTokenCount().then(() => {
        // Clean up URL params to avoid keeping sensitive info in browser history
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    }
  }, [refreshTokenCount]);

  return (
    <Dialog open={openModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white shadow-xl rounded-lg border border-gray-300">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col md:flex-row md:justify-around space-y-4 md:space-y-0 md:space-x-4
            p-2">
          <button className="cursor-pointer border border-black h-20 w-20 flex justify-center items-center" onClick={signInWithGoogle}>
            <FaGoogle className="h-10 w-10 text-center"/>
          </button>
          <button className="cursor-pointer border border-black h-20 w-20 flex justify-center items-center" onClick={signInWithGithub}>
            <FaGithub className="h-10 w-10 text-center"/>
          </button>

        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}