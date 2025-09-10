import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
  Animated,
  Easing,
  Platform,
  Vibration,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode | React.ComponentType<{ size?: number; color?: string }>;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: Platform.OS !== 'web', speed: 50, bounciness: 6 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: Platform.OS !== 'web', speed: 50, bounciness: 6 }).start();
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Vibration.vibrate(10);
    }
    onPress();
  };

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: Platform.OS !== 'web',
      })
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
      borderWidth: 1,
      overflow: 'hidden',
    };

    const sizeStyles = {
      small: { paddingHorizontal: 12, paddingVertical: 8, minHeight: 36 },
      medium: { paddingHorizontal: 16, paddingVertical: 12, minHeight: 44 },
      large: { paddingHorizontal: 20, paddingVertical: 16, minHeight: 52 },
    };

    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
        borderColor: theme.colors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled ? 0.5 : 1,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '700',
      textAlign: 'center',
      letterSpacing: 0.3,
    };

    const sizeStyles = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    const variantStyles = {
      primary: { color: '#ffffff' },
      secondary: { color: '#ffffff' },
      outline: { color: theme.colors.primary },
      ghost: { color: theme.colors.primary },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const renderIcon = () => {
    const iconColor = variant === 'outline' || variant === 'ghost' ? theme.colors.primary : '#ffffff';
    const iconSize = size === 'small' ? 14 : size === 'large' ? 20 : 16;

    if (!icon) return null;
    if (React.isValidElement(icon)) {
      return <View style={{ marginRight: 8 }}>{icon}</View>;
    }
    if (typeof icon === 'function') {
      const IconComponent = icon as React.ComponentType<{ size?: number; color?: string }>;
      return (
        <View style={{ marginRight: 8 }}>
          {React.createElement(IconComponent, { size: iconSize, color: iconColor })}
        </View>
      );
    }
    return null;
  };

  const shimmerTranslate = shimmer.interpolate({ inputRange: [0, 1], outputRange: [-100, 200] });
  const textColor = (variant === 'outline' || variant === 'ghost') ? theme.colors.primary : '#ffffff';

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[getButtonStyle(), style]}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : '#ffffff'}
          />
        ) : (
          <>
            {renderIcon()}
            <Text style={[getTextStyle(), textStyle]}>{title}</Text>
            {(variant === 'primary' || variant === 'secondary') && (
              <Animated.View
                style={{
                  pointerEvents: 'none',
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: 80,
                  transform: [{ translateX: shimmerTranslate }],
                  backgroundColor: textColor,
                  opacity: 0.08,
                }}
              />
            )}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Button;
