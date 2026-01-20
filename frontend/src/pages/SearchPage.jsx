import { useEffect, useState } from 'react';
import '../style/navSection.css';
import Search from '../components/Search';

const fetchWeatherByCity = async (city) => {
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

function SearchPage({ onSearch }) {

  return (
    <div className="navSectionWrap d-flex"><div className="searchWrap">
        <Search onSearch={onSearch} />
      </div>
    </div>
  );
}

export default SearchPage;