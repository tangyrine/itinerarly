import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mountain,
  Waves,
  Landmark,
  Palmtree,
  Compass,
  Users,
  Loader2,
} from "lucide-react";

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

const Body: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStartJourney = async () => {
    setIsLoading(true);
    await router.push("/start");
  };

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 flex flex-col justify-center min-h-screen text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 space-y-32">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center md:text-left space-y-6 md:pl-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-playfair tracking-wide">
              Welcome to Itinerarly
            </h1>
            <p className="text-lg md:text-xl leading-relaxed font-light max-w-3xl">
              Your intelligent travel companion for exploring the diverse
              landscapes and rich cultural heritage of India.
            </p>
          </motion.div>

          {/* About Section */}
          <motion.div
            id="about"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center 
              md:text-right md:ml-auto md:max-w-2xl"
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              About Us
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              We combine artificial intelligence with local expertise to create
              personalized travel experiences. From the snow-capped Himalayas to
              the tropical beaches of Kerala, let us help you discover India's
              hidden treasures.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            id="features"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            className="space-y-8 md:pl-8"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-center md:text-left">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white/10 backdrop-blur-sm p-8 rounded-xl 
                    transform transition-all duration-300 hover:shadow-xl"
                >
                  <feature.icon className="w-8 h-8 mb-4 text-blue-400" />
                  <h3 className="text-lg font-semibold mb-3">
                    {feature.label}
                  </h3>
                  <p className="text-sm text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
            className="text-center space-y-6 mx-auto max-w-xl"
          >
            <h2 className="text-2xl font-semibold">
              Ready to Start Your Journey?
            </h2>
            <button
              onClick={handleStartJourney}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-medium 
        bg-blue-600/90 rounded-lg transition-all duration-300 
        hover:bg-blue-500 hover:shadow-xl hover:scale-105
        backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:scale-100 disabled:hover:bg-blue-600/90"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Get Started"
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Body;
