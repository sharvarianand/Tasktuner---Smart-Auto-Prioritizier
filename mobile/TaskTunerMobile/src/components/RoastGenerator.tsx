import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { aiApi } from '../services/api';

const roasts = [
  {
    id: 1,
    message: "Still scrolling social media instead of being productive? Time to get your act together!",
    severity: "mild",
    icon: "time-outline"
  },
  {
    id: 2,
    message: "Your to-do list is longer than a CVS receipt. Maybe it's time to actually DO something about it?",
    severity: "medium",
    icon: "list-outline"
  },
  {
    id: 3,
    message: "You've been 'planning to start tomorrow' for 47 tomorrows. Today IS tomorrow!",
    severity: "spicy",
    icon: "flame-outline"
  },
  {
    id: 4,
    message: "Your procrastination skills are Olympic-level. Too bad they don't give medals for that.",
    severity: "brutal",
    icon: "trophy-outline"
  },
  {
    id: 5,
    message: "You know what's harder than starting? Explaining why you didn't start. Again.",
    severity: "medium",
    icon: "chatbubble-outline"
  },
  {
    id: 6,
    message: "Your future self called. They're disappointed but not surprised.",
    severity: "spicy",
    icon: "call-outline"
  }
];

const RoastGenerator = () => {
  const [currentRoast, setCurrentRoast] = useState(roasts[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentRoast]);

  const generateNewRoast = async () => {
    setIsAnimating(true);
    fadeAnim.setValue(0);
    
    try {
      // Try to get roast from backend first
      const backendRoast = await aiApi.generateRoast('procrastination', 'user');
      if (backendRoast && backendRoast.roast) {
        const newRoast = {
          id: Date.now(),
          message: backendRoast.roast,
          severity: 'medium',
          icon: 'flame-outline'
        };
        setCurrentRoast(newRoast);
      } else {
        throw new Error('No roast from backend');
      }
    } catch (error) {
      console.log('Backend roast failed, using fallback:', error);
      // Fallback to local roasts
      const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
      setCurrentRoast(randomRoast);
    }
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const speakRoast = async () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    try {
      setIsSpeaking(true);
      await Speech.speak(currentRoast.message, {
        rate: 0.9,
        pitch: 0.8,
        volume: 1.0,
      });
      setIsSpeaking(false);
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild": return "#3B82F6";
      case "medium": return "#F59E0B";
      case "spicy": return "#EF4444";
      case "brutal": return "#DC2626";
      default: return "#6B7280";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "mild": return "🧊 Mild";
      case "medium": return "🌶️ Medium";
      case "spicy": return "🔥 Spicy";
      case "brutal": return "💀 Brutal";
      default: return "Roast";
    }
  };

  return (
    <View style={styles.container}>
      {/* Roast Card */}
      <Animated.View
        style={[
          styles.roastCard,
          {
            opacity: fadeAnim,
            transform: [{
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            }],
          },
        ]}
      >
        {/* Severity Badge */}
        <View style={[
          styles.severityBadge,
          { backgroundColor: getSeverityColor(currentRoast.severity) + '20' }
        ]}>
          <Text style={[
            styles.severityText,
            { color: getSeverityColor(currentRoast.severity) }
          ]}>
            {getSeverityLabel(currentRoast.severity)}
          </Text>
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons
            name={currentRoast.icon as any}
            size={48}
            color={getSeverityColor(currentRoast.severity)}
          />
        </View>

        {/* Roast Message */}
        <Text style={styles.roastMessage}>
          "{currentRoast.message}"
        </Text>
      </Animated.View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={generateNewRoast}
          disabled={isAnimating}
        >
          <Ionicons name="refresh" size={20} color="#8B5CF6" />
          <Text style={styles.actionButtonText}>
            {isAnimating ? 'Generating...' : 'Get Another Roast'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.speakButton,
            isSpeaking && styles.speakingButton
          ]}
          onPress={speakRoast}
        >
          <Ionicons
            name={isSpeaking ? "volume-high" : "volume-medium"}
            size={20}
            color="#fff"
          />
          <Text style={styles.speakButtonText}>
            {isSpeaking ? 'Speaking...' : 'Speak This Roast'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  roastCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#374151',
    width: '100%',
  },
  severityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  severityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8B5CF620',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  roastMessage: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 26,
    fontStyle: 'italic',
  },
  actionsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  actionButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  speakButton: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  speakingButton: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  speakButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default RoastGenerator;