"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Coffee,
  LogIn,
  User,
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react";
import { SignInModal } from "./SignInModal";
import Cookies from "js-cookie";
import axios from "axios";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    name?: string;
    email?: string;
    avatar?: string;
  } | null>(null);
  const SiteUrl: string = process.env.SITE_URL || "http://localhost:8080";

  const handleModal = () => {
    setOpenModal(!openModal);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setIsMenuOpen(false);
    }
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
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Logout successful:", response.status);

      Cookies.remove("auth-token", { path: "/" });
      Cookies.remove("JSESSIONID", { path: "/" });

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
          data: err.response?.data,
        });

        if (err.response?.status === 403) {
          console.log("403 error - clearing local auth state anyway");
        }
      }

      Cookies.remove("auth-token", { path: "/" });
      Cookies.remove("JSESSIONID", { path: "/" });
      setIsLoggedIn(false);
      setUserInfo(null);
      setIsProfileDropdownOpen(false);

      alert(
        "Logout completed locally. Please refresh if you experience any issues."
      );

      window.location.href = "/";
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${SiteUrl}/api/v1/user/profile`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setUserInfo(response.data);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      setUserInfo({ name: "User", email: "" });
    }
  };

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".profile-dropdown")) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "#about", isSection: true },
    { label: "Features", href: "#features", isSection: true },
  ];

  return (
    <>
      <nav
        className="top-0 z-50"
        style={{
          backgroundColor: "#f7e9d5",
          backgroundImage: `url("data:image/svg+xml;utf8,<svg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'><rect width='100' height='100' fill='%23f7e9d5'/><g opacity='0.25'><circle cx='10' cy='10' r='1.5' fill='%23c2b280'/><circle cx='50' cy='50' r='1.2' fill='%23c2b280'/><circle cx='80' cy='80' r='1.1' fill='%23c2b280'/><circle cx='70' cy='20' r='1.3' fill='%23c2b280'/><circle cx='30' cy='70' r='1.1' fill='%23c2b280'/><circle cx='20' cy='80' r='1.2' fill='%23c2b280'/><circle cx='90' cy='40' r='1.3' fill='%23c2b280'/><circle cx='60' cy='10' r='1.1' fill='%23c2b280'/><circle cx='40' cy='90' r='1.2' fill='%23c2b280'/><circle cx='80' cy='30' r='1.3' fill='%23c2b280'/><circle cx='15' cy='60' r='1.1' fill='%23c2b280'/><circle cx='70' cy='70' r='1.2' fill='%23c2b280'/><circle cx='30' cy='30' r='1.3' fill='%23c2b280'/><circle cx='60' cy='80' r='1.1' fill='%23c2b280'/><circle cx='90' cy='90' r='1.2' fill='%23c2b280'/></g></svg>")`,
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-xl">
                Itinerarly
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) =>
                item.isSection ? (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.href.slice(1))}
                    className="text-gray-900 transition-colors cursor-pointer hover:text-blue-600"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-gray-900 transition-colors hover:text-blue-600"
                  >
                    {item.label}
                  </Link>
                )
              )}

              {/* Profile Section or Sign In Button */}
              {isLoggedIn ? (
                <div className="relative profile-dropdown">
                  <button
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                      {userInfo?.avatar ? (
                        <img
                          src={userInfo.avatar}
                          alt={userInfo.name || "User"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            if (e.currentTarget.nextElementSibling) {
                              (
                                e.currentTarget
                                  .nextElementSibling as HTMLElement
                              ).style.display = "flex";
                            }
                          }}
                        />
                      ) : null}
                      <User
                        className={`w-5 h-5 text-white ${
                          userInfo?.avatar ? "hidden" : "block"
                        }`}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {userInfo?.name ? userInfo.name.split(" ")[0] : "User"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isProfileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        <div className="font-medium">
                          {userInfo?.name || "User"}
                        </div>
                        {userInfo?.email && (
                          <div className="text-gray-500 text-xs">
                            {userInfo.email}
                          </div>
                        )}
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
                <button
                  className="text-sm text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-md"
                  onClick={handleAuthClick}
                >
                  Sign In
                </button>
              )}

              <a
                href="https://coff.ee/heisen47"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 flex items-center"
              >
                Buy me a coffee
                <Coffee className="inline ml-2" />
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              {isLoggedIn ? (
                <div className="relative profile-dropdown">
                  <button
                    className="flex items-center space-x-1 text-gray-700"
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                  >
                    <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                      {userInfo?.avatar ? (
                        <img
                          src={userInfo.avatar}
                          alt={userInfo.name || "User"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            if (e.currentTarget.nextElementSibling) {
                              (
                                e.currentTarget
                                  .nextElementSibling as HTMLElement
                              ).style.display = "flex";
                            }
                          }}
                        />
                      ) : null}
                      <User
                        className={`w-4 h-4 text-white ${
                          userInfo?.avatar ? "hidden" : "block"
                        }`}
                      />
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${
                        isProfileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Mobile Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-3 py-2 text-xs text-gray-700 border-b border-gray-100">
                        <div className="font-medium truncate">
                          {userInfo?.name || "User"}
                        </div>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <User className="w-3 h-3 mr-2" />
                        Profile
                      </Link>

                      <button
                        className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-3 h-3 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="text-sm text-gray-600 hover:bg-gray-100 px-2 py-1 rounded"
                  onClick={handleModal}
                >
                  <LogIn />
                </button>
              )}

              <a
                href="https://coff.ee/heisen47"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 flex items-center"
              >
                <Coffee className="inline" />
              </a>
            </div>
          </div>
        </div>
      </nav>
      <SignInModal openModal={openModal} onClose={handleModal} />
    </>
  );
};

export default Navbar;
