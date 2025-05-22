import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const sections = [
  {
    key: "mountains",
    title: "Mountains of India",
    description:
      "Explore the majestic Himalayas, Western Ghats, and Eastern Ghats. Visit places like Himachal Pradesh, Uttarakhand, Sikkim, Arunachal Pradesh, and Kashmir.",
    bg: "/bg-mountains.jpg",
  },
  {
    key: "beaches",
    title: "Beaches of the Indian Subcontinent",
    description:
      "Relax on the serene beaches of Goa, Kerala, Andaman & Nicobar, Lakshadweep, Odisha, Tamil Nadu, and Maharashtra.",
    bg: "/bg-beaches.jpg",
  },
  {
    key: "forest",
    title: "Forests & Wildlife",
    description:
      "Discover forest reserves like Jim Corbett, Sundarbans, Kaziranga, Gir, Bandipur, and Periyar. Experience diverse flora and fauna.",
    bg: "/bg-forest.jpg",
  },
  {
    key: "history",
    title: "Historical Places",
    description:
      "Travel through time in cities like Delhi, Agra, Jaipur, Varanasi, Hampi, Hyderabad, and Kolkata, each with a rich historical legacy.",
    bg: "/bg-history.jpg",
  },
  {
    key: "cities",
    title: "Tier 1 Cities",
    description:
      "Experience the vibrancy of Mumbai, Delhi, Bengaluru, Chennai, Hyderabad, and Kolkata, with their unique culture and modern amenities.",
    bg: "/bg-cities.jpg",
  },
];

const Body: React.FC = () => {
  const [activeBg, setActiveBg] = useState(sections[0].bg);

  // Create refs for each section
  const [refs, inViews] = sections.map(() => useInView({ threshold: 0.5 })).reduce(
    (acc, curr) => {
      acc[0].push(curr.ref);
      acc[1].push(curr.inView);
      return acc;
    },
    [[], []] as [any[], boolean[]]
  );

  useEffect(() => {
    const idx = inViews.findIndex(Boolean);
    if (idx !== -1) setActiveBg(sections[idx].bg);
  }, [inViews]);

  return (
    <div
      className="relative min-h-[100vh] transition-all duration-700"
      style={{
        backgroundImage: `url(${activeBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="relative z-10 flex flex-col items-center min-h-[100vh] text-white px-4 md:px-8">
        <motion.h1
          className="text-4xl md:text-6xl font-bold font-playfair mt-16 mb-8 text-center"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Welcome to Itinerarly, your all-in-one personalised travel advisor
        </motion.h1>
        <div className="max-w-5xl mx-auto w-full space-y-32">
          {sections.map((section, idx) => (
            <motion.section
              key={section.key}
              ref={refs[idx]}
              className="py-20 px-4 rounded-3xl bg-white/10 shadow-lg backdrop-blur-md"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: idx * 0.1, ease: "easeOut" }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 font-playfair">
                {section.title}
              </h2>
              <p className="text-xl md:text-2xl font-light">{section.description}</p>
            </motion.section>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
        >
          <Link
            href="/start"
            className="inline-block mt-16 px-12 py-5 text-xl font-semibold bg-blue-600 
              rounded-full transition-all duration-300 hover:scale-105 
              hover:bg-blue-700 hover:shadow-xl"
          >
            Start Your Journeys
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Body;