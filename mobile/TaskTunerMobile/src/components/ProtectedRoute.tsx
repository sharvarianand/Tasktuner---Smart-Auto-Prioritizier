import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useDemo } from '../contexts/DemoContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn, isLoading } = useAuth();
  const { isDemo } = useDemo();

  // Show loading while auth is initializing
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading TaskTuner...</Text>
      </View>
    );
  }

  // Allow demo access without authentication
  if (isDemo) {
    return <>{children}</>;
  }

  // Redirect to auth if not signed in
  if (!isSignedIn) {
    // In a real app, you would navigate to auth screen
    // For now, we'll show a message
    return (
      <View style={styles.authRequiredContainer}>
        <Text style={styles.authRequiredText}>
          Please sign in to access this feature
        </Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f23',
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 16,
    fontSize: 16,
  },
  authRequiredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f23',
    paddingHorizontal: 20,
  },
  authRequiredText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ProtectedRoute;
