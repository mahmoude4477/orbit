# 🌍 ORBIT - Weather Planning Application

> **Plan for Tomorrow's Weather with Yesterday's Data**

ORBIT is an intelligent weather planning application that uses 30 years of NASA historical weather data (1995-2025) to help you make informed decisions about your future events. Whether you're planning a wedding, vacation, or outdoor event, ORBIT provides probability-based weather forecasts using historical patterns.

![ORBIT](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwind-css)

---

## ✨ Features

### 🎯 Core Functionality

- **📍 Location Selection**: Choose any location worldwide using:
  - Interactive map (powered by Leaflet & OpenStreetMap)
  - Location search with autocomplete
  - Current location detection
- **📅 Date Selection**: Pick any future date to analyze historical weather patterns for that specific day

- **📊 Comprehensive Weather Analysis**:
  - Temperature statistics (min, max, average)
  - Precipitation probability and amounts
  - Wind speed data
  - Probability distribution charts
  - 30-year historical trends visualization

### 🤖 AI-Powered Chat Interface

- **Natural Language Queries**: Ask questions about weather in plain English
- **Intelligent Tool Calling**: AI automatically fetches weather data when needed
- **Conversational Experience**: Chat with ORBIT AI assistant
- **Multiple Models Support**: GPT-4o, Deepseek R1, and more

### 📈 Data Visualization

- **Interactive Charts**: Built with Recharts for beautiful data visualization
- **Probability Distributions**: Bar charts showing likelihood of different weather conditions
- **Historical Trends**: Line charts displaying 30 years of data
- **Tabbed Interface**: Easy navigation between Temperature, Rain, and Wind data

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- API keys for AI models (OpenAI, Deepseek, etc.)

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd orbitv1
```

2. **Install dependencies**

```bash
pnpm install
# or
npm install
```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

```env
# AI Model API Keys
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Base URL for production
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Run the development server**

```bash
pnpm dev
# or
npm run dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
orbitv1/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Landing page
│   │   ├── chat/
│   │   │   └── page.tsx            # AI Chat interface
│   │   ├── results/
│   │   │   └── page.tsx            # Weather analysis results page
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts        # AI chat API endpoint
│   │   │   └── forecast/
│   │   │       └── route.ts        # Weather forecast API endpoint
│   │   ├── globals.css             # Global styles
│   │   └── layout.tsx              # Root layout
│   │
│   ├── components/
│   │   ├── ai-chat.tsx             # Main AI chat component
│   │   ├── location-selector.tsx   # Location selection component
│   │   ├── map-selector.tsx        # Interactive map component
│   │   ├── ai-elements/            # AI UI components
│   │   │   ├── conversation.tsx
│   │   │   ├── message.tsx
│   │   │   ├── prompt-input.tsx
│   │   │   └── ...
│   │   └── ui/                     # Shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── tabs.tsx
│   │       └── ...
│   │
│   ├── hooks/
│   │   └── use-mobile.ts
│   │
│   └── lib/
│       └── utils.ts                # Utility functions
│
├── public/                         # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

---

## 🎨 Tech Stack

### Frontend

- **Next.js 15.5.4**: React framework with App Router
- **React 19.1.0**: UI library
- **TypeScript 5**: Type safety
- **Tailwind CSS 4**: Styling framework
- **Shadcn/ui**: Component library

### Data Visualization

- **Recharts 2.15.4**: Charts and graphs
- **Leaflet 1.9.4**: Interactive maps

### AI & Chat

- **Vercel AI SDK 5.0**: AI integration
- **@ai-sdk/react 2.0**: React hooks for AI
- **OpenAI GPT-4o**: Language model
- **Deepseek R1**: Alternative AI model

### UI Components & Icons

- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **React Day Picker**: Date selection
- **Sonner**: Toast notifications

### Data Source

- **NASA POWER API**: Historical weather data (1995-2025)
- **OpenStreetMap/Nominatim**: Geocoding and maps

---

## 🌐 API Endpoints

### `GET /api/forecast`

Fetches historical weather data for a specific location and date.

**Query Parameters:**

- `lat` (number): Latitude (-90 to 90)
- `lon` (number): Longitude (-180 to 180)
- `date` (string): Target date in YYYY-MM-DD format

**Response:**

```json
{
  "temp": {
    "max": 35.2,
    "min": 18.5,
    "avg": 26.8,
    "pre": { "18-22": 15, "22-26": 35, "26-30": 30, "30-34": 20 },
    "data": [25.3, 24.8, 26.1, ...]
  },
  "rain": {
    "max": 45.3,
    "min": 0,
    "avg": 5.2,
    "pre": { "0": 70, "0-5": 15, "5-10": 10, "10+": 5 },
    "data": [0, 2.3, 0, 15.6, ...]
  },
  "wind": {
    "max": 12.5,
    "min": 2.1,
    "avg": 6.3,
    "pre": { "0-3": 20, "3-6": 45, "6-9": 25, "9+": 10 },
    "data": [5.2, 6.1, 4.8, ...]
  }
}
```

### `POST /api/chat`

AI chat endpoint with weather forecast tool integration.

**Request Body:**

```json
{
  "messages": [...],
  "model": "openai/gpt-4o",
  "webSearch": false
}
```

**Features:**

- Streaming responses
- Tool calling (getWeatherForecast)
- Multi-model support
- Context-aware conversations

---

## 📱 Pages & Routes

### `/` - Landing Page

- Hero section with ORBIT branding
- Location selector (map + search)
- Date picker for future dates
- Feature showcase cards
- "Chat with AI" button

### `/results` - Weather Analysis

- Query params: `?lat={lat}&lon={lon}&date={date}&location={name}`
- Summary cards (Temperature, Precipitation, Wind)
- Probability distribution charts
- Historical trend line charts
- Tabbed interface for different metrics
- Export functionality (Coming Soon)

### `/chat` - AI Chat Interface

- Conversational weather queries
- Natural language understanding
- Suggested questions
- Real-time AI responses
- Tool integration with forecast API

---

## 🛠️ Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Package Management
pnpm install      # Install dependencies
pnpm add <pkg>    # Add a package
```

