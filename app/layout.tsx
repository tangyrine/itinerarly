import "../styles/global.css";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { TokenProvider } from "@/lib/TokenProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Chatbot } from "@/components/Chatbot";

export const metadata = {
  title: "Itinerary App",
  description: "Plan and organize your trips effortlessly",
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌴</text></svg>',
      },
    ],
    apple: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌴</text></svg>',
      },
    ],
  },
  keywords: ["travel", "trip planner", "itinerary", "vacation", "Itinerarly"],
  openGraph: {
    title: "Itinerarly",
    description: "Your smart travel companion",
    url: "https://itinerarly-fe.vercel.app",
    siteName: "Itinerarly",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.GA_ID;

  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <TokenProvider>{children}</TokenProvider>
        <Chatbot />
        <Analytics />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
