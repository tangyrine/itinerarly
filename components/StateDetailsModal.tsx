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

  const handleGenerate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stateName) {
      alert("State name is required!");
      return;
    }
    setDataLoad(true);
    try {
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
          <DialogTitle>Planning to visit {stateName}?</DialogTitle>
          <DialogDescription>Let me help you with that!</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button type="submit" onClick={handleGenerate}>
            {!dataLoad ? (
              `Generate!`
            ) : (
              <Loader className="animate-spin h-4 w-4 mr-2" />
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
