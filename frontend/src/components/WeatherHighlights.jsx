import HighlightCard from './HighlightCard';
import '../style/weatherHighlights.css';

function WeatherHighlights() {
  const highlights = [
    {
      type: 'hot',
      city: 'Lodwar, Kenya',
      temperature: '35°C',
      description: 'Sunny and hot',
    },
    {
      type: 'cold',
      city: 'Yakutsk, Russia',
      temperature: '-64°C',
      description: 'Deep freeze',
    },
    {
      type: 'rainy',
      city: 'Mawsynram, India',
      description: '11,872 mm/year – Monsoon heaven',
    },
    {
      type: 'snowy',
      city: 'Siberia, Russia',
      description: 'Heavy snowfall this week',
    },
  ];

  return (
    <section className="weather-highlights">
      <h2>🌟 Weather Highlights</h2>
      <div className="highlight-grid">
        {highlights.map((item, index) => (
          <HighlightCard key={index} {...item} />
        ))}
      </div>
    </section>
  );
}

export default WeatherHighlights;