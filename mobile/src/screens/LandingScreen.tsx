import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { CLERK_PUBLISHABLE_KEY } from '../config/constants';
import { landingService, LandingData } from '../services/landingService';
import LiveBackground from '../components/LiveBackground';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';
import RoastGenerator from '../components/RoastGenerator';

const LandingScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const [landingData, setLandingData] = useState<LandingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const isClerkConfigured = CLERK_PUBLISHABLE_KEY && CLERK_PUBLISHABLE_KEY.startsWith('pk_');

  // Debug Clerk configuration
  console.log('Clerk Configuration Status:', {
    hasKey: !!CLERK_PUBLISHABLE_KEY,
    keyPrefix: CLERK_PUBLISHABLE_KEY?.substring(0, 10) + '...',
    isConfigured: isClerkConfigured
  });

  useEffect(() => {
    loadLandingData();
  }, []);

  const loadLandingData = async () => {
    try {
      setIsLoading(true);
      const data = await landingService.getLandingData();
      setLandingData(data);
      
      // Track that user viewed landing page
      await landingService.trackLandingPageEvent('page_viewed', {
        hasClerk: isClerkConfigured,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading landing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetStarted = async () => {
    await landingService.trackLandingPageEvent('get_started_clicked', {
      hasClerk: isClerkConfigured
    });
    
    if (isClerkConfigured) {
      // Navigate to Clerk authentication
      navigation.navigate('Auth' as never);
    } else {
      // If Clerk is not configured, show an alert and navigate to main
      Alert.alert(
        'Authentication Setup Required',
        'To enable sign-in functionality, please configure your Clerk publishable key in the environment variables.',
        [
          { text: 'Try Demo Instead', onPress: () => navigation.navigate('Main' as never) },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  const handleTryDemo = async () => {
    await landingService.trackLandingPageEvent('try_demo_clicked');
    navigation.navigate('Main' as never);
  };

  const handleTryRoast = async () => {
    await landingService.trackLandingPageEvent('try_roast_clicked', {
      hasClerk: isClerkConfigured
    });
    
    if (isClerkConfigured) {
      // Navigate to Clerk authentication for roast functionality
      navigation.navigate('Auth' as never);
    } else {
      // If Clerk is not configured, show an alert and provide demo access
      Alert.alert(
        'Authentication Setup Required',
        'To access personalized roasts, please configure authentication. You can try the demo version instead.',
        [
          { text: 'Try Demo', onPress: () => navigation.navigate('Main' as never) },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  const handleScrollToFeatures = () => {
    landingService.trackLandingPageEvent('scroll_to_features');
  };

  const handleFeaturePress = async (action: string, index?: number) => {
    await landingService.trackLandingPageEvent('feature_pressed', {
      action,
      index
    });
    
    switch (action) {
      case 'calendar':
      case 'tasks':
      case 'focus':
      case 'analytics':
        navigation.navigate('Main' as never);
        break;
      case 'roast':
        if (isClerkConfigured) {
          navigation.navigate('Auth' as never);
        } else {
          navigation.navigate('Main' as never);
        }
        break;
      default:
        break;
    }
  };

  const handleLogoAction = (action: string) => {
    landingService.trackLandingPageEvent('logo_action', { action });
    handleFeaturePress(action);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LiveBackground />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading TaskTuner experience...
          </Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <HeroSection
            onGetStarted={handleGetStarted}
            onTryRoast={handleTryRoast}
            onScrollToFeatures={handleScrollToFeatures}
            onLogoAction={handleLogoAction}
          />

          <FeaturesSection />

          <View style={[styles.roastSection, { 
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'
          }]}>
            <View style={styles.roastContent}>
              <View style={styles.roastHeader}>
                <Text style={[styles.roastTitleMainText, { color: theme.colors.text }]}> 
                  Get Your <Text style={[styles.roastTitleAccentText, { color: theme.colors.primary }]}>Free Roast</Text>
                </Text>
                <Text style={[styles.roastSubtitleText, { color: theme.colors.textSecondary }]}> 
                  Experience TaskTuner's savage AI coach. No signup required - just pure, unfiltered motivation.
                </Text>
                {landingData?.stats && (
                  <Text style={[styles.roastStatsText, { color: theme.colors.primary }]}>
                    🔥 {landingData.stats.roastsDelivered.toLocaleString()} roasts delivered • 
                    📈 {landingData.stats.avgProductivityIncrease}% avg productivity increase
                  </Text>
                )}
              </View>

              <RoastGenerator
                onSignUp={handleGetStarted}
                onTryDemo={handleTryDemo}
              />
            </View>
          </View>

          <TestimonialsSection />

          <CTASection 
            onGetStarted={handleGetStarted}
          />

          <View style={[styles.footer, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.footerContent}>
              <Text style={[styles.footerTextMainText, { color: theme.colors.text }]}> 
                Made with ❤️ for productivity enthusiasts
              </Text>
              <Text style={[styles.footerSubtextText, { color: theme.colors.textSecondary }]}> 
                © 2024 TaskTuner. All rights reserved.
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  roastSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  roastContent: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  roastHeader: {
    marginBottom: 32,
    alignItems: 'center',
    gap: 8,
  },
  roastTitleMainText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  roastTitleAccentText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  roastSubtitleText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  roastStatsText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 8,
  },
  footer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  footerContent: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  footerTextMainText: {
    fontSize: 14,
    textAlign: 'center',
  },
  footerSubtextText: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default LandingScreen;