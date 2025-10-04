"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapSelectorProps {
  defaultLat: number;
  defaultLon: number;
  onLocationSelect: (lat: number, lon: number, locationName?: string) => void;
}

export default function MapSelector({
  defaultLat,
  defaultLon,
  onLocationSelect,
}: MapSelectorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([defaultLat, defaultLon], 6);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Custom marker icon
    const customIcon = L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          background-color: hsl(var(--primary));
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 3px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    // Add initial marker
    const marker = L.marker([defaultLat, defaultLon], {
      icon: customIcon,
      draggable: true,
    }).addTo(map);

    markerRef.current = marker;

    // Handle marker drag
    marker.on("dragend", async () => {
      const position = marker.getLatLng();
      const locationName = await getLocationName(position.lat, position.lng);
      onLocationSelect(position.lat, position.lng, locationName);
    });

    // Handle map click
    map.on("click", async (e) => {
      marker.setLatLng(e.latlng);
      const locationName = await getLocationName(e.latlng.lat, e.latlng.lng);
      onLocationSelect(e.latlng.lat, e.latlng.lng, locationName);
    });

    mapInstanceRef.current = map;
    setIsMapReady(true);

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker position when props change
  useEffect(() => {
    if (isMapReady && markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLatLng([defaultLat, defaultLon]);
      mapInstanceRef.current.setView(
        [defaultLat, defaultLon],
        mapInstanceRef.current.getZoom()
      );
    }
  }, [defaultLat, defaultLon, isMapReady]);

  // Reverse geocoding to get location name
  const getLocationName = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      return data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  };

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] rounded-lg overflow-hidden"
      style={{ zIndex: 0 }}
    />
  );
}
