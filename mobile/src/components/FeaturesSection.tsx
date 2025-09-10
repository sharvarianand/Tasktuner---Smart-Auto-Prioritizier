import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Card from './ui/Card';
import { 
  Brain, 
  Calendar, 
  Target, 
  Clock, 
  Trophy 
} from 'lucide-react-native';
import { Animated } from 'react-native';

interface Feature {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  action: string;
}

interface FeaturesSectionProps {
  onFeaturePress?: (action: string) => void;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onFeaturePress }) => {
  const { theme, isDark } = useTheme();

  const features: Feature[] = [
    {
      icon: Brain,
      title: "AI Roast Generator",
      description: "Get brutally honest feedback on your procrastination habits",
      action: "roast"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Auto-sync with Google Calendar and optimize your time blocks",
      action: "calendar"
    },
    {
      icon: Target,
      title: "Goal Breakdown",
      description: "Turn massive goals into bite-sized, achievable tasks",
      action: "tasks"
    },
    {
      icon: Clock,
      title: "Focus Mode",
      description: "Pomodoro timer with AI-powered break suggestions and distraction blocking",
      action: "focus"
    },
    {
      icon: Trophy,
      title: "Gamified Progress",
      description: "Earn XP, build streaks, and compete with friends",
      action: "analytics"
    }
  ];

  const animatedValues = useRef(
    features.map(() => new Animated.Value(1))
  ).current;

  const handleFeaturePress = (action: string, index: number) => {
    if (onFeaturePress) {
      onFeaturePress(action);
    }
  };

  const handlePressIn = (index: number) => {
    Animated.spring(animatedValues[index], {
      toValue: 0.95,
      useNativeDriver: false,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = (index: number) => {
    Animated.spring(animatedValues[index], {
      toValue: 1,
      useNativeDriver: false,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Section Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Why TaskTuner{' '}
            <Text style={[styles.titleAccent, { color: theme.colors.primary }]}>
              Works
            </Text>
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            We don't just manage your tasks - we transform your entire approach to productivity
          </Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Animated.View
              key={feature.title}
              style={[
                styles.featureCard,
                {
                  transform: [{ scale: animatedValues[index] }],
                }
              ]}
            >
              <TouchableOpacity
                onPress={() => handleFeaturePress(feature.action, index)}
                onPressIn={() => handlePressIn(index)}
                onPressOut={() => handlePressOut(index)}
                activeOpacity={0.8}
              >
                <Card 
                  variant="glass"
                  style={[styles.card, { 
                    backgroundColor: theme.colors.surface,
                    borderColor: isDark ? '#374151' : '#e5e7eb'
                  }]}
                >
                  <View style={styles.cardContent}>
                    <View style={[styles.iconContainer, { 
                      backgroundColor: theme.colors.primary + '20' 
                    }]}>
                      {React.createElement(feature.icon, {
                        size: 24,
                        color: theme.colors.primary
                      })}
                    </View>
                    
                    <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                      {feature.title}
                    </Text>
                    
                    <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                      {feature.description}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  content: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  titleAccent: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
  },
  cardContent: {
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default FeaturesSection;

