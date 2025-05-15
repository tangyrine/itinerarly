import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const Page: React.FC = () => {
  return (
    <div>
      <Navbar />
        <main className="min-h-screen p-8">
          <h1>Welcome to Itinerary App</h1>
          <p>This is the main page of your application.</p>
        </main>
      <Footer />
    </div>
  );
};

export default Page;
