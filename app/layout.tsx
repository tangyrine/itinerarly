import React from 'react';

export const metadata = {
  title: 'Itinerary App',
  description: 'Plan and organize your trips effortlessly',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}