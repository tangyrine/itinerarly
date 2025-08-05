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

import { FaFacebook, FaGithub, FaGoogle, FaTwitter } from "react-icons/fa";


interface SignInModalProps {
  openModal: boolean;
  onClose: () => void; 
}

  const SiteUrl: string = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8080";



const signInWithGithub = () => {
  window.location.href = `${SiteUrl}/oauth2/authorization/github`;
}

const signInWithTwitter = () => {
  window.location.href = `${SiteUrl}/oauth2/authorization/twitter`;
}

const signInWithGoogle = () => {
  window.location.href = `${SiteUrl}/oauth2/authorization/google`;
};

const signInWithFacebook= () => {
  window.location.href = `${SiteUrl}/oauth2/authorization/facebook`;
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
        <div className="flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0 md:space-x-4
            p-2">
          <button className="cursor-pointer border border-black h-20 w-20 flex justify-center items-center" onClick={signInWithGoogle}>
            <FaGoogle className="h-10 w-10 text-center"/>
          </button>
          <button className="cursor-pointer border border-black h-20 w-20 flex justify-center items-center" onClick={signInWithGithub}>
            <FaGithub className="h-10 w-10 text-center"/>
          </button>
          <button className="cursor-pointer border border-black h-20 w-20 flex justify-center items-center" onClick={signInWithTwitter}>
            <FaTwitter className="h-10 w-10 text-center"/>
          </button>
          <button className="cursor-pointer border border-black h-20 w-20 flex justify-center items-center" onClick={signInWithFacebook}>
            <FaFacebook className="h-10 w-10 text-center"/>
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