import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
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

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
    };

    // Variant styles
    const variantStyles = {
      default: {
        backgroundColor: theme.colors.surface,
        borderWidth: 0,
      },
      elevated: {
        backgroundColor: theme.colors.surface,
        shadowColor: isDark ? '#000000' : '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 0,
      },
      outlined: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: isDark ? '#374151' : '#e5e7eb',
      },
    };

    // Padding styles
    const paddingStyles = {
      none: { padding: 0 },
      small: { padding: 8 },
      medium: { padding: 16 },
      large: { padding: 24 },
    };

    // Margin styles
    const marginStyles = {
      none: { margin: 0 },
      small: { margin: 8 },
      medium: { margin: 16 },
      large: { margin: 24 },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...paddingStyles[padding],
      ...marginStyles[margin],
    };
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        activeOpacity={0.7}
        {...touchableProps}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
};

export default Card;
