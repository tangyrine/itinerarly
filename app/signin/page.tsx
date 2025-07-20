"use client";
import { SignInModal } from "@/components/SignInModal";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f7e9d5]">
      <SignInModal openModal={true} onClose={() => {}} />
    </div>
  );
}