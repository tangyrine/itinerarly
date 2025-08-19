"use client";

import dynamic from 'next/dynamic';
const AuthDebugPanel = dynamic(
  () => import('@/components/AuthDebugPanel'),
  { ssr: false }
);

export default function AuthDebugWrapper() {
  return <AuthDebugPanel />;
}
