import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useVoice } from '../contexts/VoiceContext';
import { roastService, Roast } from '../services/roastService';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { 
  Flame, 
  Zap, 
  Target, 
  Clock, 
  RefreshCw, 
  Volume2, 
  VolumeX 
} from 'lucide-react-native';
import { Animated } from 'react-native';

interface RoastGeneratorProps {
  onSignUp?: () => void;
  onTryDemo?: () => void;
}

const RoastGenerator: React.FC<RoastGeneratorProps> = ({ 
  onSignUp, 
  onTryDemo 
}) => {
  const { theme, isDark } = useTheme();
  const { speak, stopSpeaking, isSpeaking } = useVoice();
  const [currentRoast, setCurrentRoast] = useState<Roast | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Load initial roast
  useEffect(() => {
    loadRoast();
  }, []);

  const loadRoast = async () => {
    try {
      setIsLoading(true);
      const roast = await roastService.getRandomRoast();
      setCurrentRoast(roast);
    } catch (error) {
      console.error('Error loading roast:', error);
      // Fallback to local roast
      setCurrentRoast({
        id: 1,
        message: "Still scrolling social media instead of being productive? Time to get your act together!",
        severity: 'mild'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewRoast = async () => {
    setIsAnimating(true);
    stopSpeaking();

    // Fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Load new roast
      loadRoast().then(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start(() => {
          setIsAnimating(false);
        });
      });
    });
  };

  const handleSpeakRoast = () => {
    if (currentRoast && !isSpeaking) {
      speak(currentRoast.message);
    } else if (isSpeaking) {
      stopSpeaking();
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' };
      case 'medium': return { bg: '#fef3c7', text: '#92400e', border: '#fbbf24' };
      case 'spicy': return { bg: '#fed7aa', text: '#c2410c', border: '#fb923c' };
      case 'brutal': return { bg: '#fecaca', text: '#dc2626', border: '#f87171' };
      default: return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'mild': return '🧊 Mild';
      case 'medium': return '🌶️ Medium';
      case 'spicy': return '🔥 Spicy';
      case 'brutal': return '💀 Brutal';
      default: return 'Roast';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'mild': return Clock;
      case 'medium': return Target;
      case 'spicy': return Flame;
      case 'brutal': return Zap;
      default: return Target;
    }
  };

  if (!currentRoast) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>
              Loading roast...
            </Text>
          </View>
        </Card>
      </View>
    );
  }

  const severityColors = getSeverityColor(currentRoast.severity);
  const SeverityIcon = getSeverityIcon(currentRoast.severity);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Card style={styles.card}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <View style={[styles.iconBackground, { backgroundColor: theme.colors.primary + '20' }]}>
                <SeverityIcon size={32} color={theme.colors.primary} />
              </View>
            </View>
            
            <View style={[styles.badgeContainer, { 
              backgroundColor: severityColors.bg,
              borderColor: severityColors.border 
            }]}>
              <Text style={[styles.badgeText, { color: severityColors.text }]}>
                {getSeverityLabel(currentRoast.severity)}
              </Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={[styles.quote, { color: theme.colors.text }]}>
              "{currentRoast.message}"
            </Text>
            
            <View style={styles.buttonContainer}>
              <View style={styles.buttonRow}>
                <Button
                  title={isLoading ? "Loading..." : "Get Another Roast"}
                  onPress={generateNewRoast}
                  variant="outline"
                  size="medium"
                  disabled={isLoading || isAnimating}
                  icon={RefreshCw}
                  style={styles.button}
                />
                
                <Button
                  title={isSpeaking ? "Stop" : "Speak This Roast"}
                  onPress={handleSpeakRoast}
                  variant="outline"
                  size="medium"
                  icon={isSpeaking ? VolumeX : Volume2}
                  style={styles.button}
                />
              </View>
              
              <View style={styles.ctaRow}>
                {onSignUp ? (
                  <Button
                    title="Start Being Productive"
                    onPress={onSignUp}
                    variant="primary"
                    size="large"
                    icon={Zap}
                    style={styles.ctaButton}
                  />
                ) : onTryDemo ? (
                  <Button
                    title="Try Demo"
                    onPress={onTryDemo}
                    variant="primary"
                    size="large"
                    icon={Zap}
                    style={styles.ctaButton}
                  />
                ) : null}
              </View>
            </View>
          </View>
        </Card>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
          Ready to turn that roast into real results? Sign up to access the full TaskTuner experience!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  card: {
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    alignItems: 'center',
  },
  quote: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
  },
  ctaRow: {
    width: '100%',
  },
  ctaButton: {
    width: '100%',
  },
  footer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default RoastGenerator;

