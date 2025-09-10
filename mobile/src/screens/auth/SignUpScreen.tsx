import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const SignUpScreen: React.FC = () => {
  const { signUp, setActive, isLoaded } = useSignUp();
  const navigation = useNavigation();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      Alert.alert('Error', err.errors?.[0]?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
      } else {
        Alert.alert('Error', 'Verification failed');
      }
    } catch (err: any) {
      Alert.alert('Error', err.errors?.[0]?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.subtitle}>
          We sent a verification code to {emailAddress}
        </Text>
        
        <Input
          placeholder="Enter verification code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          style={styles.input}
        />
        
        <Button
          title="Verify Email"
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
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started with TaskTuner</Text>
      
      <Input
        placeholder="Email"
        value={emailAddress}
        onChangeText={setEmailAddress}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      
      <Button
        title="Sign Up"
        onPress={onSignUpPress}
        loading={isLoading}
        style={styles.button}
      />
      
      <Button
        title="Already have an account? Sign In"
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

export default SignUpScreen;
