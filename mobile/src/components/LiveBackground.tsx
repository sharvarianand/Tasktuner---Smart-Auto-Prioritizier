import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

const NUM_PARTICLES = 18;

const LiveBackground: React.FC = () => {
  const { isDark } = useTheme();
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 12000, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(drift, { toValue: 0, duration: 12000, useNativeDriver: Platform.OS !== 'web' }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [drift]);

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
    },
    gradient1: {
      position: 'absolute',
      top: -height * 0.1,
      left: -width * 0.2,
      right: 0,
      height: height * 0.5,
      backgroundColor: isDark ? 'rgba(139, 92, 246, 0.10)' : 'rgba(139, 92, 246, 0.06)',
      borderBottomRightRadius: 400,
    },
    gradient2: {
      position: 'absolute',
      top: height * 0.25,
      right: -width * 0.2,
      width: width * 0.7,
      height: height * 0.35,
      backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.05)',
      borderTopLeftRadius: 300,
    },
    gradient3: {
      position: 'absolute',
      bottom: -height * 0.15,
      left: -width * 0.1,
      width: width * 0.6,
      height: height * 0.45,
      backgroundColor: isDark ? 'rgba(34, 211, 238, 0.08)' : 'rgba(34, 211, 238, 0.05)',
      borderTopRightRadius: 350,
    },
    particle: {
      position: 'absolute',
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: isDark ? 'rgba(167, 139, 250, 0.6)' : 'rgba(139, 92, 246, 0.5)',
    },
    circle: {
      position: 'absolute',
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: isDark ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.08)',
    },
  });

  const driftX = drift.interpolate({ inputRange: [0, 1], outputRange: [0, 10] });
  const driftY = drift.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

  return (
    <View style={[styles.container, { pointerEvents: 'none' }]}>
      <View style={styles.gradient1} />
      <View style={styles.gradient2} />
      <View style={styles.gradient3} />

      <Animated.View style={{ transform: [{ translateX: driftX }, { translateY: driftY }] }}>
        {Array.from({ length: NUM_PARTICLES }).map((_, i) => {
          const left = (i * 53) % width;
          const top = (i * 97) % height;
          const opacity = 0.25 + ((i * 7) % 50) / 100;
          return <View key={i} style={[styles.particle, { left, top, opacity }]} />;
        })}
      </Animated.View>

      <Animated.View style={{ transform: [{ translateX: Animated.multiply(drift, 12) as any }, { translateY: Animated.multiply(drift, -10) as any }] }}>
        <View style={[styles.circle, { top: height * 0.1, left: width * 0.1 }]} />
        <View style={[styles.circle, { top: height * 0.25, right: width * 0.15 }]} />
        <View style={[styles.circle, { bottom: height * 0.2, left: width * 0.2 }]} />
      </Animated.View>
    </View>
  );
};

export default LiveBackground;
