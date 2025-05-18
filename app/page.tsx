'use client'

import Body from "@/components/Body";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const Page: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Body/>
      </main>
      <Footer />
    </div>
  );
};

export default Page;