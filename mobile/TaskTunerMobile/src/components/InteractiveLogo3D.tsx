import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface InteractiveLogo3DProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'navbar' | 'hero';
  showText?: boolean;
  onActionClick?: (action: string) => void;
}

const InteractiveLogo3D: React.FC<InteractiveLogo3DProps> = ({
  size = 'md',
  variant = 'hero',
  showText = true,
  onActionClick,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous rotation animation
    const rotationAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );

    // Floating animation
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    rotationAnimation.start();
    floatAnimation.start();

    return () => {
      rotationAnimation.stop();
      floatAnimation.stop();
    };
  }, []);

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { width: 40, height: 40, iconSize: 20 };
      case 'md':
        return { width: 60, height: 60, iconSize: 30 };
      case 'lg':
        return { width: 80, height: 80, iconSize: 40 };
      case 'xl':
        return { width: 120, height: 120, iconSize: 60 };
      default:
        return { width: 60, height: 60, iconSize: 30 };
    }
  };

  const sizeStyles = getSizeStyles();

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const handlePress = () => {
    if (onActionClick) {
      onActionClick('logo');
    }
    
    // Pulse animation on press
    setIsAnimating(true);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => setIsAnimating(false));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.logoContainer, { width: sizeStyles.width, height: sizeStyles.height }]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              transform: [
                { rotate: rotation },
                { translateY: translateY },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['#8B5CF6', '#A855F7', '#C084FC']}
            style={[styles.logoGradient, { width: sizeStyles.width, height: sizeStyles.height }]}
          >
            <Ionicons 
              name="checkmark-circle" 
              size={sizeStyles.iconSize} 
              color="#fff" 
            />
          </LinearGradient>
        </Animated.View>

        {/* Floating elements for hero variant */}
        {variant === 'hero' && size === 'xl' && (
          <>
            <Animated.View
              style={[
                styles.floatingElement,
                styles.floatingElement1,
                {
                  transform: [
                    {
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '-360deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Ionicons name="brain" size={16} color="#8B5CF6" />
            </Animated.View>

            <Animated.View
              style={[
                styles.floatingElement,
                styles.floatingElement2,
                {
                  transform: [
                    {
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['360deg', '0deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Ionicons name="flash" size={14} color="#F59E0B" />
            </Animated.View>

            <Animated.View
              style={[
                styles.floatingElement,
                styles.floatingElement3,
                {
                  transform: [
                    {
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Ionicons name="target" size={18} color="#10B981" />
            </Animated.View>

            <Animated.View
              style={[
                styles.floatingElement,
                styles.floatingElement4,
                {
                  transform: [
                    {
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['-360deg', '0deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Ionicons name="trophy" size={16} color="#EF4444" />
            </Animated.View>
          </>
        )}
      </TouchableOpacity>

      {showText && (
        <Text style={[styles.logoText, { fontSize: size === 'xl' ? 24 : 18 }]}>
          TaskTuner
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    position: 'relative',
  },
  logoGradient: {
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 8,
  },
  floatingElement: {
    position: 'absolute',
    backgroundColor: 'rgba(15, 15, 35, 0.8)',
    borderRadius: 20,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  floatingElement1: {
    top: -20,
    left: -20,
  },
  floatingElement2: {
    top: -10,
    right: -25,
  },
  floatingElement3: {
    bottom: -15,
    left: -15,
  },
  floatingElement4: {
    bottom: -20,
    right: -20,
  },
});

export default InteractiveLogo3D;
