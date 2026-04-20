import { createContext, useContext } from 'react';

export const ThemeContext = createContext(null);
export const useThemeCtx = () => useContext(ThemeContext);
