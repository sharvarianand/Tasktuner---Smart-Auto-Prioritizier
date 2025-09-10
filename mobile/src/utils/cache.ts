import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import { TokenCache } from '@clerk/clerk-expo/dist/cache';

// Create a token cache that Clerk can use
const createTokenCache = (): TokenCache => ({
  getToken: async (key: string) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      console.error('Failed to get token', err);
      return null;
    }
  },
  saveToken: async (key: string, token: string) => {
    try {
      await SecureStore.setItemAsync(key, token);
    } catch (err) {
      console.error('Failed to save token', err);
    }
  },
});

export const tokenCache = createTokenCache();

export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync('clerk_token');
  } catch (err) {
    return null;
  }
};

export const setAuthToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync('clerk_token', token);
  } catch (err) {
    console.error('Failed to save auth token', err);
  }
};

export const clearAuthToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync('clerk_token');
  } catch (err) {
    console.error('Failed to clear auth token', err);
  }
};

export const getRedirectUrl = (): string => {
  // This should match the URL scheme you've configured in your Expo app.json
  return AuthSession.makeRedirectUri({
    scheme: 'tasktuner',
    path: 'oauth-native-callback',
  });
};
