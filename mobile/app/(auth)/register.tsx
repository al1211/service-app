import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import colors from '../../src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { requestOtp } from '@/src/api/authApi';

export default function Register() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isValid = phone.replace(/\D/g, '').length >= 10;

  const handleSendOtp = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    try {

    const data =   await requestOtp({ phone });
      router.push('/(auth)/otp');
      console.log(data);

    } catch (error) {
      Alert.alert(`Error ${error} "Failed to send OTP. Please try again`)
    } finally {
      setLoading(false);
    }
    // TODO: API call to send OTP
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>

        {/* Top accent dots */}
        <View style={styles.topStrip}>
          <View style={styles.stripDot} />
          <View style={[styles.stripDot, { width: 28, backgroundColor: colors.primaryLight, opacity: 0.5 }]} />
          <View style={[styles.stripDot, { opacity: 0.15 }]} />
        </View>

        {/* Icon */}
        <View style={styles.iconRow}>
          <View style={styles.iconBox}>
            <Text style={styles.iconEmoji}>👋</Text>
          </View>
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        </View>

        {/* Header */}
        <Text style={styles.title}>Create{'\n'}Account</Text>
        <Text style={styles.subtitle}>
          Enter your phone number to get started. We'll send you a verification code.
        </Text>

        {/* Phone Input Card */}
        <View style={styles.inputCard}>
          <Text style={styles.inputCardLabel}>Mobile Number</Text>

          {/* Country code + input row */}
          <View style={[styles.phoneRow, isFocused && styles.phoneRowFocused]}>
            <View style={styles.countryCode}>
              <Text style={styles.flagText}>🇮🇳</Text>
              <Text style={styles.dialCode}>+91</Text>
              <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
            </View>
            <View style={styles.divider} />
            <TextInput
              placeholder="98765 43210"
              placeholderTextColor={colors.textLight}
              keyboardType="phone-pad"
              style={styles.phoneInput}
              value={phone}
              onChangeText={setPhone}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={10}
            />
            {phone.length > 0 && (
              <TouchableOpacity onPress={() => setPhone('')} style={styles.clearBtn}>
                <Ionicons name="close-circle" size={18} color={colors.textLight} />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.inputHint}>
            <Ionicons name="lock-closed-outline" size={11} color={colors.textLight} />
            {'  '}Your number is never shared publicly
          </Text>
        </View>

        <View style={{ flex: 1 }} />

        {/* Already have account */}
        <View style={styles.loginRow}>
          <Text style={styles.loginLabel}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(user)/(tabs)')} activeOpacity={0.7}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={[styles.sendBtn, isValid ? styles.sendBtnOn : styles.sendBtnOff]}
          onPress={handleSendOtp}
          activeOpacity={0.85}
          disabled={loading}
        >
          { !loading ? (<Ionicons
            name="send-outline"
            size={18}
            color={!loading ? colors.textInverse : colors.textLight}
            style={{ marginRight: 8 }}
          />) : null}
          <Text style={[styles.sendBtnText, loading && { color: colors.textLight }]}>
           {!loading ? "Send OTP":<ActivityIndicator size={'large'} color="white"/>}
          </Text>
         
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          By continuing you agree to our Terms of Service & Privacy Policy
        </Text>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  topStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingTop: 20,
    marginBottom: 40,
  },
  stripDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    opacity: 0.3,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    marginBottom: 24,
  },
  iconBox: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  iconEmoji: { fontSize: 30 },
  newBadge: {
    backgroundColor: colors.successSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.successLight,
  },
  newBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.success,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.8,
    lineHeight: 42,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 32,
    maxWidth: '90%',
  },

  // ── Input Card ──────────────────────────────
  inputCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  inputCardLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: colors.textLight,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surfaceAlt,
    height: 56,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  phoneRowFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: 10,
  },
  flagText: { fontSize: 18 },
  dialCode: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  clearBtn: {
    padding: 4,
  },
  inputHint: {
    fontSize: 11,
    color: colors.textLight,
    lineHeight: 16,
  },

  // ── Login row ───────────────────────────────
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  loginLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    textDecorationLine: 'underline',
  },

  // ── Button ──────────────────────────────────
  sendBtn: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    gap: 6,
  },
  sendBtnOn: {
    backgroundColor: colors.primary,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
  },
  sendBtnOff: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  sendBtnText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  arrowPill: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  arrowText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  footerNote: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 17,
  },
});