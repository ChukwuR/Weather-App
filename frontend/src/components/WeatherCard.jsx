import { useEffect, useState } from 'react';
import '../style/weatherCard.css';
import '../style/weatherWidget.css'
import { useTheme } from '../context/ThemeContext';
import TimeZone from './TimeZone';
import clear from '../images/sunny.png'
import clouds from '../images/clouds.png'
import rain from '../images/rain.png'
import thunderstorm from '../images/thunderstorm.png'
import drizzle from '../images/drizzle.png'
import snow from '../images/snow.png'
import mist from '../images/mist.png'
import { getFavorites, addFavorite, removeFavorite } from '../utils/favoritesService';
import { useParams } from 'react-router-dom';

const weatherThemes = {
  Clear: { background: `linear-gradient(#00000012), url(${clear})`, icon: '☀️' },
  Clouds: { background: `url(${clouds})`, icon: '☁️' },
  Rain: { background: `url(${rain})`, icon: '🌧️' },
  Thunderstorm: { background: `url(${thunderstorm})`, icon: '⛈️' },
  Drizzle: { background: `url(${drizzle})`, icon: '🌦️' },
  Snow: { background: `url(${snow})`, icon: '❄️' },
  Mist: { background: `url(${mist})`, icon: '🌫️' }
};

function WeatherCard() {
  const { city } = useParams();
  const { updateTheme } = useTheme();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchWeather = async (lat, lon) => {
    try {
      setLoading(true);
      const weatherRes = await fetch(`http://localhost:5000/api/weather?lat=${lat}&lon=${lon}`);
      const weatherData = await weatherRes.json();
      if (!weatherRes.ok) throw new Error(weatherData.error);
      setWeather(weatherData);
      updateTheme(weatherData, weatherData.sunrise, weatherData.sunset);

      const forecastRes = await fetch(`http://localhost:5000/api/weather/forecast?lat=${lat}&lon=${lon}`);
      const forecastData = await forecastRes.json();
      if (!forecastRes.ok) throw new Error(forecastData.error);
      const daily = forecastData.list.filter(item => item.dt_txt.includes('12:00:00'));
      setForecast(daily);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (city) {
    // If city is provided, fetch by city
    const fetchByCity = async () => {
      try {
        setLoading(true);
        const weatherRes = await fetch(`http://localhost:5000/api/weather?city=${encodeURIComponent(city)}`);
        const weatherData = await weatherRes.json();
        if (!weatherRes.ok) throw new Error(weatherData.error);
        setWeather(weatherData);
        updateTheme(weatherData, weatherData.sunrise, weatherData.sunset);

        const forecastRes = await fetch(`http://localhost:5000/api/weather/forecast?city=${encodeURIComponent(city)}`);
        const forecastData = await forecastRes.json();
        if (!forecastRes.ok) throw new Error(forecastData.error);
        const daily = forecastData.list.filter(item => item.dt_txt.includes('12:00:00'));
        setForecast(daily);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchByCity();
  } else {
    // Otherwise, use geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('Location access denied. Please allow location or enter a city.');
        setLoading(false);
      }
    );
  }
}, [city, updateTheme]);

// ===== favorites =====
useEffect(() => {
  if (!city) return;
  
  getFavorites()
  .then((favs) => {
    setIsFavorite(favs.includes(city));
  })
  .catch((err) => {
    console.error('Failed to fetch favorites:', err);
  });
}, [city]);

const toggleFavorite = async () => {
  console.log('Favorite button clicked:', city);
  
  try {
    if (isFavorite) {
      await removeFavorite(city);
      setIsFavorite(false);
    } else {
      await addFavorite(city);
      setIsFavorite(true);
    }
  } catch (err) {
    console.error('Failed to update favorite:', err);
    // Optional: show a toast or alert here
  }
};
// ======================

if (loading) return <p>Loading weather...</p>;
  if (error) return <p className="weather-error">Error: {error}</p>;
  if (!weather) return null;

  // const theme = weatherThemes[weather.description.split(' ')[0]] || weatherThemes['Clear'];
  const mainCondition = weather.main || 'Clear'; // fallback if undefined
  const theme = weatherThemes[mainCondition] || weatherThemes['Clear'];

  // ===== favorites =====




  return (
    <div>
        {weather && <TimeZone weather={weather} />}
        <div className="weatherWrapper card">
            <div className="weatherContainer">
                <div className="weatherCard" 
                style={{ background: theme.background }}
                >
                    <div className="weatherIcon">{theme.icon}</div>
                    <h3>{weather.city}</h3>
                    <p className="weather-temp">{weather.temperature}°C</p>
                    <p className="weather-desc">{weather.description}</p>
                </div>

                <div className="windCard">
                    <h3 className="wind-label">Wind Speed</h3>
                    <div className="wind-speed-container mt-5">
                    <p className="wind-value">
                    {weather.windSpeed !== undefined
                        ? `${weather.windSpeed} m/s`
                        : 'N/A'}
                    </p>
                    
                    <div className="wind-animation">
                        <div className="stream line-1"></div>
                        <div className="stream line-2"></div>
                        <div className="stream line-3"></div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default WeatherCard;