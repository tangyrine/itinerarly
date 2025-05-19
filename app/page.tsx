'use client'

import Body from "@/components/Body";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const Page: React.FC = () => {
  return (
    <div>
      {/* Video background container for Navbar and Body */}
      <div className="relative min-h-screen flex flex-col">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          src="/assets/background.mp4"
        >
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Body />
          </main>
        </div>
      </div>

      {/* Footer outside the video background */}
      <Footer />
    </div>
  );
};

export default Page;