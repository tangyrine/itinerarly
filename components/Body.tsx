import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mountain,
  Waves,
  Landmark,
  Palmtree,
  Compass,
  Users,
  LoaderCircle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: Mountain,
    label: "AI-Powered Planning",
    description:
      "Personalized itineraries crafted by AI based on your preferences",
  },
  {
    icon: Waves,
    label: "Budget Control",
    description: "Clear cost estimates across different budget tiers",
  },
  {
    icon: Landmark,
    label: "Local Insights",
    description: "Authentic recommendations for food, culture, and hidden gems",
  },
  {
    icon: Palmtree,
    label: "Group Planning",
    description: "Collaborate with friends and family in real-time",
  },
  {
    icon: Compass,
    label: "Interactive Maps",
    description: "Visual journey planning with state-wise exploration",
  },
  {
    icon: Users,
    label: "Community Recommendations",
    description:
      "Community-driven suggestions for off-the-beaten-path experiences",
  },
];

interface BodyProps {
  sectionRefs: Array<{ ref: (node?: Element | null) => void }>;
  sections: Array<{
    id: string;
    title: string;
    description: string;
    places: string[];
  }>;
}

const communityImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
];

const Body: React.FC<BodyProps> = ({ sectionRefs, sections }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === communityImages.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const scrollToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === communityImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? communityImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Background video showing travel destinations"
          className="object-cover w-full h-full"
          poster="/assets/bg-poster.png"
        >
          <source src="/assets/background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12 lg:space-y-16">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-4 sm:space-y-6 pt-8 sm:pt-16"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
              <span className="text-sm sm:text-base text-yellow-400 font-medium">
                AI-Powered Travel Planning
              </span>
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-playfair tracking-wide leading-tight">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">
                Itinerarly
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-light max-w-4xl mx-auto text-gray-200">
              Your intelligent and{" "}
              <span className="text-yellow-400 font-semibold">personalized</span>{" "}
              travel companion for exploring the diverse landscapes and rich
              cultural heritage of India.
            </p>
          </motion.div>

          {/* CTA Section - Moved up for better mobile UX */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center space-y-4 sm:space-y-6"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-100">
              Ready to explore India?
            </h2>
            <Link
              href="/start"
              className="inline-flex items-center space-x-3 px-6 sm:px-8 lg:px-12 py-3 sm:py-4 text-base sm:text-lg lg:text-xl text-black font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-300 hover:from-yellow-300 hover:to-orange-300 hover:shadow-2xl hover:scale-105 transform active:scale-95"
            >
              <span>Start Planning</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
          </motion.div>

          {/* Features Section */}
          <motion.div
            id="features"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6 sm:space-y-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white">
              Why Choose Itinerarly?
            </h2>
            
            {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-white/10 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-2xl hover:bg-white/15"
                >
                  <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg">
                      <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      {feature.label}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Community Images Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-white">
              Community Highlights
            </h3>

            {/* Mobile-First Carousel */}
            <div className="relative w-full">
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-2xl mx-auto max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentImageIndex * 100}%)`,
                  }}
                >
                  {communityImages.map((img, idx) => (
                    <div key={idx} className="w-full flex-shrink-0">
                      <img
                        src={img}
                        alt={`Community travel photo ${idx + 1}`}
                        className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows - Hidden on mobile */}
                <button
                  onClick={prevImage}
                  className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 sm:p-3 transition-all duration-200 items-center justify-center backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <button
                  onClick={nextImage}
                  className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 sm:p-3 transition-all duration-200 items-center justify-center backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center space-x-2 mt-4 sm:mt-6">
                {communityImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToImage(idx)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                      idx === currentImageIndex
                        ? "bg-white scale-125"
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Mobile Touch Hint */}
              <div className="sm:hidden flex justify-center mt-4">
                <div className="flex items-center space-x-2 text-xs text-gray-300 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                  <span>Swipe or tap dots to explore</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center space-y-4 pt-8 sm:pt-12 pb-8"
          >
            <p className="text-lg sm:text-xl text-gray-300">
              Join thousands of travelers discovering India
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                href="/start"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 hover:scale-105 transform active:scale-95"
              >
                <Compass className="w-5 h-5" />
                <span>Explore Destinations</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-center"
          >
            <LoaderCircle className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-spin mx-auto" />
            <p className="text-white mt-4 text-sm sm:text-base">
              Loading your destination...
            </p>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Body;