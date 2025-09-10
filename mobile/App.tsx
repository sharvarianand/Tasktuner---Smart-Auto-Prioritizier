import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from './src/utils/cache';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { VoiceProvider } from './src/contexts/VoiceContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import AppNavigator from './src/navigation/AppNavigator';
import { CLERK_PUBLISHABLE_KEY } from './src/config/constants';
import * as SplashScreen from 'expo-splash-screen';
import { Text, View } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const RootContent: React.FC = () => {
  const { isDark } = useTheme();
  return (
    <VoiceProvider>
      <NotificationProvider>
        <NavigationContainer>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <AppNavigator />
        </NavigationContainer>
      </NotificationProvider>
    </VoiceProvider>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.log('Error hiding splash screen:', error);
      }
    };

    const timer = setTimeout(hideSplash, 2000);
    return () => clearTimeout(timer);
  }, []);

  const isClerkConfigured = CLERK_PUBLISHABLE_KEY && 
    CLERK_PUBLISHABLE_KEY.startsWith('pk_');

  const AppContent = () => (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <RootContent />
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );

  if (!isClerkConfigured) {
    return <AppContent />;
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <AppContent />
    </ClerkProvider>
  );
};

export default App;
