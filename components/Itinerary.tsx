import React from "react";

interface ItineraryProps {
  open: boolean;
  onClose: () => void;
  itinerary?: string | null;
  destination?: string | null;
}

const Itinerary: React.FC<ItineraryProps> = ({ open, onClose, itinerary, destination }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 relative animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          Your {destination ? `${destination} ` : ""}Itinerary
        </h2>
        <div className="prose max-w-none text-gray-800 text-lg transition-all duration-300">
          {itinerary ? (
            itinerary.split("\n").map((line, i) => (
              <p key={i} className="mb-2">{line}</p>
            ))
          ) : (
            <div className="text-gray-500">Loading...</div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.3s;
        }
        .animate-slide-up {
          animation: slideUp 0.4s cubic-bezier(.4,2,.6,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(60px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Itinerary;