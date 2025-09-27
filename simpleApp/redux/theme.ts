import { useSelector } from 'react-redux';
import { RootState } from './store';

export interface Theme {
  mode: 'light' | 'dark' | 'custom'; // Add mode to the Theme interface
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  accentColor: string;
  inputBackground: string;
  borderColor: string;
}

export const themes: Record<'light' | 'dark' | 'custom', Omit<Theme, 'mode'>> = {
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
  const { mode, accentColor, backgroundColor } = useSelector((state: RootState) => state.theme);
  const baseTheme = themes[mode];
  if (mode === 'custom') {
    return {
      mode, // Return mode
      ...baseTheme,
      backgroundColor: backgroundColor || baseTheme.backgroundColor,
      accentColor: accentColor || baseTheme.accentColor,
    };
  }
  return {
    mode, // Return mode
    ...baseTheme,
    accentColor: accentColor || baseTheme.accentColor,
  };
};