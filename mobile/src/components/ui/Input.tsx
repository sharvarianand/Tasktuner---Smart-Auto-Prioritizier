import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  helperStyle?: TextStyle;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  ...textInputProps
}) => {
  const { theme, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = (): ViewStyle => ({
    marginBottom: 16,
  });

  const getLabelStyle = (): TextStyle => ({
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 8,
  });

  const getInputContainerStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: error 
      ? theme.colors.error 
      : isFocused 
        ? theme.colors.primary 
        : isDark ? '#374151' : '#e5e7eb',
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    minHeight: 44,
  });

  const getInputStyle = (): TextStyle => ({
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    paddingVertical: 12,
  });

  const getErrorStyle = (): TextStyle => ({
    fontSize: 12,
    color: theme.colors.error,
    marginTop: 4,
  });

  const getHelperStyle = (): TextStyle => ({
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  });

  return (
    <View style={[getContainerStyle(), containerStyle]}>
      {label && (
        <Text style={[getLabelStyle(), labelStyle]}>{label}</Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View style={{ marginRight: 8 }}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[getInputStyle(), inputStyle]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={theme.colors.textSecondary}
          {...textInputProps}
        />
        
        {rightIcon && (
          <View style={{ marginLeft: 8 }}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && (
        <Text style={[getErrorStyle(), errorStyle]}>{error}</Text>
      )}
      
      {helperText && !error && (
        <Text style={[getHelperStyle(), helperStyle]}>{helperText}</Text>
      )}
    </View>
  );
};

export default Input;
