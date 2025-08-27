import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Component to handle map fitting to bounds
function FitBounds({ coordinates, padding }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = coordinates.reduce(
        (bounds, [lat, lng]) => bounds.extend([lat, lng]),
        map.getBounds(),
      );
      map.fitBounds(bounds, { padding });
    }
  }, [coordinates, map, padding]);

  return null;
}

// Main Path Plotter Component
export default function MapPathPlotter({
  coordinates = [],
  center = [51.505, -0.09],
  zoom = 13,
  pathOptions = {},
  fitBounds = true,
  mapHeight = "500px",
}) {
  const [mapReady, setMapReady] = useState(false);

  // Default styling options for the path
  const defaultPathOptions = {
    color: "#3388ff",
    weight: 5,
    opacity: 0.7,
    lineCap: "round",
    lineJoin: "round",
  };

  // Merge default options with provided options
  const finalPathOptions = { ...defaultPathOptions, ...pathOptions };

  useEffect(() => {
    setMapReady(true);
  }, []);

  return (
    <div className="w-full" style={{ height: mapHeight }}>
      <MapContainer center={center} zoom={zoom} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {coordinates.length > 0 && (
          <Polyline positions={coordinates} pathOptions={finalPathOptions} />
        )}

        {fitBounds && coordinates.length > 0 && mapReady && (
          <FitBounds coordinates={coordinates} padding={[50, 50]} />
        )}
      </MapContainer>
    </div>
  );
}
