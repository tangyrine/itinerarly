import '../styles/global.css';
import React from 'react';
import { Analytics } from '@vercel/analytics/react'
import { TokenProvider } from '@/lib/TokenProvider';
import { GoogleAnalytics } from '@next/third-parties/google'


export const metadata = {
  title: 'Itinerary App',
  description: 'Plan and organize your trips effortlessly',
};


export default function Layout({ children }: { children: React.ReactNode }) {

  const gaId = process.env.GA_ID ;

  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <TokenProvider>
          {children}
        </TokenProvider>
        <Analytics />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}