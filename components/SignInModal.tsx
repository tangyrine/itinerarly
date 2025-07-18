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

import {signinWithGoogle} from "@/lib/utils/actions";


interface SignInModalProps {
  openModal: boolean;
  onClose: () => void; 
}


const signInWithGithub = () => {
  console.log("Signing in with Github");
}

const signInWithApple = () => {
  console.log("Signing in with Apple");
}

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
        <div className="grid gap-4">
          <button className="cursor-pointer bg-amber-300 h-7" onClick={signinWithGoogle}>
            Sign in with Google
          </button>
          <button className="cursor-pointer bg-amber-300 h-7" onClick={signInWithGithub}>
            Sign in with Github
          </button>
          <button className="cursor-pointer bg-amber-300 h-7" onClick={signInWithApple}>
            Sign in with Apple
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