---

## 🎯 Key Features Explained

### 1. Historical Weather Analysis

ORBIT analyzes **30 years of NASA data** (1995-2025) for the exact date you select. This provides:

- Statistical probability of weather conditions
- Min/max temperature ranges
- Precipitation likelihood
- Wind speed patterns

### 2. Intelligent Location Selection

- **Interactive Map**: Click anywhere on the map to select location
- **Search**: Type city names for autocomplete suggestions
- **Current Location**: One-click GPS detection
- **Reverse Geocoding**: Automatic location name resolution

### 3. AI-Powered Insights

The AI assistant can:

- Answer natural language questions
- Automatically fetch weather data
- Provide planning recommendations
- Compare different dates/locations
- Explain weather patterns

### 4. Data Visualization

- **Probability Charts**: Bar charts showing distribution of weather conditions
- **Historical Trends**: Line charts displaying 30 years of data points
- **Smart Data Filtering**: Handles edge cases (e.g., no variation in data)
- **Responsive Design**: Works on all screen sizes

---

## 🌟 Use Cases

- **Wedding Planning**: Check weather probability for your wedding date
- **Vacation Planning**: Find the best weather for your trip
- **Event Organizing**: Plan outdoor events with confidence
- **Agricultural Planning**: Understand seasonal weather patterns
- **Travel Optimization**: Choose the best time to visit destinations
- **Sports Events**: Schedule outdoor activities on ideal weather days

---

## 🔧 Configuration

### Environment Variables

```env
# Required
OPENAI_API_KEY=sk-...

# Optional
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
DEEPSEEK_API_KEY=...
```

### Supported AI Models

The chat interface supports multiple AI models:

- OpenAI GPT-4o
- Deepseek R1
- (Add more via configuration)

---

## 🐛 Troubleshooting

### Map not loading

- Ensure you have a stable internet connection
- Check if OpenStreetMap tiles are accessible
- Clear browser cache and reload

### API errors

- Verify NASA POWER API is accessible
- Check latitude/longitude ranges (-90 to 90, -180 to 180)
- Ensure date format is YYYY-MM-DD

### Chat not responding

- Verify API keys in `.env.local`
- Check console for error messages
- Ensure the server is running

---

## 📊 Data Sources

- **Weather Data**: [NASA POWER API](https://power.larc.nasa.gov/)
- **Maps**: [OpenStreetMap](https://www.openstreetmap.org/)
- **Geocoding**: [Nominatim API](https://nominatim.openstreetmap.org/)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary.

---

## 🙏 Acknowledgments

- NASA POWER for providing free historical weather data
- OpenStreetMap for map tiles and geocoding
- Vercel for the AI SDK and Next.js framework
- Shadcn for the beautiful UI components
- The open-source community for all the amazing libraries

---

## 💡 Tips for Best Results

1. **Be Specific**: Provide exact coordinates or city names for accurate results
2. **Check Multiple Dates**: Compare different dates to find optimal weather
3. **Use AI Chat**: Ask specific questions for detailed insights
4. **Understand Probabilities**: Weather is probabilistic, not deterministic
5. **Consider Trends**: Look at historical patterns over all 30 years

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

Made with ❤️ using Next.js, React, and NASA Data

**ORBIT** - _Plan for Tomorrow's Weather with Yesterday's Data_

</div>
