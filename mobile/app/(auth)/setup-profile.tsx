import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import colors from '../../src/theme/colors';
import { Ionicons } from '@expo/vector-icons';

// ── Types ───────────────────────────────────────
type FieldName = 'name' | 'email' | 'password' | 'confirmPassword';

interface Field {
  label: string;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  keyboardType?: any;
  secure?: boolean;
  hint?: string;
}

const FIELDS: Record<FieldName, Field> = {
  name: {
    label: 'Full Name',
    placeholder: 'John Doe',
    icon: 'person-outline',
    hint: 'As per your ID',
  },
  email: {
    label: 'Email Address',
    placeholder: 'john@example.com',
    icon: 'mail-outline',
    keyboardType: 'email-address',
    hint: 'For receipts & notifications',
  },
  password: {
    label: 'Password',
    placeholder: 'Min. 8 characters',
    icon: 'lock-closed-outline',
    secure: true,
  },
  confirmPassword: {
    label: 'Confirm Password',
    placeholder: 'Re-enter password',
    icon: 'shield-checkmark-outline',
    secure: true,
  },
};

// ── Component ───────────────────────────────────
export default function SetupProfile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Pre-filled from OTP flow (pass via params in real app)
  const prefilledPhone = '+91 98765 43210';

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState({ password: false, confirmPassword: false });
  const [focused, setFocused] = useState<FieldName | null>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const e: Partial<Record<FieldName, string>> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    if (form.password.length < 8) e.password = 'Min. 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    setIsLoading(true);
    // TODO: API call to register user
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(user)/(tabs)');
    }, 1500);
  };

  const isFormFilled = form.name && form.email && form.password && form.confirmPassword;

  const renderField = (key: FieldName) => {
    const field = FIELDS[key];
    const isSecure = field.secure;
    const showText = isSecure ? showPass[key as 'password' | 'confirmPassword'] : false;
    const error = errors[key];
    const isFoc = focused === key;

    return (
      <View key={key} style={styles.fieldWrapper}>
        <Text style={styles.fieldLabel}>{field.label}</Text>
        <View style={[
          styles.fieldRow,
          isFoc && styles.fieldRowFocused,
          error && styles.fieldRowError,
        ]}>
          <Ionicons
            name={field.icon}
            size={18}
            color={error ? colors.danger : isFoc ? colors.primary : colors.textLight}
            style={{ marginRight: 10 }}
          />
          <TextInput
            placeholder={field.placeholder}
            placeholderTextColor={colors.textLight}
            keyboardType={field.keyboardType ?? 'default'}
            secureTextEntry={isSecure && !showText}
            autoCapitalize={key === 'name' ? 'words' : 'none'}
            style={styles.fieldInput}
            value={form[key]}
            onChangeText={(val) => {
              setForm((f) => ({ ...f, [key]: val }));
              if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
            }}
            onFocus={() => setFocused(key)}
            onBlur={() => setFocused(null)}
          />
          {isSecure && (
            <TouchableOpacity
              onPress={() => setShowPass((s) => ({ ...s, [key]: !s[key as 'password' | 'confirmPassword'] }))}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showText ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={colors.textLight}
              />
            </TouchableOpacity>
          )}
        </View>
        {error && (
          <Text style={styles.errorText}>
            <Ionicons name="alert-circle-outline" size={11} /> {error}
          </Text>
        )}
        {!error && field.hint && (
          <Text style={styles.hintText}>{field.hint}</Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Top accent dots */}
        <View style={styles.topStrip}>
          <View style={styles.stripDot} />
          <View style={[styles.stripDot, { width: 28, backgroundColor: colors.primaryLight, opacity: 0.5 }]} />
          <View style={[styles.stripDot, { opacity: 0.15 }]} />
        </View>

        {/* Icon */}
        <View style={styles.iconRow}>
          <View style={styles.iconBox}>
            <Text style={styles.iconEmoji}>✏️</Text>
          </View>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>STEP 2/2</Text>
          </View>
        </View>

        {/* Header */}
        <Text style={styles.title}>Complete{'\n'}Your Profile</Text>
        <Text style={styles.subtitle}>
          Just a few details and you're all set to start booking rides.
        </Text>

        {/* Form Card */}
        <View style={styles.formCard}>

          {/* Phone — pre-filled, locked */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            <View style={[styles.fieldRow, styles.fieldRowLocked]}>
              <Ionicons name="call-outline" size={18} color={colors.success} style={{ marginRight: 10 }} />
              <Text style={styles.lockedValue}>{prefilledPhone}</Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.sectionDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>Personal Info</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Dynamic fields */}
          {(Object.keys(FIELDS) as FieldName[]).map(renderField)}

        </View>

        {/* Password strength hint */}
        {form.password.length > 0 && (
          <View style={styles.strengthRow}>
            {[1, 2, 3, 4].map((i) => (
              <View
                key={i}
                style={[
                  styles.strengthBar,
                  {
                    backgroundColor:
                      form.password.length >= i * 3
                        ? i <= 1 ? colors.danger
                          : i <= 2 ? colors.warning
                          : i <= 3 ? colors.primaryLight
                          : colors.success
                        : colors.border,
                  },
                ]}
              />
            ))}
            <Text style={styles.strengthLabel}>
              {form.password.length < 4 ? 'Weak' : form.password.length < 7 ? 'Fair' : form.password.length < 10 ? 'Good' : 'Strong'}
            </Text>
          </View>
        )}

        {/* Create Account Button */}
        <TouchableOpacity
          style={[
            styles.createBtn,
            isFormFilled ? styles.createBtnOn : styles.createBtnOff,
          ]}
          onPress={handleCreate}
          activeOpacity={0.85}
          disabled={isLoading || !isFormFilled}
        >
          {isLoading ? (
            <Text style={styles.createBtnText}>Creating Account...</Text>
          ) : (
            <>
              <Ionicons
                name="person-add-outline"
                size={18}
                color={isFormFilled ? colors.textInverse : colors.textLight}
                style={{ marginRight: 8 }}
              />
              <Text style={[styles.createBtnText, !isFormFilled && { color: colors.textLight }]}>
                Create Account
              </Text>
              {isFormFilled && (
                <View style={styles.arrowPill}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              )}
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          By creating an account you agree to our{' '}
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Terms</Text>
          {' '}&{' '}
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Privacy Policy</Text>
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: colors.background },
  container: {
    paddingHorizontal: 24,
  },

  // ── Top strip ──────────────────────────────
  topStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingTop: 20,
    marginBottom: 36,
  },
  stripDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    opacity: 0.3,
  },

  // ── Icon ───────────────────────────────────
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
  stepBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.borderFocus,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1.5,
  },

  // ── Header ─────────────────────────────────
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.8,
    lineHeight: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 28,
    maxWidth: '90%',
  },

  // ── Form Card ──────────────────────────────
  formCard: {
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
    marginBottom: 16,
    gap: 4,
  },

  // ── Field ──────────────────────────────────
  fieldWrapper: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: colors.textLight,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surfaceAlt,
    height: 54,
    paddingHorizontal: 14,
  },
  fieldRowFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  fieldRowError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  fieldRowLocked: {
    borderColor: colors.successLight,
    backgroundColor: colors.successSoft,
  },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  eyeBtn: {
    padding: 4,
  },
  lockedValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.successSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.successLight,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  errorText: {
    fontSize: 11,
    color: colors.danger,
    marginTop: 5,
    marginLeft: 2,
  },
  hintText: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 5,
    marginLeft: 2,
  },

  // ── Divider ────────────────────────────────
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // ── Password strength ──────────────────────
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    minWidth: 40,
    textAlign: 'right',
  },

  // ── Button ─────────────────────────────────
  createBtn: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    gap: 6,
  },
  createBtnOn: {
    backgroundColor: colors.primary,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
  },
  createBtnOff: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  createBtnText: {
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

  // ── Footer ─────────────────────────────────
  footerNote: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 17,
  },
});