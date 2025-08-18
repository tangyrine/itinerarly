"use client";

import { useState, useEffect } from "react";
import { Drawer } from "vaul";
import ItineraryGeneration from "../lib/ItineraryGeneration";
import Itinerary from "./Itinerary";
import { GoNorthStar } from "react-icons/go";
import {
  Clock,
} from "lucide-react";
import { SignInModal } from "./SignInModal";
import axios from "axios";
import Cookies from "js-cookie";
import { FaUmbrellaBeach } from "react-icons/fa";
import { useToken } from "@/lib/TokenProvider";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function PlannerDrawer() {
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
  const [destinationName, setDestinationName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);

  const SiteUrl: string =
    process.env.NEXT_PUBLIC_SITE_URL || "https://itinerarly-be.onrender.com";

  const {
    token,
    isLoading: tokenLoading,
    consumeToken,
    refreshTokenCount,
    isTokenAvailable,
  } = useToken();

  const extractDestinationName = (itineraryText: string): string => {
    const destinationMatch = itineraryText.match(/Destination:\s*([^\n]+)/i);
    return destinationMatch ? destinationMatch[1].trim() : "AI Recommended Destination";
  };

  const handleModal = () => {
    setOpenModal(!openModal);
  };

  useEffect(() => {
    const checkLogin = () => {
      // Use the isLoggedIn cookie instead of parsing JWT tokens
      const loggedIn = Cookies.get("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        refreshTokenCount();
      }
    };

    checkLogin();

    window.addEventListener("focus", checkLogin);
    return () => window.removeEventListener("focus", checkLogin);
  }, []);

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
      if (!isLoggedIn) {
        setOpenModal(true);
        setLoading(false);
        return;
      }
      if (!isTokenAvailable) {
        setShowTokenModal(true);
        setLoading(false);
        return;
      }

      const tokenConsumed = await consumeToken();

      if (!tokenConsumed) {
        setLoading(false);
        return;
      }

      const result = await ItineraryGeneration(formData);
      setItinerary(result ?? "");
      setDestinationName(formData.destination);
      setDrawerOpen(false);
      setShowModal(true);
    } catch (error) {
      console.error("Error in itinerary generation process:", error);
      setItinerary(
        "Sorry, we couldn't generate an itinerary. Please try again."
      );
      setDestinationName(formData.destination);
      setDrawerOpen(false);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthBasedItinerary = async () => {
    setLoading(true);

    try {
      if (!isLoggedIn) {
        setOpenModal(true);
        setLoading(false);
        return;
      }

      if (!isTokenAvailable) {
        setShowTokenModal(true);
        setLoading(false);
        return;
      }

      const tokenConsumed = await consumeToken();

      if (!tokenConsumed) {
        setLoading(false);
        return;
      }

      const result = await generateMonthBasedTrip(monthData);
      setItinerary(result ?? "");
      setDestinationName(extractDestinationName(result ?? ""));

      setDrawerOpen(false);
      setShowModal(true);
    } catch (error) {
      console.error("Error generating month-based itinerary:", error);
      const errorMessage =
        "Sorry, we couldn't generate an itinerary for your selected month. Please try again.";
      setItinerary(errorMessage);
      setDestinationName(`Best destination for ${monthData.month}`);
      setDrawerOpen(false);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  async function generateMonthBasedTrip(monthData: {
    month: string;
    people: string;
    days: string;
    budget: string;
  }) {
    try {
      const requestBody = {
        formData: {
          destination: "Best destination for " + monthData.month,
          people: monthData.people,
          days: monthData.days,
          budget: monthData.budget,
          month: monthData.month,
        },
      };

      const response = await axios.post("/api/RandomItinerary", requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      let result;
      if (response.data && response.data.result) {
        result = response.data.result;
      } else if (typeof response.data === "string") {
        result = response.data;
      } else {
        result = JSON.stringify(response.data, null, 2);
      }

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
          message: error.message,
        });
      } else {
        console.error("Non-axios error:", error);
      }

      throw new Error("Failed to generate month-based itinerary");
    }
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <>
      <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Drawer.Trigger asChild>
          <div className="p-2 text-white text-center rounded cursor-pointer shadow-md bg-blue-700 hover:bg-blue-800 transition flex items-center justify-center">
            {/* Show icon on small screens, text on larger screens */}
            <span className="block sm:hidden">
              <FaUmbrellaBeach className="w-5 h-5" />
            </span>
            <span className="hidden sm:block">Open Planner</span>
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

              {/* Forms */}
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
                      <option value="medium">
                        Medium (₹20,000 - ₹50,000)
                      </option>
                      <option value="low">Low (Below ₹20,000)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Generating...
                      </div>
                    ) : (
                      "Generate Itinerary"
                    )}
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
                      <option value="medium">
                        Medium (₹20,000 - ₹50,000)
                      </option>
                      <option value="low">Low (Below ₹20,000)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Finding Best Destination...
                      </div>
                    ) : (
                      "Find Best Destination & Generate Itinerary"
                    )}
                  </button>
                </form>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <Itinerary
        open={showModal}
        onClose={() => setShowModal(false)}
        itinerary={itinerary}
        destination={destinationName || formData.destination || "AI Recommended Destination"}
      />

      <SignInModal openModal={openModal} onClose={handleModal} />

      {/* Token Limit Modal */}
      <Dialog open={showTokenModal} onOpenChange={setShowTokenModal}>
        <DialogContent className="sm:max-w-[425px] bg-white shadow-xl rounded-lg border border-gray-300">
          <DialogHeader>
            <div className="flex flex-col items-center text-center py-4">
              <div className="bg-blue-50 p-3 rounded-full mb-4">
                <Clock className="h-10 w-10 text-blue-500" />
              </div>
              <DialogTitle className="text-xl mb-2">
                Token Limit Reached
              </DialogTitle>
              <DialogDescription className="text-center max-w-xs mx-auto">
                You don't have enough tokens to generate an itinerary. Please
                wait 24 hours for your tokens to refresh.
              </DialogDescription>
              <p className="mt-2 text-sm font-medium text-blue-600 text-center">
                Your tokens will refresh automatically in 24 hours.
              </p>
            </div>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <Button className="min-w-[100px]">OK, got it</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
