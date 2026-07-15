# 🛠️ WeatherSphere Backend API

Node.js + Express.js + TypeScript — Secure weather proxy API

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your OpenWeatherMap API key
npm run dev
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | Server port |
| `NODE_ENV` | No | `development` | Environment |
| `OPENWEATHER_API_KEY` | **Yes** | — | Your OWM API key |
| `OPENWEATHER_BASE_URL` | No | OWM default | OWM base URL |
| `FRONTEND_URL` | No | `http://localhost:5173` | CORS allowed origin |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate limit window (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | No | `100` | Max requests per window |

## API Reference

### `GET /health`
Health check endpoint.

### `GET /api/weather?city={city}`
Get weather and forecast by city name.

**Query Parameters:**
- `city` (required): City name string

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "current": { ... },
    "forecast": [ ... ]
  }
}
```

**Error Responses:**
- `400` — Invalid city name
- `404` — City not found
- `429` — Rate limit exceeded
- `504` — Upstream timeout

### `GET /api/weather/coords?lat={lat}&lon={lon}`
Get weather by geographic coordinates.

## Architecture

```
src/
├── config/
│   ├── env.ts            # Environment validation
│   └── axios.ts          # Axios instance with interceptors
├── controllers/
│   └── weather.controller.ts   # Input validation + routing logic
├── services/
│   └── weather.service.ts      # OWM API calls + data transformation
├── middleware/
│   ├── errorHandler.ts         # Global error handler
│   └── rateLimiter.ts          # Rate limiting
├── routes/
│   └── weather.routes.ts       # Express routes
├── types/
│   └── weather.types.ts        # TypeScript interfaces
├── utils/
│   ├── apiResponse.ts          # Consistent response helpers
│   └── logger.ts               # Colored console logger
├── app.ts                      # Express app setup
└── server.ts                   # Entry point + graceful shutdown
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to dist/ |
| `npm start` | Run compiled production server |
| `npm run typecheck` | TypeScript type checking only |
