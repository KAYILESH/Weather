import { Router } from 'express';
import { weatherController } from '../controllers/weather.controller';
import { apiRateLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @route   GET /api/weather
 * @desc    Get current weather and 5-day forecast by city name
 * @query   city - City name (required)
 * @access  Public
 * @example GET /api/weather?city=London
 */
router.get('/', apiRateLimiter, weatherController.getWeatherByCity);

/**
 * @route   GET /api/weather/suggestions
 * @desc    Get city name autocomplete suggestions
 * @query   q - Partial city name (min 2 chars)
 * @access  Public
 * @example GET /api/weather/suggestions?q=Lon
 */
router.get('/suggestions', weatherController.getCitySuggestions);

/**
 * @route   GET /api/weather/coords
 * @desc    Get current weather and 5-day forecast by geographic coordinates
 * @query   lat - Latitude (required), lon - Longitude (required)
 * @access  Public
 * @example GET /api/weather/coords?lat=51.5074&lon=-0.1278
 */
router.get('/coords', apiRateLimiter, weatherController.getWeatherByCoords);

export default router;
