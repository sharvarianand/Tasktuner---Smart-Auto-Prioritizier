import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Card from './ui/Card';
import { Star } from 'lucide-react-native';
import { Animated } from 'react-native';

interface Testimonial {
  quote: string;
  author: string;
  rating: number;
}

interface TestimonialsSectionProps {
  // No props needed for now
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = () => {
  const { theme, isDark } = useTheme();

  const testimonials: Testimonial[] = [
    {
      quote: "TaskTuner roasted me so hard I actually started doing my assignments 😭",
      author: "Priya, College Student",
      rating: 5
    },
    {
      quote: "Finally, an app that doesn't sugarcoat my productivity issues",
      author: "Rohit, Developer",
      rating: 5
    },
    {
      quote: "The AI coach is savage but it WORKS. 10/10 would get roasted again",
      author: "Arjun, Entrepreneur",
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, i) => (
      <Star 
        key={i} 
        size={16} 
        color={isDark ? '#fbbf24' : '#f59e0b'} 
        fill={isDark ? '#fbbf24' : '#f59e0b'} 
      />
    ));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Section Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            What People Are{' '}
            <Text style={[styles.titleAccent, { color: theme.colors.primary }]}>
              Saying
            </Text>
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Real feedback from real procrastinators (just like you)
          </Text>
        </View>

        {/* Testimonials */}
        <View style={styles.testimonialsContainer}>
          {testimonials.map((testimonial, index) => (
            <Animated.View
              key={index}
              style={styles.testimonialCard}
            >
              <Card style={[styles.card, { 
                backgroundColor: theme.colors.surface,
                borderColor: isDark ? '#374151' : '#e5e7eb'
              }]}>
                <View style={styles.cardContent}>
                  {/* Stars */}
                  <View style={styles.starsContainer}>
                    {renderStars(testimonial.rating)}
                  </View>
                  
                  {/* Quote */}
                  <Text style={[styles.quote, { color: theme.colors.text }]}>
                    "{testimonial.quote}"
                  </Text>
                  
                  {/* Author */}
                  <Text style={[styles.author, { color: theme.colors.textSecondary }]}>
                    — {testimonial.author}
                  </Text>
                </View>
              </Card>
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
  testimonialsContainer: {
    gap: 16,
  },
  testimonialCard: {
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
  },
  cardContent: {
    padding: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'center',
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  author: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default TestimonialsSection;

