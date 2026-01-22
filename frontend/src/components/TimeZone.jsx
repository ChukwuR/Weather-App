import '../style/timeZone.css'

function TimeZone({ weather }) {
  console.log('TimeZone component loaded');
  console.log('Weather data in TimeZone:', JSON.stringify(weather, null, 2));

  if (
    !weather ||
    typeof weather.sunrise !== 'number' ||
    typeof weather.sunset !== 'number' ||
    typeof weather.timezone !== 'number'
  ) {
    console.log('Missing weather data:', weather);
    return <p>Time data not available</p>;
  }

  const formatTime = (timestamp, offset) => {
  const utc = (timestamp + offset) * 1000;
  const local = new Date(utc);
  return local.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};


  const getLocalTime = (offset) => {
  const nowUTC = new Date();
  const utc = nowUTC.getTime() + nowUTC.getTimezoneOffset() * 60000;
  const local = new Date(utc + offset * 1000);
  return local.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};


  return (
    <div className="sun-times">
      <h1>{getLocalTime(weather.timezone)}</h1>
    </div>
  );
}

export default TimeZone;