import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}) => {
  const { theme, isDark } = useTheme();

  const getBadgeStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 4,
      alignSelf: 'flex-start',
      borderWidth: 1,
    };

    const sizeStyles = {
      sm: { paddingHorizontal: 6, paddingVertical: 2 },
      md: { paddingHorizontal: 8, paddingVertical: 4 },
      lg: { paddingHorizontal: 12, paddingVertical: 6 },
    };

    const variantStyles = {
      default: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.primary,
      },
      secondary: {
        backgroundColor: theme.colors.surface,
        borderColor: isDark ? '#374151' : '#e5e7eb',
      },
      destructive: {
        backgroundColor: theme.colors.error,
        borderColor: theme.colors.error,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '500',
      textAlign: 'center',
    };

    const sizeStyles = {
      sm: { fontSize: 12 },
      md: { fontSize: 14 },
      lg: { fontSize: 16 },
    };

    const variantStyles = {
      default: { color: '#ffffff' },
      outline: { color: theme.colors.primary },
      secondary: { color: theme.colors.text },
      destructive: { color: '#ffffff' },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  return (
    <View style={[getBadgeStyle(), style]}>
      <Text style={[getTextStyle(), textStyle]}>{children}</Text>
    </View>
  );
};

export default Badge;

