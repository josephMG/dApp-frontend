import { useEffect, useState } from 'react';
import { useBetween } from 'use-between';

const useThemeMode = () => {
  const [darkMode, setDarkMode] = useState(0);

  useEffect(() => {
    // Setup darkmode
    setDarkMode(localStorage.getItem('mode') ? parseInt(localStorage.getItem('mode') || '') : 0);
  }, []);
  const toggleMode = () => {
    localStorage.setItem('mode', (1 - darkMode).toString());
    setDarkMode(1 - darkMode);
  };
  return { darkMode, toggleMode };
};

export default () => useBetween(useThemeMode);
