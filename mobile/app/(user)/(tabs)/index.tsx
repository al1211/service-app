import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../src/theme/colors';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

interface Service {
  id: string;
  name: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
  tag?: string;
}

interface Order {
  id: string;
  title: string;
  provider: string;
  status: 'In Progress' | 'Scheduled' | 'Completed' | 'Cancelled';
  time: string;
  amount: number;
  icon: keyof typeof Ionicons.glyphMap;
}

interface PromoCard {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const services: Service[] = [
  {
    id: '1',
    name: 'Cleaning',
    subtitle: 'Home & Office',
    icon: 'sparkles-outline',
    color: colors.primary,
    bgColor: colors.primary + '12',
    tag: 'Popular',
  },
  {
    id: '2',
    name: 'Plumbing',
    subtitle: 'Repairs & Fix',
    icon: 'water-outline',
    color: colors.driverAccent,
    bgColor: colors.driverAccent + '12',
  },
  {
    id: '3',
    name: 'Electrician',
    subtitle: 'Wiring & More',
    icon: 'flash-outline',
    color: colors.warning,
    bgColor: colors.warning + '12',
    tag: 'Fast',
  },
  {
    id: '4',
    name: 'Grocery',
    subtitle: 'Quick Delivery',
    icon: 'bag-handle-outline',
    color: colors.success,
    bgColor: colors.success + '12',
  },
  {
    id: '5',
    name: 'Painting',
    subtitle: 'Interior & Ext.',
    icon: 'color-palette-outline',
    color: colors.danger,
    bgColor: colors.danger + '12',
  },
  {
    id: '6',
    name: 'AC Repair',
    subtitle: 'Service & Gas',
    icon: 'snow-outline',
    color: colors.primaryLight,
    bgColor: colors.primaryLight + '12',
  },
];

const orders: Order[] = [
  {
    id: 'ORD-5231',
    title: 'Home Cleaning',
    provider: 'Ramesh K.',
    status: 'In Progress',
    time: 'Today, 3:00 PM',
    amount: 499,
    icon: 'sparkles-outline',
  },
  {
    id: 'ORD-5228',
    title: 'Electrician',
    provider: 'Suresh M.',
    status: 'Scheduled',
    time: 'Tomorrow, 10:00 AM',
    amount: 349,
    icon: 'flash-outline',
  },
];

const promos: PromoCard[] = [
  {
    id: '1',
    title: '20% OFF',
    subtitle: 'On your first cleaning service',
    cta: 'Book Now',
    color: colors.primary,
    icon: 'sparkles',
  },
  {
    id: '2',
    title: 'Free Inspection',
    subtitle: 'Electrician visit at ₹0 today',
    cta: 'Grab Deal',
    color: colors.driverAccent,
    icon: 'flash',
  },
];

// ─── Status Config ────────────────────────────────────────────────────────────

const getStatusConfig = (status: Order['status']) => {
  switch (status) {
    case 'In Progress':
      return { color: colors.primary, bg: colors.primary + '15', dot: true };
    case 'Scheduled':
      return { color: colors.warning, bg: colors.warning + '15', dot: false };
    case 'Completed':
      return { color: colors.success, bg: colors.success + '15', dot: false };
    case 'Cancelled':
      return { color: colors.danger, bg: colors.danger + '15', dot: false };
  }
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const ServiceCard = ({ item }: { item: Service }) => (
  <TouchableOpacity style={styles.serviceCard} activeOpacity={0.8}>
    {item.tag && (
      <View style={[styles.serviceTag, { backgroundColor: item.color }]}>
        <Text style={styles.serviceTagText}>{item.tag}</Text>
      </View>
    )}
    <View style={[styles.serviceIconWrap, { backgroundColor: item.bgColor }]}>
      <Ionicons name={item.icon} size={26} color={item.color} />
    </View>
    <Text style={styles.serviceName}>{item.name}</Text>
    <Text style={styles.serviceSubtitle}>{item.subtitle}</Text>
  </TouchableOpacity>
);

const PromoCardItem = ({ promo }: { promo: PromoCard }) => (
  <TouchableOpacity
    activeOpacity={0.88}
    style={[styles.promoCard, { backgroundColor: promo.color }]}
  >
    {/* Decorative blobs */}
    <View style={[styles.promoBlob1, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
    <View style={[styles.promoBlob2, { backgroundColor: 'rgba(255,255,255,0.08)' }]} />

    <View style={styles.promoContent}>
      <Text style={styles.promoTitle}>{promo.title}</Text>
      <Text style={styles.promoSubtitle}>{promo.subtitle}</Text>
      <View style={styles.promoCTA}>
        <Text style={styles.promoCTAText}>{promo.cta}</Text>
        <Ionicons name="arrow-forward" size={14} color="#fff" />
      </View>
    </View>
    <View style={styles.promoIconWrap}>
      <Ionicons name={promo.icon} size={52} color="rgba(255,255,255,0.25)" />
    </View>
  </TouchableOpacity>
);

const OrderRow = ({ order }: { order: Order }) => {
  const statusCfg = getStatusConfig(order.status);
  return (
    <TouchableOpacity style={styles.orderRow} activeOpacity={0.82}>
      <View style={[styles.orderIconWrap, { backgroundColor: colors.primary + '12' }]}>
        <Ionicons name={order.icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.orderInfo}>
        <View style={styles.orderTopRow}>
          <Text style={styles.orderTitle}>{order.title}</Text>
          <Text style={styles.orderAmount}>₹{order.amount}</Text>
        </View>
        <Text style={styles.orderProvider}>{order.provider} · {order.time}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
          {statusCfg.dot && <View style={[styles.statusDot, { backgroundColor: statusCfg.color }]} />}
          <Text style={[styles.statusText, { color: statusCfg.color }]}>{order.status}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activePromo, setActivePromo] = useState(0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>John! 👋</Text>
          </View>
          <View style={styles.headerActions}>
              <TouchableOpacity 
    style={styles.headerBtn} 
    activeOpacity={0.8}
    onPress={() => router.push('/(user)/(tabs)/cart')}
  >
    <Ionicons name="cart-outline" size={21} color={colors.textPrimary} />
    <View style={styles.cartBadge}>
      <Text style={styles.cartBadgeText}>3</Text>
    </View>
  </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn} activeOpacity={0.8}>
              <Ionicons name="notifications-outline" size={21} color={colors.textPrimary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarBtn} activeOpacity={0.8} onPress={()=>router.push("/(user)/(tabs)/profile")}>
              <Text style={styles.avatarText}>J</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── LOCATION BAR ── */}
        <TouchableOpacity style={styles.locationBar} activeOpacity={0.8}>
          <Ionicons name="location-sharp" size={16} color={colors.primary} />
          <Text style={styles.locationText} numberOfLines={1}>Sector 62, Noida, Uttar Pradesh</Text>
          <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* ── SEARCH BAR ── */}
        <TouchableOpacity style={styles.searchBar} activeOpacity={0.85} onPress={()=>router.push("/(user)/(tabs)/search")}>
          <View style={styles.searchLeft}>
            <Ionicons name="search-outline" size={20} color={colors.textLight} />
            <Text style={styles.searchPlaceholder}>Search services, providers...</Text>
          </View>
          <View style={styles.filterBtn}>
            <Ionicons name="options-outline" size={18} color={colors.primary} />
          </View>
        </TouchableOpacity>

        {/* ── PROMO CAROUSEL ── */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 32));
            setActivePromo(idx);
          }}
          contentContainerStyle={styles.promoScroll}
        >
          {promos.map((promo) => (
            <PromoCardItem key={promo.id} promo={promo} />
          ))}
        </ScrollView>
        {/* Dots */}
        <View style={styles.promoDots}>
          {promos.map((_, i) => (
            <View
              key={i}
              style={[styles.promoDot, activePromo === i && styles.promoDotActive]}
            />
          ))}
        </View>

        {/* ── SERVICES GRID ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <ServiceCard key={service.id} item={service} />
          ))}
        </View>

        {/* ── ACTIVE ORDERS ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Orders</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ordersList}>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </View>

        {/* ── QUICK STATS BANNER ── */}
        <View style={styles.statsBanner}>
          {[
            { icon: 'shield-checkmark-outline' as const, label: 'Verified\nProviders', color: colors.success },
            { icon: 'flash-outline' as const, label: 'Same Day\nService', color: colors.warning },
            { icon: 'star-outline' as const, label: '4.9★\nRating', color: colors.primary },
          ].map((stat, i) => (
            <React.Fragment key={i}>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '15' }]}>
                  <Ionicons name={stat.icon} size={20} color={stat.color} />
                </View>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
              {i < 2 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.8,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  notifDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.card,
  },
  avatarBtn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },

  // Location
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: colors.primary + '0D',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.primary + '25',
  },
  locationText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 22,
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  searchLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  filterBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Promo
  promoScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  promoCard: {
    width: SCREEN_WIDTH - 40,
    borderRadius: 22,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 12,
    minHeight: 120,
  },
  promoBlob1: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    top: -50,
    right: -30,
  },
  promoBlob2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    bottom: -20,
    right: 60,
  },
  promoContent: {
    flex: 1,
    zIndex: 1,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 4,
  },
  promoSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 14,
  },
  promoCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  promoCTAText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  promoIconWrap: {
    position: 'absolute',
    right: 16,
    bottom: 10,
  },
  promoDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    marginBottom: 26,
  },
  promoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  promoDotActive: {
    width: 20,
    backgroundColor: colors.primary,
  },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },

  // Services Grid
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 28,
  },
  serviceCard: {
    width: (SCREEN_WIDTH - 32 - 20) / 3,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  serviceTag: {
    position: 'absolute',
    top: 8,
    right: 0,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  serviceTagText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  serviceIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  serviceSubtitle: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: '500',
  },

  // Orders
  ordersList: {
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 10,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  orderIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  orderInfo: {
    flex: 1,
    gap: 3,
  },
  orderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  orderAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  orderProvider: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Stats Banner
  statsBanner: {
    marginHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
    gap: 8,
  },
  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: colors.border,
  },
  cartBadge: {
  position: 'absolute',
  top: 7,
  right: 7,
  width: 16,
  height: 16,
  borderRadius: 8,
  backgroundColor: colors.danger,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1.5,
  borderColor: colors.card,
},
cartBadgeText: {
  color: '#fff',
  fontSize: 9,
  fontWeight: '800',
},
});