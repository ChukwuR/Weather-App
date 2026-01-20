import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light'); // 'light' or 'dark'

  const updateTheme = (weather, sunrise, sunset) => {
    const condition = weather?.description?.split(' ')[0];
    const now = Date.now() / 1000; // current time in UNIX seconds

    const isNight = now < sunrise || now > sunset;

    const weatherDark = ['Rain', 'Thunderstorm', 'Clouds', 'Mist'];
    const weatherBased = weatherDark.includes(condition) ? 'dark' : 'light';

    const finalTheme = isNight ? 'dark' : weatherBased;
    setThemeMode(finalTheme);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);