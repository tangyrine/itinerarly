"use client";

import dynamic from 'next/dynamic';

// Import the AuthDebugPanel with dynamic import to ensure it only runs on the client
const AuthDebugPanel = dynamic(
  () => import('@/components/AuthDebugPanel'),
  { ssr: false }
);

export default function AuthDebugWrapper() {
  return <AuthDebugPanel />;
}
