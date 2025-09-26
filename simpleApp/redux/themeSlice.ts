import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  mode: 'light' | 'dark' | 'custom';
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  inputBackground: string;
  borderColor: string;
}

const initialState: ThemeState = {
  mode: 'light',
  accentColor: '#1DB954',
  backgroundColor: '#FFFFFF',
  textColor: '#000000',
  secondaryTextColor: '#666666',
  inputBackground: '#F5F5F5',
  borderColor: '#E0E0E0',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'custom'>) => {
      state.mode = action.payload;
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;
    },
    setBackgroundColor: (state, action: PayloadAction<string>) => {
      state.backgroundColor = action.payload;
    },
    setTextColor: (state, action: PayloadAction<string>) => {
      state.textColor = action.payload;
    },
  },
});

export const { setTheme, setAccentColor, setBackgroundColor, setTextColor } = themeSlice.actions;
export default themeSlice.reducer;