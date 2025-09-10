import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Button from './ui/Button';
import Badge from './ui/Badge';
import Logo3D from './Logo3D';
import { ArrowRight, ChevronDown } from 'lucide-react-native';
import { Animated } from 'react-native';

interface HeroSectionProps {
  onGetStarted?: () => void;
  onTryRoast?: () => void;
  onScrollToFeatures?: () => void;
  onLogoAction?: (action: string) => void;
}

const { width, height } = Dimensions.get('window');

const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted,
  onTryRoast,
  onScrollToFeatures,
  onLogoAction,
}) => {
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Badge */}
        <View style={styles.badgeContainer}>
          <Badge variant="outline" style={styles.badge}>
            🔥 Where Procrastination Dies Screaming
          </Badge>
        </View>

        {/* Main Title */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Welcome to{' '}
            <Text style={[styles.titleAccent, { color: theme.colors.primary }]}>
              TaskTuner!
            </Text>
          </Text>
        </View>

        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            The savage AI productivity coach that schedules your tasks, 
            syncs your calendar, and roasts your excuses into oblivion.
          </Text>
        </View>

        {/* CTA Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Start Getting Roasted"
            onPress={onGetStarted}
            variant="primary"
            size="large"
            icon={ArrowRight}
            style={styles.primaryButton}
          />
          
          <Button
            title="Try a Free Roast First"
            onPress={onTryRoast}
            variant="outline"
            size="large"
            style={styles.secondaryButton}
          />
        </View>

        {/* 3D Logo Display */}
        <View style={styles.logoContainer}>
          <Animated.View style={styles.logoWrapper}>
            <Logo3D 
              size="xl" 
              variant="hero" 
              animated={true} 
              showText={false}
              onActionClick={onLogoAction}
            />
          </Animated.View>
        </View>

        {/* Scroll Indicator */}
        <View style={styles.scrollIndicator}>
          <Text style={[styles.scrollText, { color: theme.colors.textSecondary }]}>
            Scroll to explore
          </Text>
          <ChevronDown 
            size={20} 
            color={theme.colors.textSecondary} 
            style={styles.scrollIcon}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: height * 0.9,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeContainer: {
    marginBottom: 24,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  titleContainer: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 40,
  },
  titleAccent: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitleContainer: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
    gap: 16,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  logoWrapper: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  scrollIndicator: {
    alignItems: 'center',
    marginTop: 20,
  },
  scrollText: {
    fontSize: 14,
    marginBottom: 8,
  },
  scrollIcon: {
    opacity: 0.7,
  },
});

export default HeroSection;

