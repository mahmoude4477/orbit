"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Cloud,
  Droplets,
  Wind,
  Thermometer,
  Calendar,
  MapPin,
  Loader2,
  TrendingUp,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
  ResponsiveContainer,
} from "recharts";

interface WeatherData {
  temp: {
    max: number;
    min: number;
    avg: number;
    pre: Record<string, number>;
    data: number[];
  };
  rain: {
    max: number;
    min: number;
    avg: number;
    pre: Record<string, number>;
    data: number[];
  };
  wind: {
    max: number;
    min: number;
    avg: number;
    pre: Record<string, number>;
    data: number[];
  };
}

function ResultsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const date = searchParams.get("date");
  const location = searchParams.get("location");

  useEffect(() => {
    if (!lat || !lon || !date) {
      setError("Missing required parameters");
      setLoading(false);
      return;
    }

    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/forecast?lat=${lat}&lon=${lon}&date=${date}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [lat, lon, date]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Card className="w-96">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">
              Analyzing Historical Weather Data...
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Processing NASA satellite data for your location
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>
              {error || "Failed to load weather data"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare data for charts
  // Filter out "All values are the same" entries and replace with 0
  const tempProbabilityData = Object.entries(weatherData.temp.pre)
    .filter(
      ([range]) =>
        !range.toLowerCase().includes("all values") && !range.includes("القيم")
    )
    .map(([range, probability]) => ({
      range,
      probability,
    }));

  const rainProbabilityData = Object.entries(weatherData.rain.pre)
    .filter(
      ([range]) =>
        !range.toLowerCase().includes("all values") && !range.includes("القيم")
    )
    .map(([range, probability]) => ({
      range,
      probability,
    }));

  const windProbabilityData = Object.entries(weatherData.wind.pre)
    .filter(
      ([range]) =>
        !range.toLowerCase().includes("all values") && !range.includes("القيم")
    )
    .map(([range, probability]) => ({
      range,
      probability,
    }));

  // Check if all values are the same (no variation)
  const hasNoTempVariation = tempProbabilityData.length === 0;
  const hasNoRainVariation = rainProbabilityData.length === 0;
  const hasNoWindVariation = windProbabilityData.length === 0;

  const tempHistoricalData = weatherData.temp.data.map((temp, index) => ({
    year: `${1995 + index}`,
    temperature: temp,
  }));

  const windHistoricalData = weatherData.wind.data.map((wind, index) => ({
    year: `${1995 + index}`,
    speed: wind,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button onClick={() => router.push("/")} variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>

            <div className="relative">
              <span className="absolute -top-6 right-0 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded-full">
                Coming Soon
              </span>
              <Button
                disabled
                className="bg-gradient-to-r from-blue-600 to-purple-600 opacity-60 cursor-not-allowed"
              >
                <Download className="mr-2 h-4 w-4" />
                Export to PDF
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                <Cloud className="h-6 w-6" />
                <span className="text-xl font-bold">ORBIT</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Weather Probability Analysis
            </h1>

            <div className="flex flex-wrap gap-4 text-muted-foreground mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{location || "Selected Location"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {date
                    ? new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unknown Date"}
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3 inline-block">
              📊 Analyzing 30 years of historical data (1995-2025) for this
              exact date at your location
            </p>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Temperature</CardTitle>
                    <Thermometer className="h-5 w-5 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold">
                      {weatherData.temp.avg.toFixed(1)}°C
                    </p>
                    <p className="text-sm text-muted-foreground">Average</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-600">
                        Min: {weatherData.temp.min}°C
                      </span>
                      <span className="text-red-600">
                        Max: {weatherData.temp.max}°C
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Precipitation</CardTitle>
                    <Droplets className="h-5 w-5 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold">
                      {weatherData.rain.avg.toFixed(1)} mm
                    </p>
                    <p className="text-sm text-muted-foreground">Average</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Min: {weatherData.rain.min} mm
                      </span>
                      <span className="text-muted-foreground">
                        Max: {weatherData.rain.max} mm
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Wind Speed</CardTitle>
                    <Wind className="h-5 w-5 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold">
                      {weatherData.wind.avg.toFixed(1)} m/s
                    </p>
                    <p className="text-sm text-muted-foreground">Average</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Min: {weatherData.wind.min} m/s
                      </span>
                      <span className="text-muted-foreground">
                        Max: {weatherData.wind.max} m/s
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Charts */}
            <Tabs defaultValue="temperature" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="temperature">
                  <Thermometer className="mr-2 h-4 w-4" />
                  Temperature
                </TabsTrigger>
                <TabsTrigger value="precipitation">
                  <Droplets className="mr-2 h-4 w-4" />
                  Precipitation
                </TabsTrigger>
                <TabsTrigger value="wind">
                  <Wind className="mr-2 h-4 w-4" />
                  Wind Speed
                </TabsTrigger>
              </TabsList>

              {/* Temperature Tab */}
              <TabsContent value="temperature" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Temperature Probability Distribution
                      </CardTitle>
                      <CardDescription>
                        Likelihood of temperature ranges based on 30 years of
                        data for this date
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {hasNoTempVariation ? (
                        <div className="h-[300px] flex flex-col items-center justify-center text-center p-8 bg-muted/50 rounded-lg">
                          <Thermometer className="h-16 w-16 text-muted-foreground mb-4" />
                          <p className="text-lg font-semibold text-muted-foreground mb-2">
                            No Temperature Variation
                          </p>
                          <p className="text-sm text-muted-foreground">
                            All historical values were the same:{" "}
                            {weatherData.temp.avg.toFixed(1)}°C
                          </p>
                        </div>
                      ) : (
                        <ChartContainer
                          config={{
                            probability: {
                              label: "Probability",
                              color: "hsl(var(--chart-1))",
                            },
                          }}
                          className="h-[300px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={tempProbabilityData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="range"
                                fontSize={12}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                              />
                              <YAxis
                                label={{
                                  value: "Probability (%)",
                                  angle: -90,
                                  position: "insideLeft",
                                }}
                              />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Bar
                                dataKey="probability"
                                fill="#f97316"
                                radius={[8, 8, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Historical Temperature Data</CardTitle>
                      <CardDescription>
                        Temperature on this date over the past 30 years
                        (1995-2025)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          temperature: {
                            label: "Temperature (°C)",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={tempHistoricalData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="year"
                              fontSize={12}
                              interval={4}
                              label={{
                                value: "Year",
                                position: "insideBottom",
                                offset: -5,
                              }}
                            />
                            <YAxis
                              label={{
                                value: "Temperature (°C)",
                                angle: -90,
                                position: "insideLeft",
                              }}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line
                              type="monotone"
                              dataKey="temperature"
                              stroke="#f97316"
                              strokeWidth={2}
                              dot={{ fill: "#f97316", r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {hasNoTempVariation ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Temperature remains constant at{" "}
                        {weatherData.temp.avg.toFixed(1)}°C across all
                        historical records
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {tempProbabilityData.map(({ range, probability }) => (
                          <li
                            key={range}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm">{range}</span>
                            <span className="font-semibold text-orange-600">
                              {probability}%
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Precipitation Tab */}
              <TabsContent value="precipitation" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Precipitation Probability Distribution
                    </CardTitle>
                    <CardDescription>
                      Likelihood of rainfall amounts based on 30 years of data
                      for this date
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {hasNoRainVariation ? (
                      <div className="h-[300px] flex flex-col items-center justify-center text-center p-8 bg-muted/50 rounded-lg">
                        <Droplets className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-lg font-semibold text-muted-foreground mb-2">
                          No Precipitation Variation
                        </p>
                        <p className="text-sm text-muted-foreground">
                          All historical values were the same:{" "}
                          {weatherData.rain.avg.toFixed(1)} mm
                        </p>
                      </div>
                    ) : (
                      <ChartContainer
                        config={{
                          probability: {
                            label: "Probability",
                            color: "hsl(var(--chart-3))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={rainProbabilityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="range"
                              fontSize={12}
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis
                              label={{
                                value: "Probability (%)",
                                angle: -90,
                                position: "insideLeft",
                              }}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar
                              dataKey="probability"
                              fill="#3b82f6"
                              radius={[8, 8, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Precipitation Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {hasNoRainVariation ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Precipitation remains constant at{" "}
                        {weatherData.rain.avg.toFixed(1)} mm across all
                        historical records
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {rainProbabilityData.map(({ range, probability }) => (
                          <li
                            key={range}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm">{range}</span>
                            <span className="font-semibold text-blue-600">
                              {probability}%
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wind Tab */}
              <TabsContent value="wind" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Wind Speed Probability Distribution</CardTitle>
                      <CardDescription>
                        Likelihood of wind speed ranges based on 30 years of
                        data for this date
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {hasNoWindVariation ? (
                        <div className="h-[300px] flex flex-col items-center justify-center text-center p-8 bg-muted/50 rounded-lg">
                          <Wind className="h-16 w-16 text-muted-foreground mb-4" />
                          <p className="text-lg font-semibold text-muted-foreground mb-2">
                            No Wind Speed Variation
                          </p>
                          <p className="text-sm text-muted-foreground">
                            All historical values were the same:{" "}
                            {weatherData.wind.avg.toFixed(1)} m/s
                          </p>
                        </div>
                      ) : (
                        <ChartContainer
                          config={{
                            probability: {
                              label: "Probability",
                              color: "hsl(var(--chart-4))",
                            },
                          }}
                          className="h-[300px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={windProbabilityData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="range"
                                fontSize={12}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                              />
                              <YAxis
                                label={{
                                  value: "Probability (%)",
                                  angle: -90,
                                  position: "insideLeft",
                                }}
                              />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Bar
                                dataKey="probability"
                                fill="#22c55e"
                                radius={[8, 8, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Historical Wind Speed Data</CardTitle>
                      <CardDescription>
                        Wind speed on this date over the past 30 years
                        (1995-2025)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          speed: {
                            label: "Wind Speed (m/s)",
                            color: "hsl(var(--chart-5))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={windHistoricalData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="year"
                              fontSize={12}
                              interval={4}
                              label={{
                                value: "Year",
                                position: "insideBottom",
                                offset: -5,
                              }}
                            />
                            <YAxis
                              label={{
                                value: "Speed (m/s)",
                                angle: -90,
                                position: "insideLeft",
                              }}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line
                              type="monotone"
                              dataKey="speed"
                              stroke="#22c55e"
                              strokeWidth={2}
                              dot={{ fill: "#22c55e", r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Wind Speed Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {hasNoWindVariation ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Wind speed remains constant at{" "}
                        {weatherData.wind.avg.toFixed(1)} m/s across all
                        historical records
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {windProbabilityData.map(({ range, probability }) => (
                          <li
                            key={range}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm">{range}</span>
                            <span className="font-semibold text-green-600">
                              {probability}%
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Bottom CTA */}
            <Card className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <CardContent className="pt-6 text-center">
                <h3 className="text-2xl font-bold mb-2">
                  Ready to Plan Another Event?
                </h3>
                <p className="mb-4 opacity-90">
                  Explore weather probabilities for different locations and
                  dates
                </p>
                <Button
                  onClick={() => router.push("/")}
                  variant="secondary"
                  size="lg"
                >
                  New Search
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          <Card className="w-96">
            <CardContent className="pt-6 flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg font-medium">Loading...</p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <ResultsPageContent />
    </Suspense>
  );
}
