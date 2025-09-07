import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import LiveBackground from './src/components/LiveBackground';
import HamburgerMenu from './src/components/HamburgerMenu';
import RoastGenerator from './src/components/RoastGenerator';
import Footer from './src/components/Footer';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import { healthCheck, taskApi, aiApi, analyticsApi } from './src/services/api';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Clerk authentication
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Check backend connection on app start
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const isConnected = await healthCheck();
      setIsBackendConnected(isConnected);
      if (isConnected) {
        console.log('✅ Backend connected successfully');
      } else {
        console.log('⚠️ Backend not available, using offline mode');
      }
    } catch (error) {
      console.log('❌ Backend connection failed:', error);
      setIsBackendConnected(false);
    }
  };

  const scrollToSection = (section: string) => {
    console.log('Scrolling to section:', section);
    // Implement smooth scrolling to sections
    switch (section) {
      case 'features':
        scrollViewRef.current?.scrollTo({ y: height * 0.8, animated: true });
        break;
      case 'roast':
        scrollViewRef.current?.scrollTo({ y: height * 1.5, animated: true });
        break;
      case 'testimonials':
        scrollViewRef.current?.scrollTo({ y: height * 2.2, animated: true });
        break;
    }
  };

  const handleGetStarted = async () => {
    if (isSignedIn) {
      // User is already signed in, show dashboard or main app
      Alert.alert(
        'Welcome Back!',
        `Hello ${user?.firstName || 'there'}! Ready to continue your productivity journey?`,
        [
          { text: 'Continue', onPress: () => console.log('Navigate to dashboard') }
        ]
      );
    } else {
      // User is not signed in, show sign up
      setShowSignUp(true);
    }
  };

  const handleTryRoast = async () => {
    try {
      if (isBackendConnected) {
        // Try to generate a roast from backend
        const roast = await aiApi.generateRoast('procrastination', 'user');
        Alert.alert(
          'AI Roast Generated!',
          roast?.roast || 'Your procrastination is showing...',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Demo Roast',
          'Your to-do list is longer than a CVS receipt. Maybe it\'s time to actually DO something about it?',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error generating roast:', error);
      Alert.alert('Error', 'Failed to generate roast. Please try again.');
    }
  };

  const handleTryDemo = async () => {
    try {
      // Get demo tasks from backend if available
      if (isBackendConnected) {
        const tasks = await taskApi.getTasks();
        Alert.alert(
          'Demo Mode Activated!',
          `Found ${tasks.length} demo tasks. Ready to get productive?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Start Demo', onPress: () => console.log('Start demo mode') }
          ]
        );
      } else {
        Alert.alert(
          'Demo Mode',
          'Welcome to TaskTuner Demo! Experience our features without signing up.',
          [{ text: 'Start Demo', onPress: () => console.log('Start demo mode') }]
        );
      }
    } catch (error) {
      console.error('Error starting demo:', error);
      Alert.alert('Demo Mode', 'Welcome to TaskTuner Demo!');
    }
  };

  const handleSignIn = () => {
    setShowSignIn(true);
  };

  const handleSignUp = () => {
    setShowSignUp(true);
  };

  const handleSignInSuccess = () => {
    setShowSignIn(false);
    Alert.alert('Success', 'Welcome back to TaskTuner!');
  };

  const handleSignUpSuccess = () => {
    setShowSignUp(false);
    Alert.alert('Success', 'Welcome to TaskTuner! Your account has been created.');
  };

  const handleBackFromAuth = () => {
    setShowSignIn(false);
    setShowSignUp(false);
  };

  const handleNavigateToSignUp = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  const handleNavigateToSignIn = () => {
    setShowSignUp(false);
    setShowSignIn(true);
  };

  const features = [
    {
      icon: 'brain-outline',
      title: 'AI Roast Generator',
      description: 'Get brutally honest feedback on your procrastination habits'
    },
    {
      icon: 'calendar-outline',
      title: 'Smart Scheduling',
      description: 'Auto-sync with Google Calendar and optimize your time blocks'
    },
    {
      icon: 'target-outline',
      title: 'Goal Breakdown',
      description: 'Turn massive goals into bite-sized, achievable tasks'
    },
    {
      icon: 'time-outline',
      title: 'Focus Mode',
      description: 'Pomodoro timer with AI-powered break suggestions'
    },
    {
      icon: 'trophy-outline',
      title: 'Gamified Progress',
      description: 'Earn XP, build streaks, and compete with friends'
    }
  ];

  const testimonials = [
    {
      quote: "TaskTuner roasted me so hard I actually started doing my assignments 😭",
      author: "Priya, College Student",
      rating: 5,
    },
    {
      quote: "Finally, an app that doesn't sugarcoat my productivity issues",
      author: "Rohit, Developer",
      rating: 5,
    },
    {
      quote: "The AI coach is savage but it WORKS. 10/10 would get roasted again",
      author: "Arjun, Entrepreneur",
      rating: 5,
    },
  ];

  // Show authentication screens
  if (showSignIn) {
    return (
      <SignInScreen
        onSignInSuccess={handleSignInSuccess}
        onNavigateToSignUp={handleNavigateToSignUp}
        onBack={handleBackFromAuth}
      />
    );
  }

  if (showSignUp) {
    return (
      <SignUpScreen
        onSignUpSuccess={handleSignUpSuccess}
        onNavigateToSignIn={handleNavigateToSignIn}
        onBack={handleBackFromAuth}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Live Background */}
      <LiveBackground />
      
      {/* Hamburger Menu */}
      <View style={styles.headerContainer}>
        <HamburgerMenu
          onNavigate={scrollToSection}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onTryDemo={handleTryDemo}
        />
        {isBackendConnected && (
          <View style={styles.connectionIndicator}>
            <Ionicons name="wifi" size={16} color="#10B981" />
          </View>
        )}
        {isSignedIn && (
          <View style={styles.userIndicator}>
            <Ionicons name="person-circle" size={24} color="#8B5CF6" />
          </View>
        )}
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Animated.View
            style={[
              styles.heroContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Badge */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🔥 Where Procrastination Dies Screaming</Text>
            </View>
            
            {/* Main Heading */}
            <Text style={styles.mainTitle}>
              Welcome to{' '}
              <Text style={styles.highlightText}>TaskTuner!</Text>
            </Text>
            
            {/* Subtitle */}
            <Text style={styles.subtitle}>
              The savage AI productivity coach that schedules your tasks, syncs your calendar, and roasts your excuses into oblivion.
            </Text>

            {/* Hero Logo Display */}
            <View style={styles.heroLogoContainer}>
              <View style={styles.heroLogo}>
                <Ionicons name="checkmark-circle" size={80} color="#8B5CF6" />
              </View>
            </View>

            {/* CTA Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleGetStarted}>
                <Text style={styles.primaryButtonText}>Start Getting Roasted</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryButton} onPress={handleTryRoast}>
                <Text style={styles.secondaryButtonText}>Try Free Roast</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.demoButton} onPress={handleTryDemo}>
                <Text style={styles.demoButtonText}>Try Demo Mode</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>
            Features That Actually <Text style={styles.highlightText}>Work</Text>
          </Text>
          <Text style={styles.sectionSubtitle}>
            Stop lying to yourself about "tomorrow." Start today with tools that call out your BS.
          </Text>

          {features.map((feature, index) => (
            <Animated.View
              key={feature.title}
              style={[
                styles.featureCard,
                {
                  opacity: fadeAnim,
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  }],
                },
              ]}
            >
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon as any} size={32} color="#8B5CF6" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Roast Generator Section */}
        <View style={styles.roastSection}>
          <Text style={styles.sectionTitle}>
            Get Your <Text style={styles.highlightText}>Free Roast</Text>
          </Text>
          <Text style={styles.sectionSubtitle}>
            Experience TaskTuner's savage AI coach. No signup required - just pure, unfiltered motivation.
          </Text>
          
          <RoastGenerator />
        </View>

        {/* Testimonials Section */}
        <View style={styles.testimonialsSection}>
          <Text style={styles.sectionTitle}>
            What People Are <Text style={styles.highlightText}>Saying</Text>
          </Text>
          <Text style={styles.sectionSubtitle}>
            Real feedback from real procrastinators (just like you)
          </Text>

          {testimonials.map((testimonial, index) => (
            <View key={index} style={styles.testimonialCard}>
              <View style={styles.starsContainer}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Ionicons key={i} name="star" size={16} color="#F59E0B" />
                ))}
              </View>
              <Text style={styles.testimonialQuote}>"{testimonial.quote}"</Text>
              <Text style={styles.testimonialAuthor}>— {testimonial.author}</Text>
            </View>
          ))}
        </View>

        {/* Final CTA Section */}
        <View style={styles.finalCTASection}>
          <View style={styles.finalCTAContent}>
            <Text style={styles.finalCTATitle}>
              Ready to Stop Procrastinating and Start <Text style={styles.highlightText}>Achieving</Text>?
            </Text>
            <Text style={styles.finalCTASubtitle}>
              Join thousands of users who've transformed their productivity with TaskTuner's savage AI coaching.
            </Text>
            <TouchableOpacity style={styles.finalCTAButton} onPress={handleGetStarted}>
              <Text style={styles.finalCTAButtonText}>Start Your Transformation</Text>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
    </View>

        {/* Footer */}
        <Footer />
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', // Matching web app's dark theme
  },
  headerContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
  },
  connectionIndicator: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  userIndicator: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroSection: {
    minHeight: height * 0.8,
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 60,
  },
  heroContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  badge: {
    backgroundColor: '#8B5CF620',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#8B5CF640',
  },
  badgeText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  highlightText: {
    color: '#8B5CF6',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  heroLogoContainer: {
    marginVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#8B5CF620',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#8B5CF640',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
  },
  demoButton: {
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  demoButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresSection: {
    padding: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.3)', // Matching web app
  },
  roastSection: {
    padding: 20,
    backgroundColor: 'rgba(2, 6, 23, 0.5)', // Matching web app
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.4)', // Matching web app
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B5CF620',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  testimonialsSection: {
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  testimonialCard: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  testimonialQuote: {
    fontSize: 16,
    color: '#fff',
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 12,
  },
  testimonialAuthor: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  finalCTASection: {
    padding: 20,
    backgroundColor: '#0f0f23',
  },
  finalCTAContent: {
    backgroundColor: '#1a1a2e',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  finalCTATitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  finalCTASubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  finalCTAButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  finalCTAButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});