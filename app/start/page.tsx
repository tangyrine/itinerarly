"use client";

import { useSearchParams } from "next/navigation";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import indiaGeoJson from "./india-states.json";
import { sections } from "@/data/sections";
import { useState } from "react";

export default function Page() {
  const [hoveredPlace, setHoveredPlace] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const selectedSection = sections.find((section) => section.id === type);
  const highlightedPlaces = selectedSection?.places || [];

  return (
    <div className="w-full h-screen bg-blue-500">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 800,
          center: [82, 22],
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Geographies geography={indiaGeoJson}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.properties.NAME_1}
                geography={geo}
                fill="#D6D6DA"
                stroke="#FFFFFF"
                strokeWidth={0.5}
                style={{
                  default: {
                    fill: "#D6D6DA",
                    outline: "none",
                  },
                  hover: {
                    fill: "#E6E6EA",
                    outline: "none",
                  },
                  pressed: {
                    fill: "#D6D6DA",
                    outline: "none",
                  },
                }}
              />
            ))
          }
        </Geographies>

        {/* Add Markers for specific locations */}
        {highlightedPlaces.map((place: any) => (
          <Marker
            key={place.name}
            coordinates={[place.coordinates[0], place.coordinates[1]]}
          >
            <g
              onMouseEnter={() => setHoveredPlace(place.name)}
              onMouseLeave={() => setHoveredPlace(null)}
              style={{ cursor: "pointer" }}
            >
              <circle
                r={hoveredPlace === place.name ? 6 : 4}
                fill={hoveredPlace === place.name ? "#FF8C00" : "#F53"}
                stroke="#fff"
                strokeWidth={2}
                className="transition-all duration-200"
              />
              {hoveredPlace === place.name && (
                <>
                  <rect
                    x="-50"
                    y="-35"
                    width="100"
                    height="22"
                    fill="rgba(0,0,0,0.8)"
                    rx="4"
                  />
                  <text
                    textAnchor="middle"
                    y="-20"
                    style={{
                      fontFamily: "system-ui",
                      fill: "#fff",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {place.name}
                  </text>
                </>
              )}
            </g>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
