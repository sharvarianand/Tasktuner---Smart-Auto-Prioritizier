import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Footer = () => {
  const handleSocialPress = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.footerContent}>
          {/* Logo and Brand */}
          <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#8B5CF6" />
              <View style={styles.brandText}>
                <Text style={styles.brandTitle}>TaskTuner</Text>
                <Text style={styles.brandSubtitle}>Savage Productivity</Text>
              </View>
            </View>
          </View>

          {/* Social Links */}
          <View style={styles.socialSection}>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialPress('https://github.com/tasktuner')}
            >
              <Ionicons name="logo-github" size={20} color="#6B7280" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialPress('https://twitter.com/TaskTunerApp')}
            >
              <Ionicons name="logo-twitter" size={20} color="#6B7280" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialPress('https://instagram.com/tasktuner')}
            >
              <Ionicons name="logo-instagram" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Copyright */}
        <View style={styles.copyrightSection}>
          <Text style={styles.copyrightText}>
            © 2024 TaskTuner. Made with ❤️ and a lot of sass.
          </Text>
          <Text style={styles.copyrightSubtext}>
            Let's tune tasks and turn heads — one roast at a time.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#16213e',
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandSection: {
    flex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    marginLeft: 12,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  socialSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
  },
  copyrightSection: {
    alignItems: 'center',
  },
  copyrightText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 4,
  },
  copyrightSubtext: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default Footer;