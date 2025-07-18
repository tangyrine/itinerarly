import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Coffee, LogIn } from "lucide-react";
import { SignInModal } from "./SignInModal";
import Cookies from 'js-cookie'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  const handleGetStarted = async () => {
    setIsLoading(true);
    await router.push("/start");
  };

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

  const isLoggedIn = Object.keys(Cookies.get() || {}).some((key) =>
  key.includes("auth-token-code-verifier")
);

const handleAuthClick = () => {
  if (isLoggedIn) {
    Object.keys(Cookies.get() || {}).forEach((key) => {
      if (key.includes("auth-token-code-verifier")) {
        Cookies.remove(key);
      }
    });
    window.location.reload(); 
  } else {
    handleModal();
  }
};

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
                    className="text-gray-900 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-gray-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              )}

              {/* available tokens */}
              <div className="text-center space-x-4 bg-white h-5 w-5">2</div>

              <button
                className="text-sm text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-md"
                onClick={handleAuthClick}
              >
                  {isLoggedIn ? "Sign Out" : "Sign In"}
              </button>
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
            <div className="md:hidden flex items-center">
              <button
                className="text-sm text-gray-600 hover:bg-gray-100 px-2 py-1 rounded"
                onClick={handleModal}
              >
                <LogIn />
              </button>
              <a
                href="https://coff.ee/heisen47"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-yellow-500 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center"
              >
                <Coffee className="inline ml-2" />
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
