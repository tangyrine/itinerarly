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
  Star,
  Globe,
  MapPin,
  Calendar,
  Shield,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: Zap,
    label: "AI-Powered Planning",
    description:
      "Personalized itineraries crafted by AI based on your preferences",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    label: "Budget Control",
    description: "Clear cost estimates across different budget tiers",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Globe,
    label: "Local Insights",
    description: "Authentic recommendations for food, culture, and hidden gems",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    label: "Group Planning",
    description: "Collaborate with friends and family in real-time",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: MapPin,
    label: "Interactive Maps",
    description: "Visual journey planning with state-wise exploration",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Star,
    label: "Community Recommendations",
    description:
      "Community-driven suggestions for off-the-beaten-path experiences",
    gradient: "from-orange-500 to-purple-500",
  },
];

const stats = [
  { number: "5", label: "Happy Travelers" },
  { number: "7+", label: "Destinations" },
  { number: "98%", label: "Satisfaction Rate" },
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
  {
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    title: "Serene Mountain Views",
    location: "Himachal Pradesh",
  },
  {
    url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    title: "Pristine Beach Paradise",
    location: "Goa",
  },
  {
    url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
    title: "Historic Architecture",
    location: "Rajasthan",
  },
  {
    url: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=800&q=80",
    title: "Cultural Heritage",
    location: "Kerala",
  },
  {
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    title: "Urban Adventures",
    location: "Mumbai",
  },
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
    }, 4000);

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
      {/* Enhanced Background with Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Background video showing travel destinations"
          className="object-cover w-full h-full scale-105"
          poster="/assets/bg-poster.png"
        >
          <source src="/assets/background.mp4" type="video/mp4" />
        </video>
        {/* Multi-layered background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping" />
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-12 sm:space-y-16 lg:space-y-20">
          {/* Enhanced Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center space-y-6 sm:space-y-8 pt-8 sm:pt-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center space-x-3 mb-6"
            >
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-purple-400"></div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
                <span className="text-sm font-medium text-purple-400 tracking-wide">
                  AI-POWERED TRAVEL PLANNING
                </span>
                <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
              </div>
              <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-green-400"></div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
            >
              Welcome to{" "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-green-400 animate-gradient">
                  Itinerarly
                </span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-purple-400 rounded-full"
                />
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl leading-relaxed font-light max-w-4xl mx-auto text-gray-200"
            >
              Your intelligent and{" "}
              <span className="relative text-green-400 font-semibold">
                personalized
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-400 rounded-full"
                />
              </span>{" "}
              travel companion for exploring the diverse landscapes and rich
              cultural heritage of India.
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-orange-400 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/*  CTA Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center space-y-6 sm:space-y-8"
          >
            <motion.h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-100">
              Ready to explore{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-400">
                Incredible India
              </span>
              ?
            </motion.h2>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/start"
                className="group inline-flex items-center space-x-3 px-8 sm:px-12 lg:px-16 py-4 sm:py-5 text-lg sm:text-xl lg:text-2xl text-blue-800 font-bold bg-gradient-to-r from-green-400 via-orange-400 to-purple-400 rounded-full transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/25 relative overflow-hidden"
              >
                <span className="relative z-10">Start Your Journey</span>
                <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-orange-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Enhanced Features Section */}
          <motion.div
            id="features"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8 sm:space-y-12"
          >
            <div className="text-center space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
              >
                Why Choose{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-400">
                  Itinerarly
                </span>
                ?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-lg text-gray-300 max-w-2xl mx-auto"
              >
                Experience the future of travel planning with our cutting-edge
                features
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  whileHover={{
                    scale: 1.03,
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                  className="group relative bg-white/5 backdrop-blur-lg p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10 overflow-hidden"
                >
                  {/* Background glow effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                        className={`p-3 sm:p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                        {feature.label}
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Community Images Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-8 sm:space-y-12"
          >
            <div className="text-center space-y-4">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Community{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
                  Highlights
                </span>
              </h3>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Discover breathtaking destinations through the eyes of our
                travel community
              </p>
              
              {/* Imgur Upload Link */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="pt-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="https://imgur.com/upload"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center space-x-3 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600/80 to-orange-600/80 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                    <span className="relative z-10">Share Your Travel Photos</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                  </a>
                </motion.div>
                <p className="text-xs text-gray-400 mt-2">
                  Upload to Imgur and share your incredible India moments with our community
                </p>
              </motion.div>
            </div>

            <div className="relative w-full max-w-6xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{
                    transform: `translateX(-${currentImageIndex * 100}%)`,
                  }}
                >
                  {communityImages.map((img, idx) => (
                    <div key={idx} className="w-full flex-shrink-0 relative">
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover"
                        loading="lazy"
                      />
                      {/* Image overlay with info */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h4 className="text-xl sm:text-2xl font-bold mb-2">
                          {img.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-sm sm:text-base text-gray-200">
                          <MapPin className="w-4 h-4" />
                          <span>{img.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/*  Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-3 transition-all duration-300 items-center justify-center backdrop-blur-md border border-white/20 hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={nextImage}
                  className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-3 transition-all duration-300 items-center justify-center backdrop-blur-md border border-white/20 hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/*  Dots Indicator */}
              <div className="flex justify-center space-x-3 mt-6 sm:mt-8">
                {communityImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToImage(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      idx === currentImageIndex
                        ? "w-8 h-3 bg-white scale-110"
                        : "w-3 h-3 bg-white/40 hover:bg-white/60 hover:scale-110"
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Mobile Touch Hint */}
              <div className="sm:hidden flex justify-center mt-6">
                <div className="flex items-center space-x-3 text-sm text-gray-300 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                  <Calendar className="w-4 h-4" />
                  <span>Swipe to explore destinations</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center space-y-6 pt-8 sm:pt-12 pb-8 relative"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-3xl" />

            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Join{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-400">
                  50,000+
                </span>{" "}
                travelers discovering India
              </h3>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/start"
                    className="group w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-600 to-purple-600 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 relative overflow-hidden"
                  >
                    <Compass className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Explore Destinations</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/*  Loading Overlay */}
      {isLoading && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-center bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20"
          >
            <LoaderCircle className="w-16 h-16 text-orange-400 animate-spin mx-auto mb-4" />
            <p className="text-white text-lg font-medium">
              Preparing your adventure...
            </p>
            <p className="text-gray-300 text-sm mt-2">This won't take long</p>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Body;