import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../src/theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  value?: string;
  hasToggle?: boolean;
  toggleKey?: string;
  isDanger?: boolean;
}

interface StatItem {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const stats: StatItem[] = [
  { label: 'Total Orders', value: '28', icon: 'receipt-outline', color: colors.primary },
  { label: 'Completed', value: '24', icon: 'checkmark-circle-outline', color: colors.success },
  { label: 'Saved', value: '₹1.2k', icon: 'wallet-outline', color: colors.driverAccent },
  { label: 'Reviews', value: '4.9★', icon: 'star-outline', color: colors.warning },
];

const menuSections: MenuSection[] = [
  {
    title: 'Account',
    items: [
      {
        id: 'edit',
        label: 'Edit Profile',
        icon: 'person-outline',
        iconColor: colors.primary,
        iconBg: colors.primary + '15',
      },
      {
        id: 'addresses',
        label: 'Saved Addresses',
        icon: 'location-outline',
        iconColor: colors.driverAccent,
        iconBg: colors.driverAccent + '15',
        value: '3 saved',
      },
      {
        id: 'payment',
        label: 'Payment Methods',
        icon: 'card-outline',
        iconColor: colors.success,
        iconBg: colors.success + '15',
        value: '2 cards',
      },
      {
        id: 'orders',
        label: 'Order History',
        icon: 'time-outline',
        iconColor: colors.warning,
        iconBg: colors.warning + '15',
      },
    ],
  },
  {
    title: 'Preferences',
    items: [
      {
        id: 'notifications',
        label: 'Push Notifications',
        icon: 'notifications-outline',
        iconColor: colors.primary,
        iconBg: colors.primary + '15',
        hasToggle: true,
        toggleKey: 'notifications',
      },
      {
        id: 'location',
        label: 'Location Services',
        icon: 'navigate-outline',
        iconColor: colors.driverAccent,
        iconBg: colors.driverAccent + '15',
        hasToggle: true,
        toggleKey: 'location',
      },
      {
        id: 'language',
        label: 'Language',
        icon: 'language-outline',
        iconColor: colors.success,
        iconBg: colors.success + '15',
        value: 'English',
      },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        id: 'help',
        label: 'Help & Support',
        icon: 'help-circle-outline',
        iconColor: colors.primary,
        iconBg: colors.primary + '15',
      },
      {
        id: 'about',
        label: 'About App',
        icon: 'information-circle-outline',
        iconColor: colors.textSecondary,
        iconBg: colors.textSecondary + '15',
        value: 'v1.0.0',
      },
      {
        id: 'logout',
        label: 'Log Out',
        icon: 'log-out-outline',
        iconColor: colors.danger,
        iconBg: colors.danger + '12',
        isDanger: true,
      },
    ],
  },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    notifications: true,
    location: true,
  });

  const handleToggle = (key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {/* ── HEADER BANNER ── */}
        <View style={styles.headerBanner}>
          {/* Decorative blobs */}
          <View style={styles.blob1} />
          <View style={styles.blob2} />
          <View style={styles.blob3} />

          {/* Top Nav */}
          <View style={styles.topNav}>
            <TouchableOpacity style={styles.navBtn} activeOpacity={0.8}>
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.navTitle}>My Profile</Text>
            <TouchableOpacity style={styles.navBtn} activeOpacity={0.8}>
              <Ionicons name="create-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarOuter}>
              <View style={styles.avatarInner}>
                <Text style={styles.avatarInitial}>J</Text>
              </View>
              <TouchableOpacity style={styles.avatarEditBtn} activeOpacity={0.85}>
                <Ionicons name="camera" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>John Sharma</Text>
            <Text style={styles.profileEmail}>john.sharma@gmail.com</Text>
            <View style={styles.verifiedRow}>
              <Ionicons name="shield-checkmark" size={14} color={colors.successLight} />
              <Text style={styles.verifiedText}>Verified Account</Text>
            </View>
          </View>
        </View>

        {/* ── MEMBERSHIP CARD ── */}
        <View style={styles.membershipCard}>
          <View style={styles.membershipLeft}>
            <View style={styles.membershipIconWrap}>
              <Ionicons name="diamond-outline" size={20} color={colors.warning} />
            </View>
            <View>
              <Text style={styles.membershipTitle}>Gold Member</Text>
              <Text style={styles.membershipSub}>Member since Jan 2024</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.upgradeBtn} activeOpacity={0.85}>
            <Text style={styles.upgradeText}>Upgrade</Text>
            <Ionicons name="arrow-forward" size={12} color={colors.warning} />
          </TouchableOpacity>
        </View>

        {/* ── STATS ROW ── */}
        <View style={styles.statsRow}>
          {stats.map((stat, i) => (
            <React.Fragment key={i}>
              <View style={styles.statItem}>
                <View style={[styles.statIconWrap, { backgroundColor: stat.color + '15' }]}>
                  <Ionicons name={stat.icon} size={16} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
              {i < stats.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* ── REFERRAL BANNER ── */}
        <TouchableOpacity style={styles.referralBanner} activeOpacity={0.85}>
          <View style={styles.referralLeft}>
            <Text style={styles.referralEmoji}>🎁</Text>
            <View>
              <Text style={styles.referralTitle}>Refer & Earn ₹100</Text>
              <Text style={styles.referralSub}>Invite friends, get rewards!</Text>
            </View>
          </View>
          <View style={styles.referralCodeWrap}>
            <Text style={styles.referralCode}>JOHN100</Text>
          </View>
        </TouchableOpacity>

        {/* ── MENU SECTIONS ── */}
        <View style={styles.menuContainer}>
          {menuSections.map((section, si) => (
            <View key={si} style={styles.menuSection}>
              <Text style={styles.menuSectionTitle}>{section.title}</Text>
              <View style={styles.menuCard}>
                {section.items.map((item, ii) => (
                  <React.Fragment key={item.id}>
                    <TouchableOpacity
                      style={styles.menuItem}
                      activeOpacity={item.hasToggle ? 1 : 0.75}
                    >
                      {/* Icon */}
                      <View style={[styles.menuIconWrap, { backgroundColor: item.iconBg }]}>
                        <Ionicons name={item.icon} size={18} color={item.iconColor} />
                      </View>

                      {/* Label */}
                      <Text
                        style={[
                          styles.menuLabel,
                          item.isDanger && { color: colors.danger },
                        ]}
                      >
                        {item.label}
                      </Text>

                      {/* Right side */}
                      <View style={styles.menuRight}>
                        {item.hasToggle && item.toggleKey ? (
                          <Switch
                            value={toggles[item.toggleKey] ?? false}
                            onValueChange={() => handleToggle(item.toggleKey!)}
                            trackColor={{ false: colors.border, true: colors.primary + '80' }}
                            thumbColor={toggles[item.toggleKey] ? colors.primary : '#f4f3f4'}
                            ios_backgroundColor={colors.border}
                          />
                        ) : item.value ? (
                          <View style={styles.menuValueWrap}>
                            <Text style={styles.menuValue}>{item.value}</Text>
                            {!item.isDanger && (
                              <Ionicons name="chevron-forward" size={15} color={colors.textLight} />
                            )}
                          </View>
                        ) : (
                          !item.isDanger && (
                            <Ionicons name="chevron-forward" size={15} color={colors.textLight} />
                          )
                        )}
                      </View>
                    </TouchableOpacity>

                    {/* Divider between items */}
                    {ii < section.items.length - 1 && (
                      <View style={styles.menuDivider} />
                    )}
                  </React.Fragment>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* ── FOOTER ── */}
        <Text style={styles.footer}>
          QuickServe · v1.0.0 · Made with ❤️ in India
        </Text>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header Banner
  headerBanner: {
    backgroundColor: colors.primaryDark,
    paddingBottom: 36,
    overflow: 'hidden',
    position: 'relative',
  },
  blob1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -60,
    right: -60,
  },
  blob2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: 20,
    right: 40,
  },
  blob3: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -40,
    left: -30,
  },

  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    gap: 6,
  },
  avatarOuter: {
    position: 'relative',
    marginBottom: 4,
  },
  avatarInner: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
  },
  avatarEditBtn: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primaryDark,
  },
  profileName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginTop: 4,
  },
  profileEmail: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '500',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 2,
  },
  verifiedText: {
    color: colors.successLight,
    fontSize: 12,
    fontWeight: '700',
  },

  // Membership Card
  membershipCard: {
    marginHorizontal: 16,
    marginTop: -20,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.warning + '30',
    elevation: 8,
    shadowColor: colors.warning,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    zIndex: 10,
  },
  membershipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  membershipIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.warning + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  membershipTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  membershipSub: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
    marginTop: 2,
  },
  upgradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.warning + '18',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.warning + '40',
  },
  upgradeText: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: '800',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: '600',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 44,
    backgroundColor: colors.border,
  },

  // Referral
  referralBanner: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: colors.driverAccent + '0E',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.driverAccent + '25',
  },
  referralLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  referralEmoji: {
    fontSize: 28,
  },
  referralTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  referralSub: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  referralCodeWrap: {
    backgroundColor: colors.driverAccent,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  referralCode: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },

  // Menu
  menuContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 20,
  },
  menuSection: {
    gap: 10,
  },
  menuSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textLight,
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingLeft: 4,
  },
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  menuValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 68,
  },

  // Footer
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
    marginTop: 24,
    marginBottom: 8,
  },
});