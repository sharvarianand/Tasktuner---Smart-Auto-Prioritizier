import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { pingBackend } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import Button from './ui/Button';
import { CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CTASectionProps {
  onGetStarted?: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  const { theme, isDark } = useTheme();
  const [backendOk, setBackendOk] = useState<boolean | null>(null);
  const [backendMsg, setBackendMsg] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await pingBackend(2500);
      if (!mounted) return;
      setBackendOk(res.ok);
      setBackendMsg(res.message);
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <View style={[styles.container, { 
      backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)' 
    }]}>
      {backendOk !== null && (
        <View style={{
          alignSelf: 'center',
          marginBottom: 12,
          paddingVertical: 6,
          paddingHorizontal: 10,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: backendOk ? '#16A34A' : '#DC2626',
          backgroundColor: backendOk ? '#DCFCE7' : '#FEE2E2',
        }}>
          <Text style={{ color: backendOk ? '#166534' : '#991B1B', fontWeight: '600' }}>
            {backendOk ? 'Backend Connected' : 'Backend Unreachable'}{backendMsg ? ` · ${backendMsg}` : ''}
          </Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            How Did That Roast Feel?
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            If you're ready to turn that brutal honesty into real productivity, join thousands who finally got their act together.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Start Your Transformation"
            onPress={onGetStarted}
            variant="primary"
            size="large"
            icon={CheckCircle}
            style={styles.ctaButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            Join 10,000+ users who stopped making excuses and started making progress
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  content: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  ctaButton: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CTASection;

