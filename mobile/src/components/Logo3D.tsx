import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Zap, CheckCircle, Target, Brain, Trophy } from 'lucide-react-native';

interface Logo3DProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'hero' | 'navbar';
  animated?: boolean;
  showText?: boolean;
  onActionClick?: (action: string) => void;
}

const Logo3D: React.FC<Logo3DProps> = ({
  size = 'md',
  variant = 'default',
  animated = false,
  showText = true,
  onActionClick
}) => {
  const { isDark } = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { container: 40, icon: 20, text: 12 };
      case 'md':
        return { container: 60, icon: 30, text: 16 };
      case 'lg':
        return { container: 80, icon: 40, text: 20 };
      case 'xl':
        return { container: 120, icon: 60, text: 28 };
      default:
        return { container: 60, icon: 30, text: 16 };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return {
          container: {
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.06)',
            borderWidth: 2,
            borderColor: isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.2)',
            elevation: 10,
          }
        };
      case 'navbar':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          }
        };
      default:
        return {
          container: {
            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.5)',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.2)',
          }
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const pulse = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const tilt = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1600, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(pulse, { toValue: 0, duration: 1600, useNativeDriver: Platform.OS !== 'web' }),
      ])
    );
    const scaleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.03, duration: 2000, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(scale, { toValue: 1.0, duration: 2000, useNativeDriver: Platform.OS !== 'web' }),
      ])
    );
    loop.start();
    scaleLoop.start();
    return () => {
      loop.stop();
      scaleLoop.stop();
    };
  }, [animated, pulse, scale]);

  const styles = StyleSheet.create({
    container: {
      width: sizeStyles.container,
      height: sizeStyles.container,
      borderRadius: sizeStyles.container / 4,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      ...variantStyles.container,
    },
    icon: {
      color: isDark ? '#60a5fa' : '#2563eb',
    },
    text: {
      color: isDark ? '#f8fafc' : '#1e293b',
      fontWeight: 'bold',
      marginTop: 4,
      fontSize: sizeStyles.text,
    },
    floatingIcon: {
      position: 'absolute',
      opacity: 0.6,
    },
    glowRing: {
      position: 'absolute',
      top: -sizeStyles.container * 0.35,
      left: -sizeStyles.container * 0.35,
      width: sizeStyles.container * 1.7,
      height: sizeStyles.container * 1.7,
      borderRadius: sizeStyles.container * 0.85,
      backgroundColor: isDark ? 'rgba(139, 92, 246, 0.10)' : 'rgba(139, 92, 246, 0.08)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(139, 92, 246, 0.35)' : 'rgba(59, 130, 246, 0.25)',
    },
  });

  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  const pulseOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.5] });
  const tiltDeg = tilt.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '6deg'] });

  const handlePressIn = () => {
    Animated.timing(tilt, { toValue: 1, duration: 120, useNativeDriver: Platform.OS !== 'web' }).start();
  };
  const handlePressOut = () => {
    Animated.timing(tilt, { toValue: 0, duration: 120, useNativeDriver: Platform.OS !== 'web' }).start();
  };

  const LogoContent = () => (
    <Animated.View style={{ transform: [{ scale }, { rotate: tiltDeg }] }}>
      {variant === 'hero' && (
        <Animated.View style={[styles.glowRing, { transform: [{ scale: pulseScale }], opacity: pulseOpacity }]} />
      )}
      <View style={styles.container}>
        <Zap size={sizeStyles.icon} color={styles.icon.color} />
        {showText && (
          <Text style={styles.text}>TaskTuner</Text>
        )}
        {variant === 'hero' && onActionClick && (
          <View>
            <TouchableOpacity
              style={[styles.floatingIcon, { top: 8, left: 8 }]}
              onPress={() => onActionClick('roast')}
            >
              <Brain size={sizeStyles.icon / 3} color="#8b5cf6" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.floatingIcon, { top: 12, right: 12 }]}
              onPress={() => onActionClick('tasks')}
            >
              <Target size={sizeStyles.icon / 3} color="#10b981" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.floatingIcon, { bottom: 8, left: 12 }]}
              onPress={() => onActionClick('focus')}
            >
              <CheckCircle size={sizeStyles.icon / 3} color="#f59e0b" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.floatingIcon, { bottom: 12, right: 8 }]}
              onPress={() => onActionClick('analytics')}
            >
              <Trophy size={sizeStyles.icon / 3} color="#f97316" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Animated.View>
  );

  if (animated) {
    return (
      <TouchableOpacity activeOpacity={0.9} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <LogoContent />
      </TouchableOpacity>
    );
  }

  return <LogoContent />;
};

export default Logo3D;
