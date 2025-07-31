import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import StateDetailsBody from "./StateDetailsBody";
import Cookies from "js-cookie";

interface StateDetailsModal {
  showStateModal: boolean;
  stateName: string | null;
  mousePosition?: { x: number; y: number };
  onClose: () => void;
}

export function StateDetailsModal({
  showStateModal,
  stateName,
  onClose,
  mousePosition,
}: StateDetailsModal) {
  const [dataLoad, setDataLoad] = useState(false);
  const [details, setDetails] = useState<string | null>(null);

  const [token, setToken] = useState<number | undefined>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const SiteUrl: string = process.env.SITE_URL || "http://localhost:8080";
  useEffect(() => {
    const checkLogin = () => {
      const loggedIn = !!Cookies.get("auth-token");
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        fetchTokenCount();
      }
    };
    
    checkLogin();
  }, [showStateModal]);

  const fetchTokenCount = async () => {
    try {
      const response = await axios.get(
        `${SiteUrl}/api/v1/tokens/remaining`,
        {
          withCredentials: true,
        }
      );
      setToken(response.data.remainingTokens ?? 0);
      console.log("Token count:", response.data.remainingTokens);
    } catch (error) {
      console.error("Error fetching tokens:", error);
      setToken(0);
    }
  };
 
  const consumeToken = async (): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${SiteUrl}/api/v1/tokens/consume`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );
      
      console.log("Token consume response:", response.data);
      
      if (response.data?.success === true) {
        if (response.data?.remainingTokens !== undefined) {
          setToken(response.data.remainingTokens);
          console.log("Token count updated to:", response.data.remainingTokens);
        } else {
          fetchTokenCount();
        }
        return true;
      } else {
        alert(response.data?.message || "No tokens remaining for today");
        return false;
      }
      
    } catch (error) {
      console.error("Error consuming token:", error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          alert(error.response?.data?.message || "No tokens remaining for today");
        } else if (error.response?.status === 401) {
          alert("Please sign in to continue.");
          setShowAuthModal(true);
        } else if (error.response?.status === 500) {
          alert("Server error occurred. Please try again later.");
        } else {
          alert(`Error: ${error.response?.data?.message || error.message}`);
        }
      } else {
        alert("Unexpected error occurred. Please try again.");
      }
      
      return false;
    }
  };

  const handleGenerate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stateName) {
      alert("State name is required!");
      return;
    }
    
    setDataLoad(true);
    
    try {
      if (!isLoggedIn) {
        alert("Please sign in to generate state details.");
        setShowAuthModal(true);
        setDataLoad(false);
        return;
      }
      
      if (typeof token === 'number' && token <= 0) {
        alert("You don't have enough tokens. Please purchase more tokens to continue.");
        setDataLoad(false);
        return;
      }

      console.log(`Attempting to consume token before generating details for ${stateName}`);
      const tokenConsumed = await consumeToken();
      
      if (!tokenConsumed) {
        console.log("Token consumption failed, stopping state details generation");
        setDataLoad(false);
        return;
      }
      
      console.log("Token consumed successfully, proceeding with state details generation");

      const res = await axios.post("/api/stateDetails", {
        placeName: stateName,
      });
      console.log(res.data.result);
      setDetails(res.data.result);
      setTimeout(onClose, 15000);
    } catch (err) {
      console.error("Error generating state details:", err);
      alert("Failed to generate state details. Please try again.");
    }
    
    setDataLoad(false);
  };

  useEffect(() => {
    if (!showStateModal) setDetails(null);
  }, [showStateModal, stateName]);

  return (
    <Dialog open={showStateModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white shadow-xl rounded-lg border border-gray-300">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle>Planning to visit {stateName}?</DialogTitle>
              <DialogDescription>Let me help you with that!</DialogDescription>
            </div>
            
            {/* Add token display */}
            {isLoggedIn && typeof token !== "undefined" && (
              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium flex items-center">
                <span className="text-yellow-500 mr-1">⚡</span>
                <span>{token}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          
          <Button 
            type="submit" 
            onClick={handleGenerate}
            disabled={dataLoad || (typeof token === 'number' && token <= 0) || !isLoggedIn}
            className={
              (dataLoad || (typeof token === 'number' && token <= 0) || !isLoggedIn) 
                ? "opacity-50 cursor-not-allowed" 
                : ""
            }
          >
            {dataLoad ? (
              <>
                <Loader className="animate-spin h-4 w-4 mr-2" />
                Generating...
              </>
            ) : !isLoggedIn ? (
              "Sign in to generate"
            ) : typeof token === 'number' && token <= 0 ? (
              "No tokens remaining"
            ) : (
              `Generate! (1 token)`
            )}
          </Button>
        </DialogFooter>

        {details && (
          <div className="mt-4">
            <StateDetailsBody
              place={stateName ?? ""}
              details={details}
              onClose={onClose}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}