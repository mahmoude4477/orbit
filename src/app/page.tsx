"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Cloud,
  Database,
  ArrowRight,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import LocationSelector from "@/components/location-selector";

export default function Home() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lon: number;
    name?: string;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleLocationSelect = (
    lat: number,
    lon: number,
    locationName?: string
  ) => {
    setSelectedLocation({ lat, lon, name: locationName });
  };

  const handleSearch = () => {
    if (!selectedLocation || !selectedDate) {
      alert("Please select both a location and a date");
      return;
    }

    const dateStr = selectedDate.toISOString().split("T")[0];
    router.push(
      `/results?lat=${selectedLocation.lat}&lon=${
        selectedLocation.lon
      }&date=${dateStr}&location=${encodeURIComponent(
        selectedLocation.name || "Selected Location"
      )}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center gap-4">
            <div className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
              <Cloud className="h-8 w-8" />
              <h1 className="text-3xl md:text-4xl font-bold">ORBIT</h1>
            </div>
          </div>

          {/* Tagline */}
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Plan for Tomorrow&apos;s Weather with Yesterday&apos;s Data
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Make informed decisions about your future events using 30 years of
            historical weather patterns for your exact date, powered by NASA
            data
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 pt-8">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Calendar className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Smart Planning</CardTitle>
                <CardDescription>
                  Plan vacations, weddings, and trips with confidence
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Database className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle className="text-lg">30 Years of Data</CardTitle>
                <CardDescription>
                  See how weather behaved on your exact date across 30 years
                  (1995-2025)
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Sparkles className="h-10 w-10 text-pink-600 mb-2" />
                <CardTitle className="text-lg">Avoid Surprises</CardTitle>
                <CardDescription>
                  Weather probabilities help you make the right choice
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* Selection Section */}
      <div className="container mx-auto px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-2xl border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">
                Start Your Weather Journey
              </CardTitle>
              <CardDescription className="text-lg">
                Select a location and date to see historical weather
                probabilities OR{" "}
                <Link href="/chat">
                  <Button variant="outline" size="lg" className="gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Chat with AI
                  </Button>
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Location Selection */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      1
                    </div>
                    <h3 className="text-xl font-semibold">Choose Location</h3>
                  </div>
                  <LocationSelector
                    onLocationSelect={handleLocationSelect}
                    defaultLat={30.0444}
                    defaultLon={31.2357}
                  />
                </div>

                {/* Date Selection */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      2
                    </div>
                    <h3 className="text-xl font-semibold">Select Date</h3>
                  </div>
                  <Card>
                    <CardContent className="pt-6 flex justify-center">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                      />
                    </CardContent>
                  </Card>
                  {selectedDate && (
                    <p className="text-sm text-center text-muted-foreground">
                      Selected:{" "}
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>

              {/* Search Button */}
              <div className="flex justify-center pt-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6"
                  onClick={handleSearch}
                  disabled={!selectedLocation || !selectedDate}
                >
                  Get Weather Probabilities
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 bg-white/50 dark:bg-gray-950/50 backdrop-blur">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by NASA Historical Weather Data</p>
          <p className="mt-2">
            © 2025 ORBIT. Making weather planning predictable.
          </p>
        </div>
      </footer>
    </div>
  );
}
