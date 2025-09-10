import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@clerk/clerk-expo';
import { RootStackParamList } from '../types';
import { CLERK_PUBLISHABLE_KEY } from '../config/constants';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import LoadingScreen from '../screens/LoadingScreen';
import LandingScreen from '../screens/LandingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const isClerkConfigured = CLERK_PUBLISHABLE_KEY && CLERK_PUBLISHABLE_KEY.startsWith('pk_');
  const clerkAuth = isClerkConfigured ? useAuth() : ({ isLoaded: true, isSignedIn: false } as any);
  const { isLoaded, isSignedIn } = clerkAuth as any;
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setShowLoading(false);
    } else {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  if (!isLoaded || showLoading) {
    return <LoadingScreen />;
  }

  const initialRoute = !isClerkConfigured ? 'Landing' : isSignedIn ? 'Main' : 'Auth';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Main" component={MainNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
