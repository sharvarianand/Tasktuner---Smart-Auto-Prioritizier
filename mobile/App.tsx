import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from './src/utils/cache';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/contexts/ThemeContext';
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

const App: React.FC = () => {
  useEffect(() => {
    // Hide splash screen after app loads
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.log('Error hiding splash screen:', error);
      }
    };

    // Hide splash screen after a short delay
    const timer = setTimeout(hideSplash, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Check if Clerk key is properly configured
  const isClerkConfigured = CLERK_PUBLISHABLE_KEY && 
    CLERK_PUBLISHABLE_KEY.startsWith('pk_');

  const AppContent = () => (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <VoiceProvider>
              <NotificationProvider>
                <NavigationContainer>
                  <StatusBar style="auto" />
                  <AppNavigator />
                </NavigationContainer>
              </NotificationProvider>
            </VoiceProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );

  // When Clerk isn't configured, render the app without ClerkProvider so Landing can show
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
