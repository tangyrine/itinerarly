"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Drawer } from "vaul";
import ItineraryGeneration from "../lib/ItineraryGeneration";
import Itinerary from "./Itinerary";
import { IoMdHome } from "react-icons/io";
import { GoNorthStar } from "react-icons/go";
import { User, ChevronDown, Settings, LogOut, LogIn, Coffee } from "lucide-react";
import { SignInModal } from "./SignInModal";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";

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
  
  // User state management (same as Navbar) - Updated to include avatar
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<{name?: string, email?: string, avatar?: string} | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const SiteUrl: string = process.env.SITE_URL || "http://localhost:8080";

  const router = useRouter();

  const handleModal = () => {
    setOpenModal(!openModal);
  };

  const handleAuthClick = async (): Promise<void> => {
    if (isLoggedIn) {
      await handleLogout();
    } else {
      setOpenModal(true);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      const response = await axios.post(
        `${SiteUrl}/api/v1/logout`,
        {},
        {
          withCredentials: true,
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      console.log("Logout successful:", response.status);
      
      Cookies.remove("auth-token", { path: '/' });
      Cookies.remove("JSESSIONID", { path: '/' });
      
      setIsLoggedIn(false);
      setUserInfo(null);
      setIsProfileDropdownOpen(false);
      window.location.href = "/";
      
    } catch (err) {
      console.error("Logout error:", err);
      
      if (axios.isAxiosError(err)) {
        console.error("Error details:", {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data
        });
        
        if (err.response?.status === 403) {
          console.log("403 error - clearing local auth state anyway");
        }
      }
      
      Cookies.remove("auth-token", { path: '/' });
      Cookies.remove("JSESSIONID", { path: '/' });
      setIsLoggedIn(false);
      setUserInfo(null);
      setIsProfileDropdownOpen(false);
      
      alert("Logout completed locally. Please refresh if you experience any issues.");
    }
  };

  // Fetch user info function (updated to include avatar handling)
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${SiteUrl}/api/v1/user/profile`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const userData = response.data;
      
      // If no avatar provided, generate one using UI Avatars
      if (!userData.avatar && userData.name) {
        userData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3b82f6&color=fff&size=128&rounded=true`;
      }
      
      setUserInfo(userData);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      const defaultUser = { 
        name: "User", 
        email: "", 
        avatar: "https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff&size=128&rounded=true" 
      };
      setUserInfo(defaultUser);
    }
  };

  // Check login status (same as Navbar)
  useEffect(() => {
    const checkLogin = () => {
      const loggedIn = !!Cookies.get("auth-token");
      setIsLoggedIn(loggedIn);
      
      if (loggedIn && !userInfo) {
        fetchUserInfo();
      }
    };

    checkLogin();

    window.addEventListener("focus", checkLogin);
    return () => window.removeEventListener("focus", checkLogin);
  }, [userInfo]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

                {/* Forms remain the same */}
                {plannerMode === "manual" ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      generateItinerary();
                    }}
                  >
                    {/* Manual form content remains unchanged */}
                    <div>
                      <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
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
                      <label htmlFor="people" className="block text-sm font-medium text-gray-700">
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
                        <option value="" disabled>Select group size</option>
                        <option value="1-4">1-4</option>
                        <option value="5-9">5-9</option>
                        <option value=">9">&gt;9</option>
                      </select>
                    </div>

                    <div className="mt-4">
                      <label htmlFor="days" className="block text-sm font-medium text-gray-700">
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
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
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
                        <option value="" disabled>Select budget</option>
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
                    {/* Month form content remains unchanged */}
                    <div>
                      <label htmlFor="month" className="block text-sm font-medium text-gray-700">
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
                        <option value="" disabled>Select month</option>
                        {months.map((month) => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-4">
                      <label htmlFor="people-month" className="block text-sm font-medium text-gray-700">
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
                        <option value="" disabled>Select group size</option>
                        <option value="1-4">1-4</option>
                        <option value="5-9">5-9</option>
                        <option value=">9">&gt;9</option>
                      </select>
                    </div>

                    <div className="mt-4">
                      <label htmlFor="days-month" className="block text-sm font-medium text-gray-700">
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
                      <label htmlFor="budget-month" className="block text-sm font-medium text-gray-700">
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
                        <option value="" disabled>Select budget</option>
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

        {/* User Profile Section with Avatar (Updated) */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          {isLoggedIn ? (
            <div className="relative profile-dropdown">
              <button
                className="flex items-center space-x-2 text-white hover:text-gray-200 focus:outline-none"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                  {userInfo?.avatar ? (
                    <>
                      <img 
                        src={userInfo.avatar} 
                        alt={userInfo.name || 'User'} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <User className="w-5 h-5 text-blue-600 hidden" />
                    </>
                  ) : (
                    <User className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <span className="text-sm font-medium hidden md:block">
                  {userInfo?.name ? userInfo.name.split(" ")[0] : 'User'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu with Avatar */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                        {userInfo?.avatar ? (
                          <>
                            <img 
                              src={userInfo.avatar} 
                              alt={userInfo.name || 'User'} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            <User className="w-6 h-6 text-white hidden" />
                          </>
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{userInfo?.name || 'User'}</div>
                        {userInfo?.email && (
                          <div className="text-gray-500 text-xs truncate">{userInfo.email}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </Link>
                  
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Link>
                  
                  <hr className="my-1" />
                  
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800 transition flex items-center space-x-2"
                onClick={handleAuthClick}
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden md:block">Sign In</span>
              </button>
            </div>
          )}
          
          <a
            href="https://coff.ee/heisen47"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition flex items-center space-x-2"
          >
            <Coffee className="w-4 h-4" />
            <span className="hidden md:block">Coffee</span>
          </a>
        </div>
      </div>

      <Itinerary
        open={showModal}
        onClose={() => setShowModal(false)}
        itinerary={itinerary}
        destination={plannerMode === "manual" ? formData.destination : "AI Recommended Destination"}
      />

      <SignInModal openModal={openModal} onClose={handleModal} />
    </>
  );
}

// generateMonthBasedTrip function remains the same
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