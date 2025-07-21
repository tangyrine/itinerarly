"use client";
import { SignInModal } from "@/components/SignInModal";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "auth") {
      setShowError(true);
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f7e9d5] flex-col">
      {showError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Failed to authenticate. Please try again.
        </div>
      )}
      <SignInModal openModal={true} onClose={() => {}} />
    </div>
  );
}