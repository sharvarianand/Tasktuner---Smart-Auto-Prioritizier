import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  Animated,
  Platform,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
  onPress?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  margin = 'none',
  style,
  onPress,
  ...touchableProps
}) => {
  const { theme, isDark } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
    };

    const variantStyles = {
      default: {
        backgroundColor: theme.colors.surface,
        borderWidth: 0,
      },
      elevated: {
        backgroundColor: theme.colors.surface,
        borderWidth: 0,
      },
      outlined: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: isDark ? '#374151' : '#e5e7eb',
      },
      glass: {
        backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.5)',
        borderWidth: isDark ? 1 : 0,
        borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.05)',
      },
    } as const;

    const paddingStyles = {
      none: { padding: 0 },
      small: { padding: 8 },
      medium: { padding: 16 },
      large: { padding: 24 },
    };

    const marginStyles = {
      none: { margin: 0 },
      small: { margin: 8 },
      medium: { margin: 16 },
      large: { margin: 24 },
    };

    const shadowStyles = Platform.OS === 'web' ? {} : {
      shadowColor: variant === 'glass' ? theme.colors.primary : (isDark ? '#000000' : '#000000'),
      shadowOpacity: variant === 'glass' ? 0.25 : (isDark ? 0.3 : 0.1),
      shadowRadius: variant === 'glass' ? 14 : (variant === 'elevated' ? 8 : 4),
      shadowOffset: { width: 0, height: variant === 'glass' ? 8 : 2 },
      elevation: variant === 'glass' ? 6 : (variant === 'elevated' ? 4 : 0),
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...paddingStyles[padding],
      ...marginStyles[margin],
      ...shadowStyles,
    };
  };

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: Platform.OS !== 'web', speed: 50, bounciness: 6 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: Platform.OS !== 'web', speed: 50, bounciness: 6 }).start();
  };

  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={[getCardStyle(), style]}
          onPress={onPress}
          activeOpacity={0.85}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          {...touchableProps}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <View style={[getCardStyle(), style]}>
        {children}
      </View>
    </Animated.View>
  );
};

export default Card;
