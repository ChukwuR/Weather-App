// const express = require('express');
// const router = express.Router();
// const {getWeatherByCity} = require('../controllers/weatherController');

// router.get('/', getWeatherByCity);

// // module.exports = router;

// // const express = require('express');
// // const router = express.Router();
// const {
//   // getWeatherByCity,
//   getFiveDayForecast,
//   getCityByCoordinates
// } = require('../controllers/weatherController');

// router.get('/', getWeatherByCity); // /api/weather?city=...
// router.get('/forecast', getFiveDayForecast); // /api/weather/forecast?city=...
// router.get('/geolocate', getCityByCoordinates); // /api/weather/geolocate?lat=...&lon=...

// module.exports = router;



const express = require('express');
const router = express.Router();

const {
  getWeatherByCity,
  getFiveDayForecast,
  getCityByCoordinates
} = require('../controllers/weatherController');

// Route to get current weather by city name
// Example: GET /api/weather?city=Lagos
router.get('/', getWeatherByCity);

// Route to get 5-day forecast by city name
// Example: GET /api/weather/forecast?city=Lagos
router.get('/forecast', getFiveDayForecast);

// Route to get city name from coordinates
// Example: GET /api/weather/geolocate?lat=6.5244&lon=3.3792
router.get('/geolocate', getCityByCoordinates);

module.exports = router;