import { streamText, UIMessage, convertToModelMessages, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    model,
    webSearch,
  }: {
    messages: UIMessage[];
    model: string;
    webSearch: boolean;
  } = await req.json();

  const result = streamText({
    model: "openai/gpt-5-mini",
    tools: {
      getWeatherForecast: tool({
        description:
          "Get historical weather probability data for a specific location and date. This tool analyzes 30 years of weather data (1995-2025) for the exact date at the specified coordinates. Returns temperature, precipitation, and wind speed statistics including averages, min/max values, probability distributions, and historical data points.",
        inputSchema: z.object({
          latitude: z
            .number()
            .min(-90)
            .max(90)
            .describe("The latitude of the location (-90 to 90)"),
          longitude: z
            .number()
            .min(-180)
            .max(180)
            .describe("The longitude of the location (-180 to 180)"),
          date: z
            .string()
            .describe(
              "The target date in ISO format (YYYY-MM-DD), e.g., 2026-06-15"
            ),
        }),
        execute: async ({ latitude, longitude, date }) => {
          console.log("Fetching weather forecast...", {
            latitude,
            longitude,
            date,
          });
          try {
            // Call the internal forecast API
            const baseUrl =
              process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
            const url = `${baseUrl}/api/forecast?lat=${latitude}&lon=${longitude}&date=${date}`;

            const response = await fetch(url);

            if (!response.ok) {
              throw new Error(`Forecast API error: ${response.statusText}`);
            }

            const data = await response.json();

            // Format the response for the AI
            return {
              location: { latitude, longitude },
              date,
              temperature: {
                average: `${data.temp.avg.toFixed(1)}°C`,
                min: `${data.temp.min}°C`,
                max: `${data.temp.max}°C`,
                probability_distribution: data.temp.pre,
                historical_data_points: data.temp.data.length,
              },
              precipitation: {
                average: `${data.rain.avg.toFixed(1)} mm`,
                min: `${data.rain.min} mm`,
                max: `${data.rain.max} mm`,
                probability_distribution: data.rain.pre,
                historical_data_points: data.rain.data.length,
              },
              wind_speed: {
                average: `${data.wind.avg.toFixed(1)} m/s`,
                min: `${data.wind.min} m/s`,
                max: `${data.wind.max} m/s`,
                probability_distribution: data.wind.pre,
                historical_data_points: data.wind.data.length,
              },
              data_source:
                "NASA POWER (30 years of historical data: 1995-2025)",
              note: "This analysis is based on historical weather patterns for this exact date over 30 years",
            };
          } catch (error) {
            console.error("Error fetching forecast:", error);
            return {
              error: "Failed to fetch weather forecast data",
              message: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      }),
    },
    messages: convertToModelMessages(messages),
    system: `You are ORBIT, an intelligent weather assistant that helps users plan future events by analyzing historical weather patterns.

Your capabilities:
- Analyze 30 years of historical weather data (1995-2025) from NASA for any location and date
- Provide statistical weather probabilities including temperature, precipitation, and wind speed
- Help users make informed decisions about planning vacations, weddings, trips, and other events
- Explain weather probability distributions in an easy-to-understand way

When users ask about weather:
1. Extract the location (you may need to ask for coordinates or convert location names to lat/lon)
2. Extract the target date
3. Use the getWeatherForecast tool to fetch historical weather probabilities
4. Present the data in a clear, conversational way
5. Highlight key insights like probability ranges and typical conditions
6. Offer advice based on the weather patterns

Remember: You provide historical weather probabilities, not short-term forecasts. Your data shows how weather has behaved on that specific date over 30 years, helping users make better planning decisions.

Be friendly, helpful, and explain statistics in simple terms that anyone can understand.`,
  });

  // send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
