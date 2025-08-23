"use client";

import { Suspense, useState, useEffect } from "react";
import IndiaMap from "@/components/IndiaMap";
import Planner from "@/components/Planner";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToken } from "@/lib/TokenProvider";

type SectionType = "hillstations" | "beaches" | "wildlife" | "historical";

function MapWithParams() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  return <IndiaMap type={type} />;
}

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { refreshTokenCount } = useToken();


  useEffect(() => {
    refreshTokenCount().catch(err => {
      console.error("Error refreshing authentication state:", err);
    });
  }, []);

  const handleDestinationChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log("Destination change triggered:", e.target.value); 
    setIsLoading(true);
    const selectedType = e.target.value as SectionType;
    try {
      console.log("Pushing to router:", `/start?type=${selectedType}`); 
      await router.replace(`/start?type=${selectedType}`);
    } catch (error) {
      console.error("Router error:", error); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-blue-500 relative">
      <div className="flex-none relative z-10">
        <Planner />
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
  );
}