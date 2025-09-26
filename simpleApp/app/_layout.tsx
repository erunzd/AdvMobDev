import { Provider } from 'react-redux';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { store } from '../redux/store';
import { useTheme } from '../redux/theme';
import React from 'react';

function AppContent() {
  const theme = useTheme();

  return (
    <>
      <Stack initialRouteName="Login">
        <Stack.Screen name="Login" options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" options={{ headerShown: false }} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={theme.backgroundColor === '#FFFFFF' ? 'dark' : 'light'} />
    </>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    'SpotifyMix-Regular': require('../assets/fonts/SpotifyMix-Regular.ttf'),
    'SpotifyMix-Bold': require('../assets/fonts/SpotifyMix-Bold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}