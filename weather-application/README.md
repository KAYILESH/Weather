# 🌤️ WeatherSphere — Full-Stack Weather Application

A **production-ready**, **full-stack Weather Application** with a premium macOS Sonoma–inspired glassmorphism UI.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 City Search | Search any city globally with debounced input |
| 📍 Geolocation | Auto-detect current location |
| 🌡️ Current Weather | Temperature, feels-like, humidity, wind, pressure, visibility |
| 📅 5-Day Forecast | Daily forecast cards with min/max temps and rain chance |
| ⏱️ Hourly Forecast | Hour-by-hour breakdown for tomorrow |
| 🎨 Glassmorphism UI | Premium frosted-glass macOS-inspired design |
| 🌙 Dark/Light Mode | System-aware theme switching |
| 📏 Unit Toggle | Celsius ↔ Fahrenheit |
| 💾 Persistent State | Last city, search history via localStorage |
| ⚡ Skeleton Loaders | Beautiful animated loading states |
| 🛡️ Secure API | API key hidden in backend — never exposed to frontend |
| 📱 Responsive | Works perfectly on mobile, tablet, and desktop |

---

## 🏗️ Architecture

```
Frontend (React 19 + Vite)
       ↓ HTTP
Backend (Express + TypeScript)
       ↓ HTTP
OpenWeatherMap API
```

**The frontend NEVER calls OpenWeatherMap directly. All API requests go through the backend.**

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- OpenWeatherMap API key ([Get one free](https://openweathermap.org/api))

### 1. Clone & Install

```bash
# Install Backend dependencies
cd weather-application/backend
npm install

# Install Frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# In the backend directory
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
OPENWEATHER_API_KEY=your_actual_api_key_here
FRONTEND_URL=http://localhost:5173
```

### 3. Run Development Servers

**Terminal 1 — Backend:**
```bash
cd weather-application/backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd weather-application/frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

---

## 📁 Project Structure

```
weather-application/
├── frontend/               # React 19 + Vite + TypeScript
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   ├── store/          # Zustand state management
│   │   ├── types/          # TypeScript interfaces
│   │   ├── constants/      # App constants & utilities
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/         # Environment & Axios config
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Error handler, rate limiter
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript interfaces
│   │   ├── utils/          # Logger, API response
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── README.md
├── AI_USAGE.md
└── .gitignore
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/weather?city=London` | Weather by city name |
| `GET` | `/api/weather/coords?lat=51.5&lon=-0.1` | Weather by coordinates |

### Response Format

```json
{
  "success": true,
  "data": {
    "current": {
      "city": "London",
      "country": "GB",
      "temperature": 18,
      "feelsLike": 16,
      "humidity": 72,
      "windSpeed": 15.5,
      "description": "Partly cloudy"
    },
    "forecast": [
      {
        "date": "2024-01-16",
        "tempMin": 10,
        "tempMax": 20,
        "pop": 30,
        "humidity": 65
      }
    ]
  }
}
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + TypeScript
- **Vite** — Lightning fast build tool
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Smooth animations
- **Zustand** — State management with persistence
- **Axios** — HTTP client
- **Lucide React** — Beautiful icons

### Backend
- **Node.js** + **Express.js** + TypeScript
- **Axios** — HTTP client for OpenWeatherMap
- **Helmet** — Security headers
- **CORS** — Cross-origin resource sharing
- **Morgan** — HTTP request logging
- **express-rate-limit** — Rate limiting
- **dotenv** — Environment variables

---

## 🏭 Production Build

```bash
# Build Frontend
cd frontend && npm run build

# Build Backend
cd backend && npm run build

# Start Backend in Production
cd backend && npm start
```

---

## 🔒 Security Features

- API keys stored only in `.env` (never in frontend)
- CORS restricted to frontend origin
- Rate limiting: 100 req/15min globally, 30 req/min for API
- Helmet security headers
- Input validation and sanitization
- No internal error details in production responses

---

## 📄 License

MIT © WeatherSphere
