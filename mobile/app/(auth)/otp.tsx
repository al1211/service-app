import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import colors from '../../src/theme/colors';

export default function OtpScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (/^\d$/.test(value) || value === '') {
      setHasError(false);
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== '' && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 4) {
      setHasError(true);
      return;
    }
    setIsVerifying(true);
    // TODO: call verify OTP API
    setTimeout(() => {
      setIsVerifying(false);
      router.push('/(auth)/setup-profile');
    }, 1500);
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    setHasError(false);
    setOtp(['', '', '', '']);
    inputRefs.current[0]?.focus();
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) { clearInterval(interval); setCanResend(true); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const isComplete = otp.every((d) => d !== '');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>

        {/* Top accent strip */}
        <View style={styles.topStrip}>
          <View style={styles.stripDot} />
          <View style={[styles.stripDot, { width: 28, backgroundColor: colors.primaryLight, opacity: 0.5 }]} />
          <View style={[styles.stripDot, { opacity: 0.15 }]} />
        </View>

        {/* Icon + Badge */}
        <View style={styles.iconRow}>
          <View style={styles.iconBox}>
            <Text style={styles.iconEmoji}>🔐</Text>
          </View>
          <View style={styles.smsBadge}>
            <Text style={styles.smsBadgeText}>SMS</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Verify Your{'\n'}Phone Number</Text>
        <Text style={styles.subtitle}>
          Enter the 4-digit code sent to your registered mobile number
        </Text>

        {/* OTP Card */}
        <View style={[styles.otpCard, hasError && styles.otpCardError]}>

          <Text style={[styles.otpCardLabel, hasError && { color: colors.danger }]}>
            {hasError ? '⚠  Please fill all 4 digits' : 'One-Time Password'}
          </Text>

          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                value={digit}
                onChangeText={(val) => handleChange(index, val)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                keyboardType="number-pad"
                maxLength={1}
                style={[
                  styles.otpInput,
                  digit !== '' && styles.otpInputFilled,
                  hasError && styles.otpInputError,
                ]}
                selectionColor={colors.primary}
              />
            ))}
          </View>

          {/* Timer */}
          <View style={styles.timerRow}>
            <View style={[
              styles.timerDot,
              { backgroundColor: canResend ? colors.textLight : colors.success }
            ]} />
            <Text style={styles.timerText}>
              {canResend ? 'Code has expired' : `Expires in 0:${String(timer).padStart(2, '0')}`}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        {/* Resend */}
        <View style={styles.resendRow}>
          <Text style={styles.resendLabel}>Didn't receive it? </Text>
          <TouchableOpacity onPress={handleResend} disabled={!canResend} activeOpacity={0.7}>
            <Text style={[styles.resendLink, !canResend && styles.resendLinkOff]}>
              Resend Code
            </Text>
          </TouchableOpacity>
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyBtn,
            isComplete ? styles.verifyBtnOn : styles.verifyBtnOff,
          ]}
          onPress={handleVerify}
          activeOpacity={0.85}
          disabled={isVerifying || !isComplete}
        >
          <Text style={[styles.verifyText, !isComplete && { color: colors.textLight }]}>
            {isVerifying ? 'Verifying...' : 'Verify & Continue'}
          </Text>
          {isComplete && !isVerifying && (
            <View style={styles.arrowPill}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          By continuing you agree to our Terms & Privacy Policy
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

  // ─── Top strip ───────────────────────────────
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

  // ─── Icon ────────────────────────────────────
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
  iconEmoji: {
    fontSize: 30,
  },
  smsBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.borderFocus,
  },
  smsBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1.5,
  },

  // ─── Header ──────────────────────────────────
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
    lineHeight: 38,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 28,
    maxWidth: '88%',
  },

  // ─── OTP Card ────────────────────────────────
  otpCard: {
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
  otpCardError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  otpCardLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: colors.textLight,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  otpInput: {
    flex: 1,
    height: 60,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    backgroundColor: colors.surfaceAlt,
  },
  otpInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
    color: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  otpInputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
    color: colors.danger,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  timerDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  timerText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // ─── Resend ───────────────────────────────────
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  resendLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  resendLinkOff: {
    color: colors.textDisabled,
    textDecorationLine: 'none',
  },

  // ─── Button ──────────────────────────────────
  verifyBtn: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    gap: 10,
  },
  verifyBtnOn: {
    backgroundColor: colors.primary,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
  },
  verifyBtnOff: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  verifyText: {
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
  },
  arrowText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  // ─── Footer ──────────────────────────────────
  footerNote: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 17,
  },
});