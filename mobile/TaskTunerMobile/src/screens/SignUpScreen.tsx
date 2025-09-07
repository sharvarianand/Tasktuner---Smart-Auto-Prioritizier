import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSignUp } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';

interface SignUpScreenProps {
  onSignUpSuccess: () => void;
  onNavigateToSignIn: () => void;
  onBack: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onSignUpSuccess,
  onNavigateToSignIn,
  onBack,
}) => {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const handleSignUp = async () => {
    if (!isLoaded) return;

    if (!emailAddress || !password || !firstName || !lastName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (error: any) {
      console.error('Sign up error:', error);
      Alert.alert('Error', error.errors?.[0]?.message || 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!isLoaded) return;

    if (!code) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setIsLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        Alert.alert('Success', 'Welcome to TaskTuner! Your account has been created.');
        onSignUpSuccess();
      } else {
        Alert.alert('Error', 'Verification failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      Alert.alert('Error', error.errors?.[0]?.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <LinearGradient
        colors={['rgba(15, 23, 42, 0.95)', 'rgba(2, 6, 23, 0.98)']}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#8B5CF6" />
              </TouchableOpacity>
              <Text style={styles.title}>Verify Email</Text>
              <Text style={styles.subtitle}>
                We've sent a verification code to {emailAddress}
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#8B5CF6" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Verification code"
                  placeholderTextColor="#6B7280"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              <TouchableOpacity
                style={[styles.verifyButton, isLoading && styles.disabledButton]}
                onPress={handleVerifyEmail}
                disabled={isLoading}
              >
                <Text style={styles.verifyButtonText}>
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                </Text>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendButton}
                onPress={() => {
                  setPendingVerification(false);
                  setCode('');
                }}
              >
                <Text style={styles.resendText}>Resend Code</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['rgba(15, 23, 42, 0.95)', 'rgba(2, 6, 23, 0.98)']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#8B5CF6" />
            </TouchableOpacity>
            <Text style={styles.title}>Join TaskTuner</Text>
            <Text style={styles.subtitle}>Start your productivity transformation today</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.nameRow}>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Ionicons name="person-outline" size={20} color="#8B5CF6" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="First name"
                  placeholderTextColor="#6B7280"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </View>

              <View style={[styles.inputContainer, styles.halfInput]}>
                <Ionicons name="person-outline" size={20} color="#8B5CF6" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Last name"
                  placeholderTextColor="#6B7280"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#8B5CF6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#6B7280"
                value={emailAddress}
                onChangeText={setEmailAddress}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#8B5CF6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password (min 8 characters)"
                placeholderTextColor="#6B7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.signUpButton, isLoading && styles.disabledButton]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={styles.signUpButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={onNavigateToSignIn}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  halfInput: {
    width: '48%',
    marginBottom: 0,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 16,
  },
  verifyButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  termsText: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  resendButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resendText: {
    color: '#8B5CF6',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginRight: 4,
  },
  signInLink: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SignUpScreen;
