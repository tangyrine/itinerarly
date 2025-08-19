import { useState, useEffect } from "react";
import { Loader, MapPin, Calendar, Shield, Users, AlertTriangle, Info } from "lucide-react";

type Attraction = {
  name: string;
  description: string;
  maps_link: string;
};

type ParsedDetails = {
  attractions: Attraction[] | string[];
  hidden_gems?: Attraction[] | string[];
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

        setParsed(transformedData);
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

  const renderSafetyStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`text-lg ${i <= rating ? 'text-blue-600' : 'text-gray-300'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const getAttractionDisplay = (attraction: any): string => {
    if (typeof attraction === 'string') {
      return attraction;
    } else if (attraction && typeof attraction === 'object' && attraction.name) {
      return attraction.name;
    }
    return 'Unknown attraction';
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full m-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-blue-600 text-white p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              {place}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 text-2xl focus:outline-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {/* Show error or loading state */}
          {parseError ? (
            <div className="flex items-center gap-2 text-red-500 p-4 bg-red-50 rounded-lg mb-4">
              <AlertTriangle className="h-5 w-5" />
              {parseError}
            </div>
          ) : !parsed ? (
            <div className="flex items-center justify-center gap-2 text-blue-600 p-8">
              <Loader className="animate-spin h-6 w-6" /> 
              <span className="font-medium">Loading details...</span>
            </div>
          ) : null}

          {/* Show parsed data */}
          {parsed && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm flex-1">
                  <div className="flex items-center text-blue-600 font-medium mb-2">
                    <Calendar className="mr-2 h-4 w-4" />
                    Best Time to Visit
                  </div>
                  <div className="text-gray-700">{parsed.best_time}</div>
                </div>

                <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm flex-1">
                  <div className="flex items-center text-blue-600 font-medium mb-2">
                    <Shield className="mr-2 h-4 w-4" />
                    Safety & Security
                  </div>
                  <div className="flex items-center">
                    {renderSafetyStars(parsed.safety_security)}
                    <span className="ml-2 text-sm text-gray-500">({parsed.safety_security}/5)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-center text-blue-600 font-medium mb-2">
                  <Users className="mr-2 h-4 w-4" />
                  Tourist Footfall
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Domestic</div>
                    <div className="text-lg font-medium text-blue-700">
                      {parsed.footfall.domestic.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">International</div>
                    <div className="text-lg font-medium text-blue-700">
                      {parsed.footfall.international.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-center text-blue-600 font-medium mb-3">
                  <MapPin className="mr-2 h-4 w-4" />
                  Top Attractions
                </div>
                <ul className="space-y-2">
               
                  {parsed.attractions.map((attraction, i) => (
                    <li key={i} className="flex items-start">
                      <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 h-5 w-5 rounded-full text-xs font-bold mr-2 mt-0.5">
                        {i+1}
                      </span>
                      <span className="text-gray-700">{getAttractionDisplay(attraction)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-center text-blue-600 font-medium mb-3">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Places & Food to Avoid
                </div>
                
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-600 mb-1">Places:</div>
                  {parsed.avoid.places && parsed.avoid.places.length ? (
                    <ul className="list-disc list-inside text-gray-700 pl-2 space-y-1">
                      {parsed.avoid.places.map((place, i) => (
                        <li key={i}>{place}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500 italic">None specified</span>
                  )}
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Food:</div>
                  {parsed.avoid.food && parsed.avoid.food.length ? (
                    <ul className="list-disc list-inside text-gray-700 pl-2 space-y-1">
                      {parsed.avoid.food.map((food, i) => (
                        <li key={i}>{food}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500 italic">None specified</span>
                  )}
                </div>
              </div>

              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-center text-blue-600 font-medium mb-2">
                  <Info className="mr-2 h-4 w-4" />
                  Other Information
                </div>
                <div className="text-gray-700 whitespace-pre-line">{parsed.info}</div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StateDetailsBody;