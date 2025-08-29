import { Check, Coffee, Copy, MapPin, Calendar, DollarSign, Home, Utensils, Sparkles, AlignLeft, Save } from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

interface ItineraryProps {
  open: boolean;
  onClose: () => void;
  itinerary?: string | null;
  destination?: string | null;
}

function parseDelimitedItinerary(itinerary: string) {
  if (itinerary.includes("|||")) {
    const sections = itinerary
      .split("|||")
      .map((s) => s.trim())
      .filter(Boolean);
    let data: any = {};
    for (const section of sections) {
      if (/^Error:/i.test(section)) {
        data.error = section.replace(/^Error:\s*/i, "");
        return data;
      }
      const lines = section
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      for (const line of lines) {
        if (line.startsWith("Destination:"))
          data.destination = line.replace("Destination:", "").trim();
        else if (line.startsWith("Budget:"))
          data.budget = line.replace("Budget:", "").trim();
        else if (line.startsWith("Hotels:"))
          data.hotels = line
            .replace("Hotels:", "")
            .split(",")
            .map((s) => s.trim());
        else if (line.startsWith("Restaurants:"))
          data.restaurants = line
            .replace("Restaurants:", "")
            .split(",")
            .map((s) => s.trim());
        else if (line.startsWith("Attractions:"))
          data.attractions = line
            .replace("Attractions:", "")
            .split(",")
            .map((s) => s.trim());
        else if (line.startsWith("Summary:"))
          data.summary = line.replace("Summary:", "").trim();
        else if (line.startsWith("Day-wise Plan:")) data.daysPlan = [];
        else if (/^Day \d+:/.test(line)) {
          if (!data.daysPlan) data.daysPlan = [];
          const [day, ...rest] = line.split(":");
          data.daysPlan.push({
            day: day.replace("Day", "").trim(),
            activities: rest.join(":").trim(),
          });
        }
      }
    }
    return { ...data, isDelimitedFormat: true };
  }
  
  return { rawContent: itinerary, isDelimitedFormat: false };
}

