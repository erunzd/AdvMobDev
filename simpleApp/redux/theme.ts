import { useSelector } from 'react-redux';
import { RootState } from './store';

export interface Theme {
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  accentColor: string;
  inputBackground: string;
  borderColor: string;
}

export const themes: Record<'light' | 'dark' | 'custom', Theme> = {
  light: {
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    secondaryTextColor: '#666666',
    accentColor: '#00C4B4', // Teal for light mode
    inputBackground: '#F0F0F0',
    borderColor: '#CCCCCC',
  },
  dark: {
    backgroundColor: '#121212',
    textColor: '#FFFFFF',
    secondaryTextColor: '#AAAAAA',
    accentColor: '#1DB954', // Spotify green
    inputBackground: '#1E1E1E',
    borderColor: '#FFFFFF',
  },
  custom: {
    backgroundColor: '#121212', // Fallback, updated dynamically
    textColor: '#FFFFFF',
    secondaryTextColor: '#AAAAAA',
    accentColor: '#1DB954', // Updated by user
    inputBackground: '#1E1E1E',
    borderColor: '#FFFFFF',
  },
};

export const useTheme = () => {
  const { mode, accentColor } = useSelector((state: RootState) => state.theme);
  const theme = { ...themes[mode], accentColor: mode === 'custom' ? accentColor : themes[mode].accentColor };
  return theme;
};