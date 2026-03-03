import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  TextInput,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../src/theme/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus = "active" | "completed" | "cancelled" | "pending";
type FilterTab = "all" | "active" | "completed" | "cancelled";

interface OrderItem {
  id: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  dropAddress: string;
  distance: string;
  estimatedTime: string;
  amount: number;
  status: OrderStatus;
  date: string;
  itemCount: number;
  paymentMode: "cash" | "online";
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const orders: OrderItem[] = [
  {
    id: "ORD-5231",
    customerName: "Rahul Sharma",
    customerPhone: "+91 98765 43210",
    pickupAddress: "McDonald's, Sector 18, Noida",
    dropAddress: "Sector 62, Noida, Uttar Pradesh",
    distance: "3.2 km",
    estimatedTime: "12 min",
    amount: 145,
    status: "active",
    date: "Today, 02:45 PM",
    itemCount: 3,
    paymentMode: "online",
  },
  {
    id: "ORD-5230",
    customerName: "Priya Verma",
    customerPhone: "+91 91234 56789",
    pickupAddress: "Domino's, Connaught Place",
    dropAddress: "Karol Bagh, New Delhi",
    distance: "5.8 km",
    estimatedTime: "22 min",
    amount: 210,
    status: "pending",
    date: "Today, 12:10 PM",
    itemCount: 2,
    paymentMode: "cash",
  },
  {
    id: "ORD-5229",
    customerName: "Amit Gupta",
    customerPhone: "+91 99887 65432",
    pickupAddress: "Burger King, Lajpat Nagar",
    dropAddress: "Greater Kailash, New Delhi",
    distance: "2.1 km",
    estimatedTime: "8 min",
    amount: 95,
    status: "completed",
    date: "Today, 10:30 AM",
    itemCount: 1,
    paymentMode: "online",
  },
  {
    id: "ORD-5225",
    customerName: "Sneha Kapoor",
    customerPhone: "+91 98112 34567",
    pickupAddress: "KFC, Dwarka Sector 10",
    dropAddress: "Dwarka Sector 13, Delhi",
    distance: "1.4 km",
    estimatedTime: "6 min",
    amount: 175,
    status: "completed",
    date: "Yesterday, 06:15 PM",
    itemCount: 4,
    paymentMode: "online",
  },
  {
    id: "ORD-5220",
    customerName: "Rohan Mehta",
    customerPhone: "+91 87654 32109",
    pickupAddress: "Pizza Hut, Vasant Kunj",
    dropAddress: "Mahipalpur, New Delhi",
    distance: "4.5 km",
    estimatedTime: "18 min",
    amount: 130,
    status: "cancelled",
    date: "Yesterday, 03:20 PM",
    itemCount: 2,
    paymentMode: "cash",
  },
  {
    id: "ORD-5218",
    customerName: "Neha Singh",
    customerPhone: "+91 76543 21098",
    pickupAddress: "Subway, Janakpuri",
    dropAddress: "Uttam Nagar, Delhi",
    distance: "3.9 km",
    estimatedTime: "15 min",
    amount: 88,
    status: "completed",
    date: "Yesterday, 01:00 PM",
    itemCount: 1,
    paymentMode: "online",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case "active":
      return { color: colors.primary, bg: colors.primary + "15", label: "Active", icon: "bicycle-outline" as const };
    case "pending":
      return { color: colors.warning, bg: colors.warning + "15", label: "Pending", icon: "time-outline" as const };
    case "completed":
      return { color: colors.success, bg: colors.success + "15", label: "Completed", icon: "checkmark-circle-outline" as const };
    case "cancelled":
      return { color: colors.danger, bg: colors.danger + "15", label: "Cancelled", icon: "close-circle-outline" as const };
  }
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SummaryPill = ({
  icon,
  label,
  value,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
}) => (
  <View style={[summaryStyles.pill, { borderColor: color + "30" }]}>
    <View style={[summaryStyles.iconWrap, { backgroundColor: color + "18" }]}>
      <Ionicons name={icon} size={16} color={color} />
    </View>
    <View>
      <Text style={summaryStyles.pillValue}>{value}</Text>
      <Text style={summaryStyles.pillLabel}>{label}</Text>
    </View>
  </View>
);

const summaryStyles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    flex: 1,
    borderWidth: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  pillValue: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  pillLabel: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: "500",
  },
});

