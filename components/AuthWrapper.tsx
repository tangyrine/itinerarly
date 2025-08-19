"use client";

import dynamic from 'next/dynamic';

// Import the AuthenticationTester with dynamic import to ensure it only runs on the client
const AuthenticationTester = dynamic(
  () => import('@/components/AuthenticationTester'),
  { ssr: false }
);

export default function AuthWrapper() {
  return <AuthenticationTester />;
}
