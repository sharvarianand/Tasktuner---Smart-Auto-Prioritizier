import React from 'react';
import { ClerkProvider, ClerkProviderProps } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

// You'll need to replace this with your actual Clerk publishable key
// Get it from your Clerk dashboard: https://dashboard.clerk.com/
const CLERK_PUBLISHABLE_KEY = 'pk_test_cG9saXNoZWQtZG9yeS02Mi5jbGVyay5hY2NvdW50cy5kZXYk';

// Custom token cache for Clerk
const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },
  async saveToken(key: string, token: string) {
    try {
      await SecureStore.setItemAsync(key, token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },
};

interface TaskTunerClerkProviderProps {
  children: React.ReactNode;
}

export const TaskTunerClerkProvider: React.FC<TaskTunerClerkProviderProps> = ({ children }) => {
  if (!CLERK_PUBLISHABLE_KEY || CLERK_PUBLISHABLE_KEY.includes('your-clerk-publishable-key-here')) {
    console.warn('⚠️ Clerk publishable key not configured. Authentication will not work.');
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      {children}
    </ClerkProvider>
  );
};

export default TaskTunerClerkProvider;
