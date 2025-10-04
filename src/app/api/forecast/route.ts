// app/api/forecast/route.ts
import { NextResponse } from "next/server";

type DataPoint = {
  date: Date;
  Temperature: number;
  Rain: number;
  Wind_Speed: number;
};

type Stats = {
  max: number | null;
  min: number | null;
  avg: number | null;
  pre: Record<string, number>;
  data: number[];
};

type ForecastResult = {
  temp: Stats;
  rain: Stats;
  wind: Stats;
};

// Helper: fetch NASA data
async function getNasaData(
  lat: number,
  lon: number,
  startYear = 1995,
  endYear = 2025
): Promise<DataPoint[]> {
  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOT,WS2M&community=RE&longitude=${lon}&latitude=${lat}&start=${startYear}0101&end=${endYear}1231&format=JSON`;

  const res = await fetch(url);
  const data = await res.json();

  const parameters = data?.properties?.parameter || {};
  const t2m: Record<string, number> = parameters?.T2M || {};
  const prectot: Record<string, number> = parameters?.PRECTOT || {};
  const ws2m: Record<string, number> = parameters?.WS2M || {};

  if (Object.keys(t2m).length === 0) {
    throw new Error("لا توجد بيانات حرارة كافية لهذه الإحداثيات.");
  }

  // If missing, fill with 0
  const dates = Object.keys(t2m);
  const rain = Object.keys(prectot).length
    ? prectot
    : Object.fromEntries(dates.map((d) => [d, 0]));
  const wind = Object.keys(ws2m).length
    ? ws2m
    : Object.fromEntries(dates.map((d) => [d, 0]));

  // Parse date string: NASA returns YYYYMMDD format
  const parseNasaDate = (dateStr: string): Date => {
    const year = parseInt(dateStr.slice(0, 4));
    const month = parseInt(dateStr.slice(4, 6)) - 1; // JS months are 0-indexed
    const day = parseInt(dateStr.slice(6, 8));
    return new Date(year, month, day);
  };

  return dates.map((d) => ({
    date: parseNasaDate(d),
    Temperature: parseFloat(String(t2m[d])),
    Rain: parseFloat(String(rain[d])),
    Wind_Speed: parseFloat(String(wind[d])),
  }));
}

// Helper: frequency distribution
function calculateFrequencyDistribution(
  series: number[],
  unit = ""
): Record<string, number> {
  if (series.length < 2) return { "Not enough data": 100.0 };

  const min = Math.min(...series);
  const max = Math.max(...series);

  if (min === max) return { "All values are the same": 100.0 };

  const binSize = (max - min) / 4;
  const bins = [min, min + binSize, min + 2 * binSize, min + 3 * binSize, max];

  const counts = Array(4).fill(0);
  series.forEach((v) => {
    // Fix: Include values at upper boundary in the last bin
    for (let i = 0; i < 4; i++) {
      if (i === 3) {
        // Last bin includes upper boundary
        if (v >= bins[i] && v <= bins[i + 1]) {
          counts[i]++;
          break;
        }
      } else {
        // Other bins: lower <= v < upper
        if (v >= bins[i] && v < bins[i + 1]) {
          counts[i]++;
          break;
        }
      }
    }
  });

  const total = series.length;
  const result: Record<string, number> = {};
  counts.forEach((c, i) => {
    const percentage = +((c / total) * 100).toFixed(1);
    if (percentage > 0) {
      // Only include non-zero bins
      result[`${bins[i].toFixed(2)} - ${bins[i + 1].toFixed(2)}${unit}`] =
        percentage;
    }
  });

  return result;
}

// Main forecast
function climatologyForecast(
  df: DataPoint[],
  futureDate: Date
): ForecastResult {
  const sameDay = df.filter(
    (d) =>
      d.date.getMonth() === futureDate.getMonth() &&
      d.date.getDate() === futureDate.getDate()
  );

  const lastDate = df[df.length - 1].date;
  const cutoff = new Date(lastDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  const last30Days = df.filter((d) => d.date >= cutoff);

  const extractStats = (key: keyof DataPoint, unit: string): Stats => {
    const values = sameDay.map((d) => d[key] as number);
    return {
      max: values.length ? Math.max(...values) : null,
      min: values.length ? Math.min(...values) : null,
      avg: values.length
        ? values.reduce((a, b) => a + b, 0) / values.length
        : null,
      pre: values.length ? calculateFrequencyDistribution(values, unit) : {},
      data: values,
    };
  };

  return {
    temp: extractStats("Temperature", "°C"),
    rain: extractStats("Rain", " mm"),
    wind: extractStats("Wind_Speed", " m/s"),
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const dateInput = searchParams.get("date");

  if (!lat || !lon || !dateInput) {
    return NextResponse.json(
      { error: "lat, lon, and date are required" },
      { status: 400 }
    );
  }

  try {
    const df = await getNasaData(parseFloat(lat), parseFloat(lon));
    const futureDate = new Date(dateInput);
    const result = climatologyForecast(df, futureDate);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "An error occurred" },
      { status: 500 }
    );
  }
}
