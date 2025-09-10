import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { CLERK_PUBLISHABLE_KEY } from '../config/constants';
import LiveBackground from '../components/LiveBackground';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';
import RoastGenerator from '../components/RoastGenerator';

const LandingScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  
  const isClerkConfigured = CLERK_PUBLISHABLE_KEY && CLERK_PUBLISHABLE_KEY.startsWith('pk_');

  const handleGetStarted = () => {
    if (isClerkConfigured) {
      navigation.navigate('Auth' as never);
    } else {
      // Show alert or navigate to demo
      navigation.navigate('Main' as never);
    }
  };

  const handleTryDemo = () => {
    navigation.navigate('Main' as never);
  };

  const handleTryRoast = () => {
    if (isClerkConfigured) {
      navigation.navigate('Auth' as never);
    } else {
      // Show alert or navigate to demo
      navigation.navigate('Main' as never);
    }
  };
  const handleScrollToFeatures = () => {};

  const handleFeaturePress = (action: string, index?: number) => {
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
    handleFeaturePress(action);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LiveBackground />
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

        <FeaturesSection onFeaturePress={handleFeaturePress} />

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
            </View>

            <RoastGenerator
              onSignUp={handleGetStarted}
              onTryDemo={handleTryDemo}
            />
          </View>
        </View>

        <TestimonialsSection />

        <CTASection onGetStarted={handleGetStarted} />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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