const Itinerary: React.FC<ItineraryProps> = ({
  open,
  onClose,
  itinerary,
  destination,
}) => {
  if (!open) return null;

  let parsed: any = null;
  let parseError = null;
  try {
    if (itinerary) {
      parsed = parseDelimitedItinerary(itinerary);
    }
  } catch (e) {
    parseError = "Could not parse itinerary.";
    console.error("Parse error:", e);
  }

  const [copied, setCopied] = useState(false);
  const [saved , setSaved] = useState(false);

  const getCopyText = () => {
    if (!parsed) return "";
    
    if (!parsed.isDelimitedFormat && parsed.rawContent) {
      return parsed.rawContent;
    }
    
  
    let lines: string[] = [];
    if (parsed.destination) lines.push(`Destination: ${parsed.destination}`);
    if (parsed.budget) lines.push(`Budget: ${parsed.budget}`);
    if (parsed.summary) lines.push(`Summary: ${parsed.summary}`);
    if (parsed.hotels) {
      lines.push("Recommended Hotels:");
      parsed.hotels.forEach((h: string, i: number) => lines.push(`  - ${h}`));
    }
    if (parsed.restaurants) {
      lines.push("Recommended Restaurants:");
      parsed.restaurants.forEach((r: string, i: number) =>
        lines.push(`  - ${r}`)
      );
    }
    if (parsed.attractions) {
      lines.push("Must-Visit Attractions:");
      parsed.attractions.forEach((a: string, i: number) =>
        lines.push(`  - ${a}`)
      );
    }
    if (parsed.daysPlan) {
      lines.push("Day-wise Plan:");
      parsed.daysPlan.forEach((d: any) =>
        lines.push(`  Day ${d.day}: ${d.activities}`)
      );
    }
    return lines.join("\n");
  };

  const handleCopy = () => {
    if (parsed) {
      navigator.clipboard.writeText(getCopyText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleSave = () => {
    if (parsed) {
      if (!parsed.destination) {
        alert("Destination is missing. Cannot save itinerary.");
        return;
      }
      let destination = parsed.destination;
      localStorage.setItem(`itinerary_${destination.toLowerCase()}`, getCopyText());
    }
    setSaved(true);
  };

  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in z-[4000]"
        onClick={onClose}
        aria-label="Close itinerary modal"
      />
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl h-[80vh] max-h-[90vh] overflow-hidden relative animate-slide-up z-[4100]"
        tabIndex={0}
      >
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            <h2 className="text-xl font-bold">
              {parsed?.destination || destination || "Your Itinerary"}
            </h2>
          </div>
          <button
            className="text-white hover:text-blue-200 hover:bg-blue-500 p-1 rounded-full transition"
            onClick={onClose}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Main Content */}
        <div className="p-6 overflow-y-auto itinerary-scroll" style={{ height: "calc(100% - 140px)" }}>
          {parseError ? (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              {parseError}
            </div>
          ) : !parsed ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : parsed.error ? (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              {parsed.error}
            </div>
          ) : parsed.isDelimitedFormat ? (
            <div className="space-y-6">
              {/* Summary Section */}
              {parsed.summary && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <div className="flex items-center text-blue-700 font-medium mb-2">
                    <AlignLeft className="mr-2 h-4 w-4" />
                    Overview
                  </div>
                  <p className="text-gray-700">{parsed.summary}</p>
                </div>
              )}
              
              {/* Budget Section */}
              {parsed.budget && (
                <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center text-blue-700 font-medium mb-2">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Approximate Budget
                  </div>
                  <p className="text-green-700 font-medium">{parsed.budget}</p>
                </div>
              )}
              
              {/* Hotels Section */}
              {parsed.hotels && (
                <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center text-blue-700 font-medium mb-3">
                    <Home className="mr-2 h-4 w-4" />
                    Recommended Hotels
                  </div>
                  <ul className="space-y-2">
                    {parsed.hotels.map((h: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 h-5 w-5 rounded-full text-xs font-bold mr-2 mt-0.5">
                          {i+1}
                        </span>
                        <span className="text-gray-700">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Restaurants Section */}
              {parsed.restaurants && (
                <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center text-blue-700 font-medium mb-3">
                    <Utensils className="mr-2 h-4 w-4" />
                    Recommended Restaurants
                  </div>
                  <ul className="space-y-2">
                    {parsed.restaurants.map((r: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 h-5 w-5 rounded-full text-xs font-bold mr-2 mt-0.5">
                          {i+1}
                        </span>
                        <span className="text-gray-700">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Attractions Section */}
              {parsed.attractions && (
                <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center text-blue-700 font-medium mb-3">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Must-Visit Attractions
                  </div>
                  <ul className="space-y-2">
                    {parsed.attractions.map((a: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 h-5 w-5 rounded-full text-xs font-bold mr-2 mt-0.5">
                          {i+1}
                        </span>
                        <span className="text-gray-700">{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Day-wise Plan Section */}
              {parsed.daysPlan && (
                <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center text-blue-700 font-medium mb-3">
                    <Calendar className="mr-2 h-4 w-4" />
                    Day-wise Plan
                  </div>
                  <div className="space-y-3">
                    {parsed.daysPlan.map((d: any, i: number) => (
                      <div key={i} className="border-l-2 border-blue-300 pl-3 py-1">
                        <div className="font-medium text-blue-700 mb-1">Day {d.day}</div>
                        <div className="text-gray-700">{d.activities}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="prose prose-blue prose-headings:text-blue-700 prose-a:text-blue-600 max-w-none">
              <ReactMarkdown>{parsed.rawContent}</ReactMarkdown>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="text-gray-500 text-xs text-center italic mb-3">
            Hope you enjoyed this itinerary! If you found it helpful, consider supporting my work.
          </div>
          
            <div className="flex flex-row gap-3 justify-center">
            <a
              href="https://coff.ee/heisen47"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-4 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg shadow transition-all duration-300"
            >
              <Coffee className="w-4 h-4 mr-2" />
              Buy me a coffee
            </a>

            <button
              className={`flex-1 py-2 px-4 flex items-center justify-center text-white font-medium rounded-lg shadow transition-all duration-300 ${
              copied ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={handleCopy}
            >
              {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
              ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </>
              )}
            </button>

            <button
              className={`flex-1 py-2 px-4 flex items-center justify-center text-black font-medium rounded-lg shadow transition-all duration-300 ${
              copied ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 hover:bg-blue-600"
              }`}
              onClick={handleSave}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
              
            </button>
            </div>

        </div>
      </div>

      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.3s;
        }
        .animate-slide-up {
          animation: slideUp 0.4s cubic-bezier(0.4, 2, 0.6, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            transform: translateY(60px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .itinerary-scroll {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        .itinerary-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .itinerary-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .itinerary-scroll::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
      `}</style>
    </div>
  );
};

export default Itinerary;