const OrderCard = ({
  order,
  onPress,
}: {
  order: OrderItem;
  onPress: () => void;
}) => {
  const statusCfg = getStatusConfig(order.status);
  const isActive = order.status === "active";
  const isPending = order.status === "pending";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.orderCard,
        (isActive || isPending) && styles.orderCardHighlight,
      ]}
    >
      {/* Active pulse indicator */}
      {isActive && <View style={styles.activePulse} />}

      {/* ── Card Header ── */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.orderDate}>{order.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
          <Ionicons name={statusCfg.icon} size={12} color={statusCfg.color} />
          <Text style={[styles.statusText, { color: statusCfg.color }]}>
            {statusCfg.label}
          </Text>
        </View>
      </View>

      {/* ── Customer Row ── */}
      <View style={styles.customerRow}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {order.customerName.charAt(0)}
          </Text>
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{order.customerName}</Text>
          <Text style={styles.customerPhone}>{order.customerPhone}</Text>
        </View>
        <View style={styles.paymentBadge}>
          <Ionicons
            name={order.paymentMode === "online" ? "card-outline" : "cash-outline"}
            size={12}
            color={order.paymentMode === "online" ? colors.primary : colors.success}
          />
          <Text
            style={[
              styles.paymentText,
              {
                color:
                  order.paymentMode === "online" ? colors.primary : colors.success,
              },
            ]}
          >
            {order.paymentMode === "online" ? "Online" : "Cash"}
          </Text>
        </View>
      </View>

      {/* ── Route ── */}
      <View style={styles.routeContainer}>
        <View style={styles.routeDots}>
          <View style={styles.dotPickup} />
          <View style={styles.routeLine} />
          <View style={styles.dotDrop} />
        </View>
        <View style={styles.routeAddresses}>
          <View style={styles.routeAddressRow}>
            <Text style={styles.routeAddressLabel}>PICKUP</Text>
            <Text style={styles.routeAddress} numberOfLines={1}>
              {order.pickupAddress}
            </Text>
          </View>
          <View style={styles.routeAddressRow}>
            <Text style={styles.routeAddressLabel}>DROP</Text>
            <Text style={styles.routeAddress} numberOfLines={1}>
              {order.dropAddress}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Footer ── */}
      <View style={styles.cardFooter}>
        <View style={styles.footerMeta}>
          <View style={styles.metaChip}>
            <Ionicons name="navigate-outline" size={12} color={colors.textSecondary} />
            <Text style={styles.metaText}>{order.distance}</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
            <Text style={styles.metaText}>{order.estimatedTime}</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="fast-food-outline" size={12} color={colors.textSecondary} />
            <Text style={styles.metaText}>{order.itemCount} item{order.itemCount > 1 ? "s" : ""}</Text>
          </View>
        </View>
        <Text style={styles.orderAmount}>₹{order.amount}</Text>
      </View>

      {/* ── CTA for active/pending ── */}
      {(isActive || isPending) && (
        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={styles.ctaSecondary}
            activeOpacity={0.8}
          >
            <Ionicons name="call-outline" size={16} color={colors.primary} />
            <Text style={styles.ctaSecondaryText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ctaPrimary, { backgroundColor: isActive ? colors.primary : colors.warning }]}
            activeOpacity={0.85}
          >
            <Ionicons name={isActive ? "checkmark-outline" : "bicycle-outline"} size={16} color="#fff" />
            <Text style={styles.ctaPrimaryText}>
              {isActive ? "Mark Delivered" : "Accept Order"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DriverOrdersScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: orders.length },
    { key: "active", label: "Active", count: orders.filter((o) => o.status === "active" || o.status === "pending").length },
    { key: "completed", label: "Done", count: orders.filter((o) => o.status === "completed").length },
    { key: "cancelled", label: "Cancelled", count: orders.filter((o) => o.status === "cancelled").length },
  ];

  const filteredOrders = orders.filter((o) => {
    const matchesTab =
      activeFilter === "all"
        ? true
        : activeFilter === "active"
        ? o.status === "active" || o.status === "pending"
        : o.status === activeFilter;

    const matchesSearch =
      searchQuery.trim() === "" ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.dropAddress.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const todayEarnings = orders
    .filter((o) => o.status === "completed" && o.date.startsWith("Today"))
    .reduce((s, o) => s + o.amount, 0);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>My Orders</Text>
            <Text style={styles.subGreeting}>Manage your deliveries</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn} activeOpacity={0.8}>
            <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Summary Pills */}
        <View style={styles.summaryRow}>
          <SummaryPill
            icon="receipt-outline"
            label="Today's Orders"
            value={`${orders.filter((o) => o.date.startsWith("Today")).length}`}
            color={colors.primary}
          />
          <SummaryPill
            icon="cash-outline"
            label="Today's Earning"
            value={`₹${todayEarnings}`}
            color={colors.success}
          />
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={colors.textLight} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search order ID or customer..."
            placeholderTextColor={colors.textLight}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── FILTER TABS ── */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveFilter(tab.key)}
                activeOpacity={0.8}
                style={[styles.filterTab, isActive && styles.filterTabActive]}
              >
                <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
                  {tab.label}
                </Text>
                <View style={[styles.countBadge, { backgroundColor: isActive ? "rgba(255,255,255,0.25)" : colors.border }]}>
                  <Text style={[styles.countText, { color: isActive ? "#fff" : colors.textSecondary }]}>
                    {tab.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── ORDER LIST ── */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="cube-outline" size={40} color={colors.textLight} />
            </View>
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptySubtitle}>Try changing your filter or search query</Text>
          </View>
        }
        renderItem={({ item }) => (
          <OrderCard order={item} onPress={() => {}} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
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
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingTop: 8,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.8,
  },
  subGreeting: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: "500",
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  notifDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.card,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "500",
    padding: 0,
  },

  // Filter Tabs
  filterWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  filterTabTextActive: {
    color: "#fff",
  },
  countBadge: {
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: "center",
  },
  countText: {
    fontSize: 11,
    fontWeight: "700",
  },

  // List
  listContent: {
    padding: 16,
  },

  // Order Card
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    overflow: "hidden",
  },
  orderCardHighlight: {
    borderColor: colors.primary + "40",
    shadowColor: colors.primary,
    shadowOpacity: 0.12,
    elevation: 4,
  },
  activePulse: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  // Card Header
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  cardHeaderLeft: {
    gap: 2,
  },
  orderId: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  orderDate: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: "500",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  // Customer
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary + "18",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primary,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  customerPhone: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  paymentBadge: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "700",
  },

  // Route
  routeContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  routeDots: {
    alignItems: "center",
    paddingTop: 4,
    width: 14,
  },
  dotPickup: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.primary + "40",
  },
  routeLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
    backgroundColor: colors.border,
    borderRadius: 1,
    minHeight: 20,
  },
  dotDrop: {
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: colors.danger,
    borderWidth: 2,
    borderColor: colors.danger + "40",
  },
  routeAddresses: {
    flex: 1,
    gap: 12,
  },
  routeAddressRow: {
    gap: 2,
  },
  routeAddressLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.textLight,
    letterSpacing: 0.8,
  },
  routeAddress: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: "600",
    letterSpacing: -0.2,
  },

  // Footer
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: 0,
  },
  footerMeta: {
    flexDirection: "row",
    gap: 8,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metaText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  orderAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },

  // CTA
  ctaRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  ctaSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ctaSecondaryText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  ctaPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
  },
  ctaPrimaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: -0.2,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 10,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});