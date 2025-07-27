import React, { useEffect, useState } from "react";
import axios from "axios";
import { Copy, Loader, Check } from "lucide-react";

interface PlaceDetailsProps {
  place: string;
  details: string;
  lat?: number;
  lon?: number;
  onClose: () => void;
}

type Attraction = {
  name: string;
  coordinates: [number, number];
};

type ParsedDetails = {
  bestTime: string;
  attractions: Attraction[];
  food: string[];
};

const PlaceDetails: React.FC<PlaceDetailsProps> = ({
  place,
  details,
  lat,
  lon,
  onClose,
}) => {
  const [weather, setWeather] = useState<null | {
    temp: number;
    description: string;
    icon: string;
  }>(null);

  const [parsed, setParsed] = useState<ParsedDetails | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    if (!details) {
      setParsed(null);
      setParseError("No details available.");
      return;
    }
    try {
      const match = details.match(/{[\s\S]*}/);
      if (!match) throw new Error("No JSON found");
      const data = JSON.parse(match[0]);
      if (
        typeof data.bestTime === "string" &&
        Array.isArray(data.attractions) &&
        data.attractions.every(
          (a: any) =>
            typeof a.name === "string" &&
            Array.isArray(a.coordinates) &&
            a.coordinates.length === 2 &&
            typeof a.coordinates[0] === "number" &&
            typeof a.coordinates[1] === "number"
        ) &&
        Array.isArray(data.food)
      ) {
        setParsed(data);
        setParseError(null);
      } else {
        throw new Error("Invalid data structure");
      }
    } catch (e) {
      setParsed(null);
      setParseError(
        "Sorry, we couldn't load the details for this place. Please try again later."
      );
    }
  }, [details]);

  // Fetch weather
  useEffect(() => {
    const fetchWeather = async () => {
      if (lat && lon) {
        try {
          const response = await axios.get(
            `/api/weather?lat=${lat}&lon=${lon}`
          );
          setWeather({
            temp: response.data.main.temp,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon,
          });
        } catch (error) {
          setWeather(null);
        }
      }
    };
    fetchWeather();
  }, [lat, lon]);


  const getCopyText = () => {
    if (!parsed) return "";
    return [
      `Best Time to Visit: ${parsed.bestTime}`,
      "",
      "Top Attractions:",
      ...parsed.attractions.map(
        (a, i) => `${i + 1}. ${a.name} (${a.coordinates[0]}, ${a.coordinates[1]})`
      ),
      "",
      "Local Cuisine to Try:",
      ...parsed.food.map((f, i) => `${i + 1}. ${f}`),
    ].join("\n");
  };

  const handleCopy = () => {
    if (!parsed) return;
    navigator.clipboard.writeText(getCopyText());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

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
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className={`text-gray-500 hover:text-green-600 text-2xl transition`}
              aria-label="Copy details"
              title="Copy details"
              disabled={!parsed}
            >
              {copied ? (
                <Check className="w-6 h-6 text-green-600" />
              ) : (
                <Copy className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
        <hr className="my-4" />

        {/* Error or Loading */}
        {parseError ? (
          <div className="text-red-500 mb-4">{parseError}</div>
        ) : !parsed ? (
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <Loader className="animate-spin" /> Loading details...
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded p-3 shadow">
              <div className="font-semibold text-blue-700 mb-1">
                Best Time to Visit
              </div>
              <div className="text-gray-800">{parsed.bestTime}</div>
            </div>

            <div className="bg-green-50 rounded p-3 shadow">
              <div className="font-semibold text-green-700 mb-1">
                Top Attractions
              </div>
              <ul className="list-disc list-inside text-gray-800">
                {parsed.attractions.map((a, i) => (
                  <li key={i}>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${a.coordinates[0]},${a.coordinates[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-offset-2 hover:underline text-blue-700 transition"
                    >
                      {a.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-50 rounded p-3 shadow">
              <div className="font-semibold text-yellow-700 mb-1">
                Local Cuisine to Try
              </div>
              <ul className="list-disc list-inside text-gray-800">
                {parsed.food.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <hr className="border-t border-dotted border-gray-400 my-4" />

        <div className="flex items-center justify-between gap-4">
          <div>Current weather of {place}:</div>
          <div className="flex items-center">
            {weather ? (
              <div className="flex items-center gap-2">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                  alt={weather.description}
                  className="w-12 h-12"
                />
                <span className="text-gray-800 text-">
                  <b>{Math.round(weather.temp)}°C </b>, {weather.description}
                </span>
              </div>
            ) : lat && lon ? (
              <span className="text-gray-500">
                <Loader />
              </span>
            ) : (
              <span className="text-gray-500">N/A</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;