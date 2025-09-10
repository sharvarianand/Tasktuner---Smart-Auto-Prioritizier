import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/ui/Button';
import { AlertCircle, ArrowLeft } from 'lucide-react-native';

const NoAuthScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const handleGoBack = () => {
    navigation.navigate('Landing' as never);
  };

  const handleTryDemo = () => {
    navigation.navigate('Main' as never);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <AlertCircle size={64} color={theme.colors.primary} />
        </View>
        
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Authentication Not Configured
        </Text>
        
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Clerk authentication is not set up for this app. You can still explore the demo features.
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Try Demo Mode"
            onPress={handleTryDemo}
            variant="primary"
            size="large"
            style={styles.demoButton}
          />
          
          <Button
            title="Go Back"
            onPress={handleGoBack}
            variant="outline"
            size="large"
            icon={ArrowLeft}
            style={styles.backButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  demoButton: {
    width: '100%',
  },
  backButton: {
    width: '100%',
  },
});

export default NoAuthScreen;
