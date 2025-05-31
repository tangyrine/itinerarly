"use client";

import IndiaMap from "@/components/IndiaMap";
import Planner from "@/components/Planner";

export default function Page() {
  return (
    <>
      <Planner />

      <div className="w-full h-screen bg-blue-500">
        <IndiaMap />
      </div>
    </>
  );
}
