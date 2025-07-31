import { useState, useEffect } from "react";
import { Loader } from "lucide-react";

type ParsedDetails = {
  attractions: string[];
  footfall: { domestic: number; international: number };
  best_time: string;
  avoid: { places: string[]; food: string[] };
  safety_security: number;
  info: string;
};

type PlaceDetailsProps = {
  place: string;
  details: string;
  onClose: () => void;
};

const StateDetailsBody: React.FC<PlaceDetailsProps> = ({
  place,
  details,
  onClose,
}) => {
  const [parsed, setParsed] = useState<ParsedDetails | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    if (!details) {
      setParsed(null);
      setParseError("No details available.");
      return;
    }
    try {
      let jsonString = details;
      const codeBlockMatch = details.match(
        /```(?:json)?\s*\n?([\s\S]*?)\n?```/
      );
      if (codeBlockMatch) {
        jsonString = codeBlockMatch[1].trim();
      }

      if (jsonString.startsWith("```") && jsonString.endsWith("```")) {
        jsonString = jsonString
          .slice(3, -3)
          .replace(/^json\s*\n?/, "")
          .trim();
      }

      const data = JSON.parse(jsonString);

      if (
        Array.isArray(data.attractions) &&
        (data.good_time_to_visit || data.best_time) &&
        typeof data.safety_security === "number" &&
        data.footfall &&
        typeof data.footfall.domestic === "number" &&
        typeof data.footfall.international === "number"
      ) {
        const transformedData = {
          attractions: data.attractions,
          footfall: data.footfall,
          best_time: data.good_time_to_visit || data.best_time,
          avoid: {
            places: data.places_to_avoid || [],
            food: data.food_to_avoid || [],
          },
          safety_security: data.safety_security,
          info:
            data.other_info ||
            data.info ||
            "No additional information available",
        };
        setParsed(data);
        setParseError(null);
      } else {
        console.error("Invalid data structure:", data);
        throw new Error("Invalid data structure");
      }
    } catch (e) {
      console.error("Parsing error:", e);
      console.error("Raw details:", details);
      setParsed(null);
      setParseError(
        "Sorry, we couldn't load the details for this place. Please try again later."
      );
    }
  }, [details]);

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
          <h2 className="text-xl font-bold">{place}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <hr className="my-4" />

        {/* Show error or loading state */}
        {parseError ? (
          <div className="text-red-500 mb-4">{parseError}</div>
        ) : !parsed ? (
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <Loader className="animate-spin" /> Loading details...
          </div>
        ) : null}

        {/* Show parsed data */}
        {parsed && (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded p-3 shadow">
              <div className="font-semibold text-blue-700 mb-1">
                Best Time to Visit
              </div>
              <div className="text-gray-800">{parsed.best_time}</div>
            </div>

            <div className="bg-green-50 rounded p-3 shadow">
              <div className="font-semibold text-green-700 mb-1">
                Top Attractions
              </div>
              <ul className="list-disc list-inside text-gray-800">
                {parsed.attractions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-50 rounded p-3 shadow">
              <div className="font-semibold text-purple-700 mb-1">
                Tourist Footfall
              </div>
              <div className="text-gray-800">
                Domestic: {parsed.footfall.domestic.toLocaleString()} <br />
                International: {parsed.footfall.international.toLocaleString()}
              </div>
            </div>

            <div className="bg-yellow-50 rounded p-3 shadow">
              <div className="font-semibold text-yellow-700 mb-1">
                Places & Food to Avoid
              </div>
              <div>
                <b>Places:</b>{" "}
                {parsed.avoid.places && parsed.avoid.places.length
                  ? parsed.avoid.places.join(", ")
                  : "None"}
              </div>
              <div>
                <b>Food:</b>{" "}
                {parsed.avoid.food && parsed.avoid.food.length
                  ? parsed.avoid.food.join(", ")
                  : "None"}
              </div>
            </div>

            <div className="bg-red-50 rounded p-3 shadow">
              <div className="font-semibold text-red-700 mb-1">
                Safety & Security
              </div>
              <div className="text-gray-800">{parsed.safety_security} / 5</div>
            </div>

            <div className="bg-gray-50 rounded p-3 shadow">
              <div className="font-semibold text-gray-700 mb-1">
                Other Information
              </div>
              <div className="text-gray-800">{parsed.info}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StateDetailsBody;
