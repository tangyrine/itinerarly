import { Check, Coffee, Copy } from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";  // You'll need to install this

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
      console.log("Parsed itinerary:", parsed);
    }
  } catch (e) {
    parseError = "Could not parse itinerary.";
    console.error("Parse error:", e);
  }

  const [copied, setCopied] = useState(false);

  const getCopyText = () => {
    if (!parsed) return "";
    
    // If raw content, return it directly
    if (!parsed.isDelimitedFormat && parsed.rawContent) {
      return parsed.rawContent;
    }
    
    // Otherwise format the structured data
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

  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in z-[4000]"
        onClick={onClose}
        aria-label="Close itinerary modal"
      />
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl h-[80vh] max-h-[90vh] p-8 relative animate-slide-up flex flex-col z-[4100]"
        style={{ scrollbarGutter: "stable" }}
        tabIndex={0}
      >
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          Your {parsed?.destination || destination || ""} Itinerary
        </h2>
        <div
          className="flex-1 overflow-y-auto itinerary-scroll"
          style={{
            minHeight: 0,
            paddingRight: "0.5rem",
          }}
        >
          {parseError ? (
            <div className="text-red-500">{parseError}</div>
          ) : !parsed ? (
            <div className="text-gray-500">Loading...</div>
          ) : parsed.error ? (
            <div className="text-red-500">{parsed.error}</div>
          ) : parsed.isDelimitedFormat ? (
            // Original formatted display for delimited content
            <>
              {parsed.summary && (
                <div className="mb-2 italic text-gray-600">
                  {parsed.summary}
                </div>
              )}
              {parsed.budget && (
                <div className="mb-4">
                  <span className="font-semibold">Approximate Budget:</span>{" "}
                  <span className="text-green-700">{parsed.budget}</span>
                </div>
              )}
              {/* Flex row for hotels and restaurants */}
              <div className="flex flex-col md:flex-row gap-6 mb-4">
                {parsed.hotels && (
                  <div className="flex-1">
                    <span className="font-semibold block mb-1">
                      Recommended Hotels:
                    </span>
                    <ul className="list-disc list-inside pl-4">
                      {parsed.hotels.map((h: string, i: number) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {parsed.restaurants && (
                  <div className="flex-1">
                    <span className="font-semibold block mb-1">
                      Recommended Restaurants:
                    </span>
                    <ul className="list-disc list-inside pl-4">
                      {parsed.restaurants.map((r: string, i: number) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {parsed.attractions && (
                <div className="mb-4">
                  <span className="font-semibold">Must-Visit Attractions:</span>
                  <ul className="list-disc list-inside pl-4">
                    {parsed.attractions.map((a: string, i: number) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
              {parsed.daysPlan && (
                <div>
                  <span className="font-semibold">Day-wise Plan:</span>
                  <ul className="list-disc list-inside pl-4">
                    {parsed.daysPlan.map((d: any, i: number) => (
                      <li key={i}>
                        <span className="font-semibold">Day {d.day}:</span>{" "}
                        {d.activities}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            // For raw content from the AI, display as markdown
            <div className="prose prose-sm max-w-full">
              {/* If you have react-markdown installed */}
              {parsed.rawContent && (
                <div className="markdown-content">
                  <ReactMarkdown>{parsed.rawContent}</ReactMarkdown>
                </div>
              )}
              
              {/* If you don't have react-markdown, use this instead: */}
              {!parsed.rawContent && (
                <pre className="whitespace-pre-wrap text-gray-800">
                  {itinerary}
                </pre>
              )}
            </div>
          )}
        </div>

        <hr/>
        <span className="text-gray-500 text-xs text-center italic">
          Hope you enjoyed this itinerary! If you found it helpful, consider supporting my work.
        </span>
        <div className="p-2">
          <a
            href="https://coff.ee/heisen47"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 w-full py-1 px-4 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow transition-all duration-300"
          >
            <Coffee className="w-5 h-5 mr-2" />
            Buy me a coffee
          </a>

          <button
            className={`mt-2 w-full py-1 px-4 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all duration-300 ${
              copied ? "bg-green-600 hover:bg-green-700" : ""
            }`}
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 mr-2 animate-bounce" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-2" />
                Copy to Clipboard
              </>
            )}
          </button>
        </div>

        <style jsx global>{`
          .animate-fade-in {
            animation: fadeIn 0.3s;
          }
          .animate-slide-up {
            animation: slideUp 0.4s cubic-bezier(0.4, 2, 0.6, 1);
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
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
          .markdown-content h1, 
          .markdown-content h2, 
          .markdown-content h3 {
            font-weight: bold;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
          }
          .markdown-content h1 {
            font-size: 1.5rem;
          }
          .markdown-content h2 {
            font-size: 1.3rem;
          }
          .markdown-content h3 {
            font-size: 1.1rem;
          }
          .markdown-content ul {
            list-style-type: disc;
            padding-left: 1.5rem;
          }
          .markdown-content ol {
            list-style-type: decimal;
            padding-left: 1.5rem;
          }
          .markdown-content p {
            margin-bottom: 0.75rem;
          }
          .markdown-content strong {
            font-weight: bold;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Itinerary;