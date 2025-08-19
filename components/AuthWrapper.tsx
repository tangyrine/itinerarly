"use client";

import dynamic from 'next/dynamic';

const AuthenticationTester = dynamic(
  () => import('@/components/AuthenticationTester'),
  { ssr: false }
);

export default function AuthWrapper() {
  return <AuthenticationTester />;
}
