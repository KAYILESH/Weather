# 🎨 WeatherSphere Frontend

React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion

## Setup

```bash
npm install
npm run dev
```

## Environment

The frontend uses a Vite proxy to route `/api` calls to the backend at `http://localhost:5000`. No environment variables required in the frontend — the backend holds all secrets.

## Component Architecture

```
src/
├── components/
│   ├── AnimatedBackground.tsx  # Weather-responsive animated background
│   ├── EmptyState.tsx          # Initial welcome screen
│   ├── ErrorState.tsx          # Glass error cards
│   ├── Footer.tsx              # App footer
│   ├── ForecastCard.tsx        # Individual day forecast card
│   ├── GlassCard.tsx           # Reusable glassmorphism card
│   ├── Header.tsx              # App header with logo
│   ├── LoadingSkeleton.tsx     # Shimmer loading placeholders
│   ├── MetricCard.tsx          # Individual weather metric display
│   ├── SearchBar.tsx           # City search with history dropdown
│   ├── ThemeToggle.tsx         # Dark/light mode toggle
│   └── WeatherCard.tsx         # Main current weather display
│
├── pages/
│   └── Home.tsx               # Main page assembling all components
│
├── hooks/
│   └── useWeather.ts          # Custom hook for weather operations
│
├── services/
│   └── weatherApi.ts          # API service (calls backend only)
│
├── store/
│   └── weatherStore.ts        # Zustand store with localStorage
│
├── types/
│   └── weather.types.ts       # TypeScript interfaces
│
├── constants/
│   └── index.ts               # Constants, formatters, utilities
│
├── App.tsx
├── main.tsx
└── index.css                  # Global styles + glassmorphism utilities
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 5173 |
| `npm run build` | TypeScript check + Vite production build |
| `npm run preview` | Preview production build |
| `npm run typecheck` | TypeScript type checking only |
