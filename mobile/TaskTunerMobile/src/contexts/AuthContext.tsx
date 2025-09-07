import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  isLoading: boolean;
  signIn: (userData: User) => Promise<void>;
  signUp: (userData: User) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('tasktuner-user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user from AsyncStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const signIn = async (userData: User) => {
    setIsLoading(true);
    try {
      await AsyncStorage.setItem('tasktuner-user', JSON.stringify(userData));
      await AsyncStorage.setItem('tasktuner-user-id', userData.id);
      setUser(userData);
    } catch (error) {
      console.error('Sign In failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: User) => {
    setIsLoading(true);
    try {
      await AsyncStorage.setItem('tasktuner-user', JSON.stringify(userData));
      await AsyncStorage.setItem('tasktuner-user-id', userData.id);
      setUser(userData);
    } catch (error) {
      console.error('Sign Up failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('tasktuner-user');
      await AsyncStorage.removeItem('tasktuner-user-id');
      await AsyncStorage.removeItem('tasktuner-demo-mode');
      setUser(null);
    } catch (error) {
      console.error('Sign Out failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isSignedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, isSignedIn, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
