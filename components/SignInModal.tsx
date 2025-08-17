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

import {  FaGithub, FaGoogle } from "react-icons/fa";


interface SignInModalProps {
  openModal: boolean;
  onClose: () => void; 
}

// Use production backend URL as default, with environment variable override
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
          {/* <button className="cursor-pointer border border-black h-20 w-20 flex justify-center items-center" onClick={signInWithFacebook}>
            <FaFacebook className="h-10 w-10 text-center"/>
          </button> */}
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