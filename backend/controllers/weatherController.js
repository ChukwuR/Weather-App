const axios = require('axios');
require('dotenv').config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// const getWeatherByCity = async (req, res) => {
//   const { city } = req.query;

//   if (!city) {
//     return res.status(400).json({ error: 'City name is required in query parameters.' });
//   }

//   try {
//     const response = await axios.get(BASE_URL, {
//       params: {
//         q: city,
//         appid: WEATHER_API_KEY,
//         units: 'metric'
//       }
//     });

//     const weatherData = response.data;
//     res.status(200).json({
//       city: weatherData.name,
//       temperature: weatherData.main.temp,
//       description: weatherData.weather[0].description,
//       icon: weatherData.weather[0].icon,
//       windSpeed: weatherData.wind.speed,
//       sunrise: weatherData.sys.sunrise, sunset: weatherData.sys.sunset,
//       timezone: weatherData.timezone
//     });

//   } catch (error) {
//     if (error.response) {
//       // API responded with an error status
//       if (error.response.status === 404) {
//         res.status(404).json({ error: `City "${city}" not found.` });
//       } else if (error.response.status === 401) {
//         res.status(401).json({ error: 'Invalid or missing API key.' });
//       } else {
//         res.status(error.response.status).json({ error: error.response.data.message || 'Weather API error.' });
//       }
//     } else if (error.request) {
//       // No response received
//       res.status(503).json({ error: 'No response from weather service. Please try again later.' });
//     } else {
//       // Other errors
//       res.status(500).json({ error: 'Unexpected server error.' });
//     }
//   }
// };


const getWeatherByCity = async (req, res) => {
  const { city, lat, lon } = req.query;

  if (!city && (!lat || !lon)) {
    return res.status(400).json({ error: 'City name or coordinates are required in query parameters.' });
  }

  try {
    const params = {
      appid: WEATHER_API_KEY,
      units: 'metric'
    };

    if (city) {
      params.q = city;
    } else {
      params.lat = lat;
      params.lon = lon;
    }

    const response = await axios.get(BASE_URL, { params });
    const weatherData = response.data;

    res.status(200).json({
      city: weatherData.name,
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      windSpeed: weatherData.wind.speed,
      sunrise: weatherData.sys.sunrise,
      sunset: weatherData.sys.sunset,
      timezone: weatherData.timezone
    });

  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        res.status(404).json({ error: city ? `City "${city}" not found.` : 'Location not found.' });
      } else if (error.response.status === 401) {
        res.status(401).json({ error: 'Invalid or missing API key.' });
      } else {
        res.status(error.response.status).json({ error: error.response.data.message || 'Weather API error.' });
      }
    } else if (error.request) {
      res.status(503).json({ error: 'No response from weather service. Please try again later.' });
    } else {
      res.status(500).json({ error: 'Unexpected server error.' });
    }
  }
};

module.exports = {
  getWeatherByCity
};

// Get 5-day forecast
// const getFiveDayForecast = async (req, res) => {
//   const { city } = req.query;
//   if (!city) return res.status(400).json({ error: 'City is required' });

//   try {
//     const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
//       params: {
//         q: city,
//         appid: WEATHER_API_KEY,
//         units: 'metric'
//       }
//     });

//     res.status(200).json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch forecast data' });
//   }
// };


const getFiveDayForecast = async (req, res) => {
  const { city, lat, lon } = req.query;

  if (!city && (!lat || !lon)) {
    return res.status(400).json({ error: 'City name or coordinates are required.' });
  }

  try {
    const params = {
      appid: WEATHER_API_KEY,
      units: 'metric'
    };

    if (city) {
      params.q = city;
    } else {
      params.lat = lat;
      params.lon = lon;
    }

    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', { params });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch forecast data. Reload the page!' });
  }
};

const getCityByCoordinates = async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const response = await axios.get('https://api.openweathermap.org/geo/1.0/reverse', {
      params: {
        lat,
        lon,
        limit: 1,
        appid: WEATHER_API_KEY
      }
    });

    const location = response.data[0];

    if (!location || !location.name) {
      return res.status(404).json({ error: 'City not found for coordinates' });
    }

    res.status(200).json({
      city: location.name,
      country: location.country,
      state: location.state || null
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch city from coordinates' });
  }
};

module.exports = {
  getWeatherByCity,
  getFiveDayForecast,
  getCityByCoordinates
};