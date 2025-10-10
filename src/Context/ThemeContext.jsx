import React, { createContext, useContext, useState } from 'react';
import { themes } from '../Themes/Themes';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(prev => !prev);

  // const currentTheme = isDark ? themes.dark : themes.light;

  const currentTheme = themes.darkSea

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
