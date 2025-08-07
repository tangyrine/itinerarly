"use client";
import { SignInModal } from "@/components/SignInModal";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function SignInContent() {
  const searchParams = useSearchParams();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "auth") {
      setShowError(true);
    }
  }, [searchParams]);

  return (
    <>
      {showError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Failed to authenticate. Please try again.
        </div>
      )}
      <SignInModal openModal={true} onClose={() => {window.location.href = '/'}} />
    </>
  );
}

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f7e9d5] flex-col">
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <SignInContent />
      </Suspense>
    </div>
  );
}