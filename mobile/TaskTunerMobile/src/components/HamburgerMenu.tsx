import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface HamburgerMenuProps {
  onNavigate: (screen: string) => void;
  onSignIn: () => void;
  onSignUp: () => void;
  onTryDemo: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  onNavigate,
  onSignIn,
  onSignUp,
  onTryDemo,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-width));

  const toggleMenu = () => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleNavigation = (screen: string) => {
    toggleMenu();
    onNavigate(screen);
  };

  const menuItems = [
    { id: 'features', label: 'Features', icon: 'star-outline' },
    { id: 'roast', label: 'Get Roasted', icon: 'flame-outline' },
    { id: 'testimonials', label: 'Testimonials', icon: 'chatbubbles-outline' },
    { id: 'demo', label: 'Try Demo', icon: 'play-circle-outline' },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <TouchableOpacity style={styles.hamburgerButton} onPress={toggleMenu}>
        <View style={[styles.hamburgerLine, isOpen && styles.hamburgerLineOpen]} />
        <View style={[styles.hamburgerLine, isOpen && styles.hamburgerLineOpen]} />
        <View style={[styles.hamburgerLine, isOpen && styles.hamburgerLineOpen]} />
      </TouchableOpacity>

      {/* Menu Overlay */}
      {isOpen && (
        <Modal
          transparent
          visible={isOpen}
          animationType="none"
          onRequestClose={toggleMenu}
        >
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={toggleMenu}
          >
            <Animated.View
              style={[
                styles.menuContainer,
                {
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(15, 23, 42, 0.95)', 'rgba(2, 6, 23, 0.98)']}
                style={styles.menuGradient}
              >
                {/* Menu Header */}
                <View style={styles.menuHeader}>
                  <Text style={styles.menuTitle}>TaskTuner</Text>
                  <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                {/* Menu Items */}
                <View style={styles.menuItems}>
                  {menuItems.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.menuItem}
                      onPress={() => handleNavigation(item.id)}
                    >
                      <Ionicons name={item.icon as any} size={24} color="#8B5CF6" />
                      <Text style={styles.menuItemText}>{item.label}</Text>
                      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Auth Buttons */}
                <View style={styles.authSection}>
                  <TouchableOpacity
                    style={styles.authButton}
                    onPress={() => {
                      toggleMenu();
                      onSignIn();
                    }}
                  >
                    <Text style={styles.authButtonText}>Sign In</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.authButton, styles.signUpButton]}
                    onPress={() => {
                      toggleMenu();
                      onSignUp();
                    }}
                  >
                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.demoButton}
                    onPress={() => {
                      toggleMenu();
                      onTryDemo();
                    }}
                  >
                    <Ionicons name="play-circle" size={20} color="#8B5CF6" />
                    <Text style={styles.demoButtonText}>Try Demo</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  hamburgerButton: {
    width: 30,
    height: 30,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  hamburgerLine: {
    height: 3,
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
    width: '100%',
  },
  hamburgerLineOpen: {
    backgroundColor: '#fff',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: width * 0.8,
    height: height,
  },
  menuGradient: {
    flex: 1,
    paddingTop: 60,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.2)',
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  closeButton: {
    padding: 8,
  },
  menuItems: {
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.1)',
  },
  menuItemText: {
    flex: 1,
    fontSize: 18,
    color: '#fff',
    marginLeft: 16,
  },
  authSection: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  authButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  authButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: '#8B5CF6',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  demoButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default HamburgerMenu;
