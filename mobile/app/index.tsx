import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../src/theme/colors";

const FEATURES = [
  { icon: "flash-outline", label: "Instant Booking" },
  { icon: "shield-checkmark-outline", label: "Verified Pros" },
  { icon: "location-outline", label: "Live Tracking" },
];

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 16 }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* ── Top accent strip ── */}
      <View style={styles.topStrip}>
        <View style={styles.stripDot} />
        <View style={[styles.stripDot, { width: 28, backgroundColor: colors.primaryLight, opacity: 0.5 }]} />
        <View style={[styles.stripDot, { opacity: 0.15 }]} />
      </View>

      {/* ── Logo ── */}
      <View style={styles.logoRow}>
        <View style={styles.logoIconBox}>
          <Ionicons name="flash" size={22} color={colors.primary} />
        </View>
        <Text style={styles.logoText}>QuickServe</Text>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>BETA</Text>
        </View>
      </View>

      {/* ── Hero ── */}
      <View style={styles.heroSection}>

        {/* Big icon card */}
        <View style={styles.heroCard}>
          {/* Decorative rings */}
          <View style={styles.ring1} />
          <View style={styles.ring2} />

          <View style={styles.heroIconWrap}>
            <Ionicons name="bicycle-outline" size={80} color={colors.primary} />
          </View>

          {/* Floating status pill */}
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>12 providers nearby</Text>
          </View>

          {/* Floating time badge */}
          <View style={styles.timeBadge}>
            <Ionicons name="time-outline" size={12} color={colors.warning} />
            <Text style={styles.timeBadgeText}>~8 min</Text>
          </View>
        </View>

        {/* Feature chips */}
        <View style={styles.chipsRow}>
          {FEATURES.map((f) => (
            <View key={f.label} style={styles.chip}>
              <Ionicons name={f.icon as any} size={14} color={colors.primary} />
              <Text style={styles.chipText}>{f.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Copy ── */}
      <View style={styles.copySection}>
        <Text style={styles.title}>
          Services at Your{"\n"}
          <Text style={styles.titleAccent}>Fingertips</Text>
        </Text>
        <Text style={styles.subtitle}>
          Book professional services and get deliveries instantly. Quick, reliable, and secure.
        </Text>
      </View>

      {/* ── Actions ── */}
      <View style={styles.actions}>

        {/* Primary CTA */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/(auth)/register")}
          activeOpacity={0.87}
        >
          <Text style={styles.primaryBtnText}>Get Started</Text>
          <View style={styles.arrowPill}>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Secondary CTA */}
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push("/(driver)/(tabs)")}
          activeOpacity={0.8}
        >
          <Ionicons name="briefcase-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <Text style={styles.secondaryBtnText}>Earn as a Provider</Text>
        </TouchableOpacity>

        {/* Login link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginLabel}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")} activeOpacity={0.7}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },

  // ── Top strip ────────────────────────────────
  topStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingTop: 16,
    marginBottom: 20,
  },
  stripDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    opacity: 0.3,
  },

  // ── Logo ─────────────────────────────────────
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
  },
  logoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderFocus,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  logoBadge: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.accentLight,
  },
  logoBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.accent,
    letterSpacing: 1.2,
  },

  // ── Hero ─────────────────────────────────────
  heroSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  heroCard: {
    width: "100%",
    height: 220,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 4,
  },
  ring1: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    borderStyle: "dashed",
  },
  ring2: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: colors.borderFocus,
    opacity: 0.4,
  },
  heroIconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.borderFocus,
  },

  // Floating pills
  statusPill: {
    position: "absolute",
    bottom: 18,
    left: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  timeBadge: {
    position: "absolute",
    top: 18,
    right: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.warningSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.warningLight,
  },
  timeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.warning,
  },

  // Feature chips
  chipsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  // ── Copy ─────────────────────────────────────
  copySection: {
    marginBottom: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.8,
    lineHeight: 40,
    marginBottom: 10,
  },
  titleAccent: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    maxWidth: "88%",
  },

  // ── Actions ──────────────────────────────────
  actions: {
    gap: 10,
  },
  primaryBtn: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryBtnText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  arrowPill: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtn: {
    height: 54,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  secondaryBtnText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 4,
  },
  loginLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
    textDecorationLine: "underline",
  },
});