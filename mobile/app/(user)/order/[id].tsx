import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import colors from '../../../src/theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus = 'active' | 'scheduled' | 'completed' | 'cancelled';
type FilterTab = 'all' | 'active' | 'scheduled' | 'completed' | 'cancelled';

interface OrderItem {
  id: string;
  title: string;
  provider: string;
  providerInitial: string;
  category: string;
  status: OrderStatus;
  date: string;
  time: string;
  amount: number;
  itemCount: number;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  address: string;
  paymentMode: 'online' | 'cash';
  rating?: number;
  canReorder?: boolean;
  canTrack?: boolean;
  canCancel?: boolean;
  canReview?: boolean;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const orders: OrderItem[] = [
  {
    id: 'ORD-5231',
    title: 'Home Deep Cleaning',
    provider: 'Ramesh Kumar',
    providerInitial: 'R',
    category: 'Cleaning',
    status: 'active',
    date: 'Today',
    time: '3:00 PM',
    amount: 499,
    itemCount: 3,
    icon: 'sparkles-outline',
    iconColor: colors.primary,
    iconBg: colors.primary + '15',
    address: 'Sector 62, Noida, UP',
    paymentMode: 'online',
    canTrack: true,
    canCancel: true,
  },
  {
    id: 'ORD-5230',
    title: 'Switchboard Repair',
    provider: 'Suresh Mehta',
    providerInitial: 'S',
    category: 'Electrician',
    status: 'scheduled',
    date: 'Tomorrow',
    time: '10:00 AM',
    amount: 349,
    itemCount: 1,
    icon: 'flash-outline',
    iconColor: colors.warning,
    iconBg: colors.warning + '15',
    address: 'Sector 62, Noida, UP',
    paymentMode: 'cash',
    canTrack: false,
    canCancel: true,
  },
  {
    id: 'ORD-5225',
    title: 'AC Gas Refill & Service',
    provider: 'CoolTech Services',
    providerInitial: 'C',
    category: 'AC Repair',
    status: 'completed',
    date: 'Yesterday',
    time: '11:30 AM',
    amount: 899,
    itemCount: 2,
    icon: 'snow-outline',
    iconColor: colors.primaryLight,
    iconBg: colors.primaryLight + '15',
    address: 'Sector 62, Noida, UP',
    paymentMode: 'online',
    rating: 5,
    canReorder: true,
  },
  {
    id: 'ORD-5220',
    title: 'Kitchen Chimney Cleaning',
    provider: 'CleanPro India',
    providerInitial: 'C',
    category: 'Cleaning',
    status: 'completed',
    date: '12 Feb 2025',
    time: '2:00 PM',
    amount: 399,
    itemCount: 1,
    icon: 'flame-outline',
    iconColor: colors.warning,
    iconBg: colors.warning + '12',
    address: 'Sector 62, Noida, UP',
    paymentMode: 'online',
    canReorder: true,
    canReview: true,
  },
  {
    id: 'ORD-5215',
    title: 'Pipe Leak Repair',
    provider: 'AquaFix Plumbing',
    providerInitial: 'A',
    category: 'Plumbing',
    status: 'cancelled',
    date: '8 Feb 2025',
    time: '4:00 PM',
    amount: 249,
    itemCount: 1,
    icon: 'build-outline',
    iconColor: colors.driverAccent,
    iconBg: colors.driverAccent + '12',
    address: 'Sector 62, Noida, UP',
    paymentMode: 'cash',
    canReorder: true,
  },
  {
    id: 'ORD-5210',
    title: 'Wall Painting (2 Rooms)',
    provider: 'PaintMaster Pro',
    providerInitial: 'P',
    category: 'Painting',
    status: 'completed',
    date: '1 Feb 2025',
    time: '9:00 AM',
    amount: 2400,
    itemCount: 4,
    icon: 'color-palette-outline',
    iconColor: colors.danger,
    iconBg: colors.danger + '12',
    address: 'Sector 62, Noida, UP',
    paymentMode: 'online',
    rating: 4,
    canReorder: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case 'active':
      return {
        color: colors.primary,
        bg: colors.primary + '15',
        label: 'In Progress',
        icon: 'radio-button-on' as const,
        pulse: true,
      };
    case 'scheduled':
      return {
        color: colors.warning,
        bg: colors.warning + '15',
        label: 'Scheduled',
        icon: 'time-outline' as const,
        pulse: false,
      };
    case 'completed':
      return {
        color: colors.success,
        bg: colors.success + '15',
        label: 'Completed',
        icon: 'checkmark-circle-outline' as const,
        pulse: false,
      };
    case 'cancelled':
      return {
        color: colors.danger,
        bg: colors.danger + '15',
        label: 'Cancelled',
        icon: 'close-circle-outline' as const,
        pulse: false,
      };
  }
};

const StarRating = ({ rating }: { rating: number }) => (
  <View style={starStyles.row}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Ionicons
        key={i}
        name={i <= rating ? 'star' : 'star-outline'}
        size={12}
        color={i <= rating ? colors.warning : colors.border}
      />
    ))}
  </View>
);

const starStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 2 },
});

// ─── Order Card ───────────────────────────────────────────────────────────────

const OrderCard = ({ order }: { order: OrderItem }) => {
  const statusCfg = getStatusConfig(order.status);

  return (
    <TouchableOpacity
      style={[
        styles.orderCard,
        order.status === 'active' && styles.orderCardActive,
        order.status === 'cancelled' && styles.orderCardCancelled,
      ]}
      activeOpacity={0.82}
      onPress={() => router.push(`/(user)/order/${order.id}` as any)}
    >
      {/* Active top bar */}
      {order.status === 'active' && <View style={styles.activeBar} />}

      {/* ── TOP ROW ── */}
      <View style={styles.cardTop}>
        {/* Service icon */}
        <View style={[styles.serviceIcon, { backgroundColor: order.iconBg }]}>
          <Ionicons name={order.icon} size={22} color={order.iconColor} />
        </View>

        {/* Title + category */}
        <View style={styles.cardTitleWrap}>
          <Text style={styles.cardTitle} numberOfLines={1}>{order.title}</Text>
          <Text style={styles.cardCategory}>{order.category}</Text>
        </View>

        {/* Status badge */}
        <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
          {statusCfg.pulse && (
            <View style={[styles.pulseDot, { backgroundColor: statusCfg.color }]} />
          )}
          <Text style={[styles.statusText, { color: statusCfg.color }]}>
            {statusCfg.label}
          </Text>
        </View>
      </View>

      {/* ── PROVIDER ROW ── */}
      <View style={styles.providerRow}>
        <View style={styles.providerAvatar}>
          <Text style={styles.providerInitial}>{order.providerInitial}</Text>
        </View>
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{order.provider}</Text>
          {order.rating && <StarRating rating={order.rating} />}
        </View>
        <View style={styles.paymentChip}>
          <Ionicons
            name={order.paymentMode === 'online' ? 'card-outline' : 'cash-outline'}
            size={12}
            color={order.paymentMode === 'online' ? colors.primary : colors.success}
          />
          <Text
            style={[
              styles.paymentText,
              { color: order.paymentMode === 'online' ? colors.primary : colors.success },
            ]}
          >
            {order.paymentMode === 'online' ? 'Online' : 'Cash'}
          </Text>
        </View>
      </View>

      {/* ── META ROW ── */}
      <View style={styles.metaRow}>
        <View style={styles.metaChip}>
          <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
          <Text style={styles.metaText}>{order.date}, {order.time}</Text>
        </View>
        <View style={styles.metaChip}>
          <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
          <Text style={styles.metaText} numberOfLines={1}>{order.address}</Text>
        </View>
      </View>

      {/* ── FOOTER ── */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.orderIdText}>{order.id}</Text>
          <Text style={styles.amountText}>₹{order.amount.toLocaleString('en-IN')}</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actionBtns}>
          {order.canCancel && (
            <TouchableOpacity style={styles.actionBtnSecondary} activeOpacity={0.8}>
              <Text style={styles.actionBtnSecondaryText}>Cancel</Text>
            </TouchableOpacity>
          )}
          {order.canTrack && (
            <TouchableOpacity
              style={[styles.actionBtnPrimary, { backgroundColor: colors.primary }]}
              activeOpacity={0.85}
              onPress={() => router.push(`/(user)/order/track` as any)}
            >
              <Ionicons name="navigate-outline" size={14} color="#fff" />
              <Text style={styles.actionBtnPrimaryText}>Track</Text>
            </TouchableOpacity>
          )}
          {order.canReorder && (
            <TouchableOpacity
              style={[styles.actionBtnPrimary, { backgroundColor: colors.success }]}
              activeOpacity={0.85}
            >
              <Ionicons name="refresh-outline" size={14} color="#fff" />
              <Text style={styles.actionBtnPrimaryText}>Reorder</Text>
            </TouchableOpacity>
          )}
          {order.canReview && (
            <TouchableOpacity
              style={[styles.actionBtnPrimary, { backgroundColor: colors.warning }]}
              activeOpacity={0.85}
            >
              <Ionicons name="star-outline" size={14} color="#fff" />
              <Text style={styles.actionBtnPrimaryText}>Review</Text>
            </TouchableOpacity>
          )}
          {order.status === 'cancelled' && !order.canReorder && (
            <TouchableOpacity
              style={[styles.actionBtnPrimary, { backgroundColor: colors.primary }]}
              activeOpacity={0.85}
            >
              <Text style={styles.actionBtnPrimaryText}>Book Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function UserOrdersScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'scheduled', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const filtered = orders.filter((o) => {
    if (activeFilter === 'all') return true;
    return o.status === activeFilter;
  });

  const activeCount = orders.filter((o) => o.status === 'active').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;
  const totalSpent = orders
    .filter((o) => o.status === 'completed')
    .reduce((s, o) => s + o.amount, 0);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSub}>Track & manage your bookings</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.8}>
          <Ionicons name="help-circle-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* ── SUMMARY STRIP ── */}
      <View style={styles.summaryStrip}>
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIconWrap, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="receipt-outline" size={16} color={colors.primary} />
          </View>
          <Text style={[styles.summaryValue, { color: colors.primary }]}>{orders.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIconWrap, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="radio-button-on" size={16} color={colors.primary} />
          </View>
          <Text style={[styles.summaryValue, { color: colors.primary }]}>{activeCount}</Text>
          <Text style={styles.summaryLabel}>Active</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIconWrap, { backgroundColor: colors.success + '15' }]}>
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.success} />
          </View>
          <Text style={[styles.summaryValue, { color: colors.success }]}>{completedCount}</Text>
          <Text style={styles.summaryLabel}>Done</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIconWrap, { backgroundColor: colors.driverAccent + '15' }]}>
            <Ionicons name="wallet-outline" size={16} color={colors.driverAccent} />
          </View>
          <Text style={[styles.summaryValue, { color: colors.driverAccent }]}>
            ₹{(totalSpent / 1000).toFixed(1)}k
          </Text>
          <Text style={styles.summaryLabel}>Spent</Text>
        </View>
      </View>

      {/* ── FILTER TABS ── */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            const count = tab.key === 'all'
              ? orders.length
              : orders.filter((o) =>
                  tab.key === 'scheduled' ? o.status === 'scheduled' : o.status === tab.key
                ).length;

            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveFilter(tab.key)}
                style={[styles.filterTab, isActive && styles.filterTabActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
                  {tab.label}
                </Text>
                {count > 0 && (
                  <View
                    style={[
                      styles.filterCount,
                      { backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : colors.border },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterCountText,
                        { color: isActive ? '#fff' : colors.textSecondary },
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── ORDER LIST ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard order={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 32 },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="receipt-outline" size={44} color={colors.textLight} />
            </View>
            <Text style={styles.emptyTitle}>No orders here</Text>
            <Text style={styles.emptySub}>
              {activeFilter === 'active'
                ? 'You have no active orders right now'
                : activeFilter === 'scheduled'
                ? 'No upcoming bookings scheduled'
                : activeFilter === 'cancelled'
                ? 'No cancelled orders — great!'
                : 'Book a service to see your orders here'}
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              activeOpacity={0.85}
              onPress={() => router.push('/(user)/(tabs)/home' as any)}
            >
              <Ionicons name="add-outline" size={16} color="#fff" />
              <Text style={styles.emptyBtnText}>Book a Service</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
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
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.8,
  },
  headerSub: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
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

  // Summary strip
  summaryStrip: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.card,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  summaryIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  summaryLabel: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: '600',
  },
  summaryDivider: {
    width: 1,
    height: 48,
    backgroundColor: colors.border,
    alignSelf: 'center',
  },

  // Filter tabs
  filterWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  filterTabTextActive: {
    color: '#fff',
  },
  filterCount: {
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: 'center',
  },
  filterCountText: {
    fontSize: 11,
    fontWeight: '800',
  },

  // List
  listContent: {
    padding: 16,
  },

  // Order card
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  orderCardActive: {
    borderColor: colors.primary + '40',
    shadowColor: colors.primary,
    shadowOpacity: 0.1,
    elevation: 4,
  },
  orderCardCancelled: {
    opacity: 0.75,
  },
  activeBar: {
    height: 3,
    backgroundColor: colors.primary,
  },

  // Card top
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    paddingBottom: 10,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardTitleWrap: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  cardCategory: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexShrink: 0,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },

  // Provider row
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  providerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primary + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerInitial: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  providerInfo: {
    flex: 1,
    gap: 3,
  },
  providerName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  paymentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Meta row
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexWrap: 'wrap',
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  metaText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  // Card footer
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  orderIdText: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '600',
    marginBottom: 2,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  actionBtns: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionBtnSecondary: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  actionBtnSecondaryText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  actionBtnPrimaryText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 10,
    paddingHorizontal: 40,
  },
  emptyIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 13,
  },
  emptyBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
});