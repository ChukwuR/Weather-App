import { Link } from 'react-router-dom';
import '../style/highlightCard.css';
function HighlightCard({ type, city, temperature, description }) {
  const icons = {
    hot: '🔥',
    cold: '❄️',
    rainy: '🌧️',
    snowy: '☃️',
  };

  return (
    <Link to={`${import.meta.env.VITE_WEATHER_URL}/${encodeURIComponent(city)}`} className={`highlight-card ${type}`}>
      <div className="highlight-icon">{icons[type]}</div>
      <div className="highlight-content">
        <h3>{type.charAt(0).toUpperCase() + type.slice(1)} City</h3>
        <p className="highlight-city">{city}</p>
        {temperature && <p className="highlight-temp">{temperature}</p>}
        <p className="highlight-desc">{description}</p>
      </div>
    </Link>
  );
}

export default HighlightCard;