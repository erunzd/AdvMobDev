import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  mode: 'light' | 'dark' | 'custom';
  accentColor: string;
}

const initialState: ThemeState = {
  mode: 'dark',
  accentColor: '#1DB954', // Default Spotify green
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<'light' | 'dark' | 'custom'>) {
      state.mode = action.payload;
      if (action.payload !== 'custom') {
        state.accentColor = action.payload === 'light' ? '#00C4B4' : '#1DB954';
      }
    },
    setAccentColor(state, action: PayloadAction<string>) {
      state.mode = 'custom';
      state.accentColor = action.payload;
    },
  },
});

export const { setTheme, setAccentColor } = themeSlice.actions;
export default themeSlice.reducer;