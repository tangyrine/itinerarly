"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Drawer } from "vaul";
import ItineraryGeneration from "../lib/ItineraryGeneration";
import Itinerary from "./Itinerary";
import Chat from "./Chat";
import { IoMdHome } from "react-icons/io";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { GoNorthStar } from "react-icons/go";
import axios from "axios";

export default function Planner() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [plannerMode, setPlannerMode] = useState<"manual" | "month">("manual");
  const [formData, setFormData] = useState({
    destination: "",
    people: "",
    days: "",
    budget: "",
  });
  const [monthData, setMonthData] = useState({
    month: "",
    people: "",
    days: "",
    budget: "",
  });
  const [itinerary, setItinerary] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMonthChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMonthData((prev) => ({ ...prev, [name]: value }));
  };

  const generateItinerary = async () => {
    setLoading(true);
    try {
      const result = await ItineraryGeneration(formData);
      setItinerary(result ?? "");
      setShowModal(true);
      setDrawerOpen(false);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      setItinerary("Sorry, we couldn't generate an itinerary. Please try again.");
      setShowModal(true);
      setDrawerOpen(false);
    }
    setLoading(false);
  };

  const generateMonthBasedItinerary = async () => {
    console.log("=== generateMonthBasedItinerary called ===");
    console.log("Current monthData state:", monthData);
    
    setLoading(true);
    try {
      const result = await generateMonthBasedTrip(monthData);
      console.log("Result received:", result);
      
      setItinerary(result ?? "");
      console.log("Itinerary state set to:", result ?? "");
      
      setShowModal(true);
      console.log("Modal should now be open");
      
      setDrawerOpen(false);
    } catch (error) {
      console.error("Error generating month-based itinerary:", error);
      const errorMessage = "Sorry, we couldn't generate an itinerary for your selected month. Please try again.";
      setItinerary(errorMessage);
      console.log("Error itinerary set to:", errorMessage);
      setShowModal(true);
      setDrawerOpen(false);
    }
    setLoading(false);
    console.log("=== generateMonthBasedItinerary completed ===");
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <>
      <div className="flex justify-center items-center h-16 bg-blue-600 relative">
        <button
          onClick={() => router.push("/")}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800 transition"
          type="button"
        >
          <IoMdHome />
        </button>

        <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
          <Drawer.Trigger asChild>
            <div className="p-2 text-white text-center rounded cursor-pointer shadow-md bg-blue-700 hover:bg-blue-800 transition">
              Open Planner
            </div>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[1000]" />
            <Drawer.Content className="bg-gray-100 h-fit fixed bottom-0 left-0 right-0 outline-none rounded-t-lg z-[1010]">
              <Drawer.Title className="text-lg font-bold p-4">
                Plan Your Trip
              </Drawer.Title>
              
              <div className="p-4 bg-white space-y-4">
                {/* Switch Toggle Inside Drawer */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex bg-gray-200 rounded-lg p-1">
                    <button
                      onClick={() => setPlannerMode("manual")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                        plannerMode === "manual"
                          ? "bg-blue-600 text-white shadow"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Choose My Trip
                    </button>
                    <button
                      onClick={() => setPlannerMode("month")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-1 ${
                        plannerMode === "month"
                          ? "bg-green-600 text-white shadow"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      I'm feeling lucky <GoNorthStar />
                    </button>
                  </div>
                </div>

                {plannerMode === "manual" ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      generateItinerary();
                    }}
                  >
                    <div>
                      <label
                        htmlFor="destination"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Where do you want to go?
                      </label>
                      <input
                        type="text"
                        id="destination"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        required
                        placeholder="Enter destination"
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                      />
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor="people"
                        className="block text-sm font-medium text-gray-700"
                      >
                        How many people?
                      </label>
                      <select
                        id="people"
                        name="people"
                        value={formData.people}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                      >
                        <option value="" disabled>
                          Select group size
                        </option>
                        <option value="1-4">1-4</option>
                        <option value="5-9">5-9</option>
                        <option value=">9">&gt;9</option>
                      </select>
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor="days"
                        className="block text-sm font-medium text-gray-700"
                      >
                        How many days?
                      </label>
                      <input
                        type="number"
                        id="days"
                        name="days"
                        value={formData.days}
                        onChange={handleChange}
                        required
                        min={1}
                        placeholder="Enter number of days"
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                      />
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor="budget"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Approximate Budget (INR)
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                      >
                        <option value="" disabled>
                          Select budget
                        </option>
                        <option value="high">High (Above ₹50,000)</option>
                        <option value="medium">Medium (₹20,000 - ₹50,000)</option>
                        <option value="low">Low (Below ₹20,000)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {loading ? "Generating..." : "Generate Itinerary"}
                    </button>
                  </form>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      generateMonthBasedItinerary();
                    }}
                  >
                    <div>
                      <label
                        htmlFor="month"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Which month do you want to travel?
                      </label>
                      <select
                        id="month"
                        name="month"
                        value={monthData.month}
                        onChange={handleMonthChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                      >
                        <option value="" disabled>
                          Select month
                        </option>
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor="people-month"
                        className="block text-sm font-medium text-gray-700"
                      >
                        How many people?
                      </label>
                      <select
                        id="people-month"
                        name="people"
                        value={monthData.people}
                        onChange={handleMonthChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                      >
                        <option value="" disabled>
                          Select group size
                        </option>
                        <option value="1-4">1-4</option>
                        <option value="5-9">5-9</option>
                        <option value=">9">&gt;9</option>
                      </select>
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor="days-month"
                        className="block text-sm font-medium text-gray-700"
                      >
                        How many days?
                      </label>
                      <input
                        type="number"
                        id="days-month"
                        name="days"
                        value={monthData.days}
                        onChange={handleMonthChange}
                        required
                        min={1}
                        placeholder="Enter number of days"
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                      />
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor="budget-month"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Approximate Budget (INR)
                      </label>
                      <select
                        id="budget-month"
                        name="budget"
                        value={monthData.budget}
                        onChange={handleMonthChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                      >
                        <option value="" disabled>
                          Select budget
                        </option>
                        <option value="high">High (Above ₹50,000)</option>
                        <option value="medium">Medium (₹20,000 - ₹50,000)</option>
                        <option value="low">Low (Below ₹20,000)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {loading ? "Finding Best Destination..." : "Find Best Destination & Generate Itinerary"}
                    </button>
                  </form>
                )}
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>

        <button
          onClick={() => setOpenChat(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800 transition"
        >
          <IoChatbubbleEllipsesOutline />
        </button>
      </div>

      <Itinerary
        open={showModal}
        onClose={() => setShowModal(false)}
        itinerary={itinerary}
        destination={plannerMode === "manual" ? formData.destination : "AI Recommended Destination"}
      />

      <Chat open={openChat} onClose={() => setOpenChat(false)} />
    </>
  );
}

async function generateMonthBasedTrip(monthData: {
  month: string;
  people: string;
  days: string;
  budget: string;
}) {
  console.log("=== Starting generateMonthBasedTrip ===");
  console.log("Input monthData:", monthData);
  
  try {
    console.log("Preparing request for /api/RandomItinerary");
    
    const requestBody = {
      formData: {
        destination: "Best destination for " + monthData.month, 
        people: monthData.people,
        days: monthData.days,
        budget: monthData.budget,
        month: monthData.month
      }
    };
    
    console.log("Request body:", requestBody);
    
    const response = await axios.post("/api/RandomItinerary", requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Axios response status:", response.status);
    console.log("Full response data:", response.data);
    
    // Check what format the result is in and handle it properly
    let result;
    if (response.data && response.data.result) {
      result = response.data.result;
      console.log("Extracted result:", result);
    } else if (typeof response.data === "string") {
      result = response.data;
      console.log("Using response.data as string:", result);
    } else {
      result = JSON.stringify(response.data, null, 2);
      console.log("Stringified response data:", result);
    }
    
    // Make sure we're returning a non-empty string
    if (!result) {
      throw new Error("API returned empty result");
    }
    
    return result;
  } catch (error) {
    console.error("Error in generateMonthBasedTrip:", error);
    
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    } else {
      console.error("Non-axios error:", error);
    }
    
    throw new Error("Failed to generate month-based itinerary");
  }
}