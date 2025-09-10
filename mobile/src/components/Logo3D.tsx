import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Zap, CheckCircle, Target, Brain, Trophy } from 'lucide-react-native';
import { Animated } from 'react-native';

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
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
            borderWidth: 2,
            borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
            boxShadow: isDark ? '0 4px 8px rgba(59, 130, 246, 0.3)' : '0 4px 8px rgba(37, 99, 235, 0.3)',
            elevation: 8,
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
  });

  const LogoContent = () => (
    <View style={styles.container}>
      <Zap size={sizeStyles.icon} color={styles.icon.color} />
      {showText && (
        <Text style={styles.text}>TaskTuner</Text>
      )}
      
      {/* Floating action icons for hero variant */}
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
  );

  if (animated) {
    return (
      <Animated.View
        style={{
          transform: [{ scale: 1 }],
          opacity: 1,
        }}
      >
        <LogoContent />
      </Animated.View>
    );
  }

  return <LogoContent />;
};

export default Logo3D;
