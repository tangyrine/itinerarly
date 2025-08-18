"use client";

import { Suspense, useState } from "react";
import IndiaMap from "@/components/IndiaMap";
import Navbar from "@/components/Navbar";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaUmbrellaBeach } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { Drawer } from "vaul";
import { SignInModal } from "@/components/SignInModal";
import { useToken } from "@/lib/TokenProvider";
import Cookies from "js-cookie";

type SectionType = "hillstations" | "beaches" | "wildlife" | "historical";

function MapWithParams() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  return <IndiaMap type={type} />;
}

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [plannerDrawerOpen, setPlannerDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { isTokenAvailable } = useToken();

  const handleDestinationChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setIsLoading(true);
    const selectedType = e.target.value as SectionType;
    try {
      await router.push(`/start?type=${selectedType}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlannerClick = () => {
    // Check if user is logged in
    const loggedIn = Cookies.get("isLoggedIn") === "true";
    if (!loggedIn) {
      setOpenModal(true);
      return;
    }
    
    if (!isTokenAvailable) {
      alert("You don't have enough tokens. Please wait for them to refresh.");
      return;
    }
    
    setPlannerDrawerOpen(true);
  };

  const handleModal = () => {
    setOpenModal(!openModal);
  };

  return (
    <div className="flex flex-col w-full h-screen relative">
      {/* Use global Navbar for consistency */}
      <div className="flex-none relative z-50">
        <Navbar />
      </div>
      
      {/* Main content area with map and planner */}
      <div className="flex-grow flex flex-col bg-blue-500 relative">
        {/* Simplified planner header */}
        <div className="flex-none relative z-10">
          <div className="flex justify-center items-center h-16 bg-blue-600 relative">
            <button
              onClick={() => router.push("/")}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800 transition"
              type="button"
            >
              <IoMdHome />
            </button>
            
            {/* Simple planner trigger button */}
            <button
              onClick={handlePlannerClick}
              className="p-2 text-white text-center rounded cursor-pointer shadow-md bg-blue-700 hover:bg-blue-800 transition flex items-center justify-center"
            >
              <span className="block sm:hidden">
                <FaUmbrellaBeach className="w-5 h-5" />
              </span>
              <span className="hidden sm:block">Open Planner</span>
            </button>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center w-full max-w-md mx-auto py-5 relative z-0"
        >
          <select
            onChange={handleDestinationChange}
            className="lg:w-full px-4 py-3 text-center rounded-lg bg-white/10 backdrop-blur-sm text-[#f7e9d5] border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all md:w-1/2"
            defaultValue=""
            disabled={isLoading}
          >
            <option value="" disabled>
              Select your destination type
            </option>
            <option value="hillstations">Hill Stations</option>
            <option value="beaches">Beaches</option>
            <option value="wildlife">Wildlife Sanctuaries</option>
            <option value="historical">Historical Sites</option>
            <option value="cities">Cities</option>
            <option value="none">Entire India Map</option>
          </select>
        </motion.div>
        <div className="flex-grow min-h-0 relative z-0">
          <Suspense
            fallback={
              <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-white">Loading map...</p>
                </div>
              </div>
            }
          >
            <MapWithParams />
          </Suspense>
        </div>
      </div>
      
      {/* Simple Sign In Modal */}
      <SignInModal openModal={openModal} onClose={handleModal} />
    </div>
  );
}