"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { MapPin, Search, Loader2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dynamically import map component (Leaflet needs browser environment)
const MapSelector = dynamic(() => import("./map-selector"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[400px] bg-muted rounded-lg">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
});

interface LocationSelectorProps {
  onLocationSelect: (lat: number, lon: number, locationName?: string) => void;
  defaultLat?: number;
  defaultLon?: number;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

export default function LocationSelector({
  onLocationSelect,
  defaultLat = 30.0444,
  defaultLon = 31.2357,
}: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: defaultLat,
    lon: defaultLon,
    name: "",
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Search for locations using Nominatim (OpenStreetMap)
  const searchLocation = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchLocation(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchLocation]);

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Reverse geocode to get location name
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await response.json();
          const locationName = data.display_name || "Current Location";

          setSelectedLocation({ lat, lon, name: locationName });
          onLocationSelect(lat, lon, locationName);
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          setSelectedLocation({ lat, lon, name: "Current Location" });
          onLocationSelect(lat, lon, "Current Location");
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to get your location. Please search manually.");
        setIsGettingLocation(false);
      }
    );
  };

  const handleSearchResultClick = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    setSelectedLocation({ lat, lon, name: result.display_name });
    onLocationSelect(lat, lon, result.display_name);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleMapClick = (lat: number, lon: number, locationName?: string) => {
    setSelectedLocation({ lat, lon, name: locationName || "" });
    onLocationSelect(lat, lon, locationName);
  };

  return (
    <div className="w-full space-y-4">
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map">
            <MapPin className="mr-2 h-4 w-4" />
            Map Selection
          </TabsTrigger>
          <TabsTrigger value="search">
            <Search className="mr-2 h-4 w-4" />
            Search Location
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              variant="outline"
              className="w-full"
            >
              {isGettingLocation ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="mr-2 h-4 w-4" />
              )}
              Use Current Location
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <MapSelector
                defaultLat={selectedLocation.lat}
                defaultLon={selectedLocation.lon}
                onLocationSelect={handleMapClick}
              />
            </CardContent>
          </Card>

          <p className="text-sm text-muted-foreground text-center">
            Click anywhere on the map to select a location
          </p>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              variant="outline"
            >
              {isGettingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for a city or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>

          {searchResults.length > 0 && (
            <Card>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchResultClick(result)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {result.display_name.split(",")[0]}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {result.display_name}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {searchQuery && !isSearching && searchResults.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No locations found. Try a different search term.
            </p>
          )}
        </TabsContent>
      </Tabs>

      {selectedLocation.name && (
        <Card className="bg-muted">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">Selected Location</p>
                <p className="text-xs text-muted-foreground truncate">
                  {selectedLocation.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Lat: {selectedLocation.lat.toFixed(4)}, Lon:{" "}
                  {selectedLocation.lon.toFixed(4)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
