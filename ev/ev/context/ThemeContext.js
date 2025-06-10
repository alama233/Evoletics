import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, hackerNews, miami, vercel, christmas } from '../config/themes';

// Import your themes
export const themes = {
  lightTheme,
  darkTheme,
  hackerNews,
  miami,
  vercel,
  christmas
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(themes.lightTheme);

  const changeTheme = async (themeName) => {
    const newTheme = themes[themeName];
    setCurrentTheme(newTheme);
    await AsyncStorage.setItem('userTheme', themeName);
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 