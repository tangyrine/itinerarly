import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  LoaderCircle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Globe,
  MapPin,
  Star,
  Calendar
} from "lucide-react";
import { useRouter } from "next/navigation";
import Home from './Home';
import About from './About';
import Features from './Features';

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
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    title: "Serene Mountain Views",
    location: "Himachal Pradesh",
  },
  {
    url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    title: "Pristine Beach Paradise",
    location: "Goa",
  },
  {
    url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
    title: "Historic Architecture",
    location: "Uttar Pradesh",
  },
  {
    url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    title: "Cultural Heritage",
    location: "Kerala",
  },
  {
    url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
    title: "Urban Adventures",
    location: "Mumbai",
  },
];

const Body: React.FC<BodyProps> = ({ sectionRefs, sections }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showFloatingElements, setShowFloatingElements] = useState(false);

  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isLowEndDevice: false,
    supportsWebM: false,
    videoSrc: "",
  });

  useEffect(() => {
    const isMobile =
      window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent);

    const deviceMemory = (navigator as any).deviceMemory;
    const isLowEndDevice =
      navigator.hardwareConcurrency <= 2 ||
      (deviceMemory && deviceMemory <= 2) ||
      /Android.*Chrome\/[0-5]/.test(navigator.userAgent);

    const supportsWebM =
      document.createElement("video").canPlayType("video/webm") !== "";

    let videoSrc = "/assets/background.mp4";

    if (isMobile) {
      videoSrc = supportsWebM
        ? "/assets/optimized/background-mobile.webm"
        : "/assets/optimized/background-mobile.mp4";
    } else if (window.innerWidth >= 1441) {
      videoSrc = "/assets/optimized/background-hd.mp4";
    } else {
      videoSrc = supportsWebM
        ? "/assets/optimized/background-desktop.webm"
        : "/assets/optimized/background-desktop.mp4";
    }

    setDeviceInfo({ isMobile, isLowEndDevice, supportsWebM, videoSrc });

    const delay = isLowEndDevice ? 2000 : isMobile ? 1500 : 1000;

    const timer = setTimeout(() => {
      setShowVideo(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load();
        }
      }, 100);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === communityImages.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFloatingElements(true);
    }, 2000);

    return () => clearTimeout(timer);
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
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/bg-poster.png')",
          }}
        />

        {showVideo && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            aria-label="Background video showing travel destinations"
            className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-1000 ${
              videoLoaded ? "opacity-100" : "opacity-0"
            }`}
            poster="/assets/bg-poster.png"
            onLoadedData={() => {
              setVideoLoaded(true);
              if (videoRef.current) {
                setTimeout(() => {
                  videoRef.current?.play().catch((error) => {
                    console.error(
                      "Video autoplay prevented by browser:",
                      error
                    );
                  });
                }, 200);
              }
            }}
            onCanPlay={() => {
              setVideoLoaded(true);
            }}
            onError={(e) => {
              const video = e.target as HTMLVideoElement;
              const error = video.error;

              console.error("Video loading error details:", {
                code: error?.code,
                message: error?.message,
                networkState: video.networkState,
                readyState: video.readyState,
                currentSrc: video.currentSrc,
                src: video.src,
              });

              let errorMessage = "Unknown video error";
              if (error) {
                switch (error.code) {
                  case 1:
                    errorMessage = "Video loading aborted by user";
                    break;
                  case 2:
                    errorMessage = "Network error while loading video";
                    break;
                  case 3:
                    errorMessage = "Video decode error";
                    break;
                  case 4:
                    errorMessage = "Video format not supported";
                    break;
                }
              }

              console.warn(`Video Error: ${errorMessage}`);
              setVideoLoaded(false);
            }}
          >
            <source
              src={deviceInfo.videoSrc}
              type={
                deviceInfo.videoSrc.includes(".webm")
                  ? "video/webm"
                  : "video/mp4"
              }
              onError={(e) =>
                console.error(
                  "Primary video source failed:",
                  deviceInfo.videoSrc
                )
              }
            />
          </video>
        )}

        {/* Multi-layered background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>

      {/* Floating Elements - Load after delay for better performance */}
      {showFloatingElements && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping" />
          <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-12 sm:space-y-16 lg:space-y-20 min-h-screen">
          <Home />
          <About />
          <Features />

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

              {/* Imgur Upload and Submit Links */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="pt-4"
              >
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a
                      href="https://imgur.com/upload"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center space-x-3 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600/80 to-orange-600/80 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 relative overflow-hidden w-full sm:w-auto min-w-[220px]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                      <span className="relative z-10">
                        Share Your Travel Photos
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                    </a>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => {
                        window.open(
                          "https://docs.google.com/forms/d/e/1FAIpQLSex2El_Ag0yKlqho5a4bgoHYvJLfFF0zbcfBnyneJQjb607YA/viewform?usp=dialog",
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                      className="group inline-flex items-center space-x-3 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-600/80 to-blue-600/80 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 relative overflow-hidden w-full sm:w-auto min-w-[220px]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Star className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                      <span className="relative z-10">Submit Imgur Link</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                    </button>
                  </motion.div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Upload to Imgur and share your incredible India moments with
                  our community
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
                      <Image
                        src={img.url}
                        alt={img.title}
                        width={800}
                        height={500}
                        className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover"
                        loading={idx === 0 ? "eager" : "lazy"}
                        priority={idx === 0}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
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
                  className="flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 sm:p-3 transition-all duration-300 items-center justify-center backdrop-blur-md border border-white/20 hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <button
                  onClick={nextImage}
                  className="flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 sm:p-3 transition-all duration-300 items-center justify-center backdrop-blur-md border border-white/20 hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
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

              {/* Mobile Navigation Hint */}
              <div className="sm:hidden flex justify-center mt-6">
                <div className="flex items-center space-x-3 text-sm text-gray-300 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                  <Calendar className="w-4 h-4" />
                  <span>Use arrows to explore destinations</span>
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
          </motion.div>

          {/* Back to top button */}
          {showFloatingElements && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-gradient-to-r from-orange-500/80 to-purple-500/80 shadow-lg shadow-orange-500/20 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110"
              aria-label="Back to top"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </motion.button>
          )}
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
