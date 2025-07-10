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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface StateDetailsModal {
  showStateModal: boolean;
  stateName : string | null; 
  mousePosition?: { x: number; y: number }; 
  onClose: () => void; 
}

export function StateDetailsModal({ showStateModal,stateName, onClose , mousePosition }: StateDetailsModal) {

const handleGenerate = async(event: React.FormEvent) => {
  event.preventDefault();
  const res = await axios.post('/api/stateDetails');
  console.log(res.data);  
}

  return (
    <Dialog open={showStateModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white shadow-xl rounded-lg border border-gray-300">
        <DialogHeader>
          <DialogTitle>Planning to visit {stateName}?</DialogTitle>
          <DialogDescription>
            Let me help you with that!
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button type="submit" onClick={handleGenerate}>Generate!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}