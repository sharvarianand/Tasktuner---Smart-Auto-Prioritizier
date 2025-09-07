import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NavigationBarProps {
  onScrollToSection?: (section: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onScrollToSection }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="checkmark-circle" size={24} color="#8B5CF6" />
          </View>
          <Text style={styles.logoText}>TaskTuner</Text>
        </View>

        {/* Navigation Links */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.navLinks}
          contentContainerStyle={styles.navLinksContent}
        >
          <TouchableOpacity 
            style={styles.navLink}
            onPress={() => onScrollToSection?.('features')}
          >
            <Text style={styles.navLinkText}>Features</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navLink}
            onPress={() => onScrollToSection?.('roast')}
          >
            <Text style={styles.navLinkText}>Get Roasted</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navLink}
            onPress={() => onScrollToSection?.('testimonials')}
          >
            <Text style={styles.navLinkText}>Testimonials</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navLink, styles.authButton]}
            onPress={() => console.log('Auth clicked')}
          >
            <Text style={styles.authButtonText}>Sign In</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: 'rgba(15, 15, 35, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.2)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B5CF620',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  navLinks: {
    flex: 1,
    marginLeft: 20,
  },
  navLinksContent: {
    alignItems: 'center',
  },
  navLink: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  navLinkText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  authButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NavigationBar;