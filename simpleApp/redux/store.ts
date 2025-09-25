import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import themeReducer from './themeSlice';

const rootReducer = combineReducers({
  theme: themeReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;