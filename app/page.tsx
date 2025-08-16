"use client";

import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Body from "@/components/Body";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { sections } from "@/data/sections";

const Page: React.FC = () => {
  const [currentBackground, setCurrentBackground] = useState(
    sections[0].backgroundImage
  );
 
  const sectionRefs = sections.map(() =>
    useInView({
      threshold: 0.5,
      triggerOnce: false,
    })
  );

  const inViewStates = sectionRefs.map(ref => ref.inView);

  useEffect(() => {
    const visibleSectionIndex = inViewStates.findIndex(inView => inView);
    if (visibleSectionIndex !== -1) {
      setCurrentBackground(sections[visibleSectionIndex].backgroundImage);
    }
  }, [...inViewStates]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Body
          sectionRefs={sectionRefs}
          sections={sections.map(({ id, title, description, places }) => ({
            id,
            title,
            description,
            places: places.map(place => place.name)
          }))}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Page;