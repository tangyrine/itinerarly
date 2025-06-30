import { Close } from "@radix-ui/react-dialog";
import {
  Loader,
  LoaderIcon,
  SeparatorHorizontal,
  ShieldCloseIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface PlaceDetailsProps {
  place: string;
  details: string;
  lat?: number;
  lon?: number;
  onClose: () => void;
}

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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const weather = async () => {
      if (lat && lon) {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather`,
            {
              params: {
                lat,
                lon,
                appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
                units: "metric",
              },
            }
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
    weather();
  }, [lat, lon]);

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
        <hr className="my-4" />
        <div className="prose max-w-none">
          {details.split("\n").map((line, index) => (
            <p key={index} className="text-gray-700 mb-2">
              {line}
            </p>
          ))}
        </div>

        <hr className="border-t border-dotted border-gray-400 my-4" />

        <div className="flex items-center justify-between gap-4">
          <div>Weather right now :</div>
          <div className="flex items-center">
            {weather ? (
              <div className="flex items-center gap-2">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                  alt={weather.description}
                  className="w-8 h-8"
                />
                <span className="text-gray-800 font-medium">
                  <b>{Math.round(weather.temp)}°C </b>, {weather.description}
                </span>
              </div>
            ) : lat && lon ? (
              <span className="text-gray-500">
                <Loader />
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
