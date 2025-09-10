import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const ForgotPasswordScreen: React.FC = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const navigation = useNavigation();
  const [emailAddress, setEmailAddress] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onPressReset = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      });

      setPendingVerification(true);
    } catch (err: any) {
      Alert.alert('Error', err.errors?.[0]?.message || 'Failed to send reset code');
    } finally {
      setIsLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
      } else {
        Alert.alert('Error', 'Password reset failed');
      }
    } catch (err: any) {
      Alert.alert('Error', err.errors?.[0]?.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter the verification code sent to {emailAddress}
        </Text>
        
        <Input
          placeholder="Verification code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          style={styles.input}
        />
        
        <Input
          placeholder="New password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        
        <Input
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
        
        <Button
          title="Reset Password"
          onPress={onPressVerify}
          loading={isLoading}
          style={styles.button}
        />
        
        <Button
          title="Back to Sign In"
          onPress={() => navigation.goBack()}
          variant="outline"
          style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we'll send you a reset code
      </Text>
      
      <Input
        placeholder="Email"
        value={emailAddress}
        onChangeText={setEmailAddress}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      
      <Button
        title="Send Reset Code"
        onPress={onPressReset}
        loading={isLoading}
        style={styles.button}
      />
      
      <Button
        title="Back to Sign In"
        onPress={() => navigation.goBack()}
        variant="outline"
        style={styles.backButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#6b7280',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
  backButton: {
    marginTop: 8,
  },
});

export default ForgotPasswordScreen;
