import { Close } from "@radix-ui/react-dialog";
import { ShieldCloseIcon } from "lucide-react";
import React, { useEffect } from "react";

interface PlaceDetailsProps {
  place: string;
  details: string;
  onClose: () => void;
}

const PlaceDetails: React.FC<PlaceDetailsProps> = ({
  place,
  details,
  onClose,
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {}, []);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{place}</h2>
          <hr />
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="prose max-w-none">
          {details.split("\n").map((line, index) => (
            <p key={index} className="text-gray-700 mb-2">
              {line}
            </p>
          ))}
        </div>
        <hr className="my-4" />
        <div className="mt-6 flex justify-end">

        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
