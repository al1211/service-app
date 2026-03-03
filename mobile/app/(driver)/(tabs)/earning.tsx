import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../src/theme/colors";
import { router } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_HEIGHT = 110;

// ─── Types ────────────────────────────────────────────────────────────────────

type TabType = "week" | "month" | "year";
type TxStatus = "completed" | "cancelled" | "bonus";

interface DayData {
  day: string;
  amount: number;
  trips: number;
}

interface Transaction {
  id: string;
  address: string;
  time: string;
  amount: number;
  status: TxStatus;
  type: "delivery" | "bonus";
}

interface BreakdownItem {
  label: string;
  amount: number;
  pct: number;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const weekData: DayData[] = [
  { day: "Mon", amount: 820, trips: 6 },
  { day: "Tue", amount: 1340, trips: 9 },
  { day: "Wed", amount: 640, trips: 4 },
  { day: "Thu", amount: 1580, trips: 11 },
  { day: "Fri", amount: 1240, trips: 8 },
  { day: "Sat", amount: 1920, trips: 13 },
  { day: "Sun", amount: 760, trips: 5 },
];

const transactions: Transaction[] = [
  { id: "ORD-5231", address: "Sector 62, Noida, Uttar Pradesh", time: "Today, 02:45 PM", amount: 145, status: "completed", type: "delivery" },
  { id: "ORD-5230", address: "Connaught Place, New Delhi", time: "Today, 12:10 PM", amount: 210, status: "completed", type: "delivery" },
  { id: "ORD-5229", address: "Lajpat Nagar, New Delhi", time: "Today, 10:30 AM", amount: 95, status: "completed", type: "delivery" },
  { id: "ORD-5225", address: "Dwarka Sector 10, Delhi", time: "Yesterday, 06:15 PM", amount: 175, status: "completed", type: "delivery" },
  { id: "ORD-5220", address: "Vasant Kunj, New Delhi", time: "Yesterday, 03:20 PM", amount: 130, status: "cancelled", type: "delivery" },
  { id: "BONUS-01", address: "Peak Hour Bonus", time: "Yesterday, 12:00 PM", amount: 200, status: "bonus", type: "bonus" },
];

const breakdownItems: BreakdownItem[] = [
  { label: "Delivery Fare", amount: 5680, pct: 74, color: colors.primary, icon: "cube-outline" },
  { label: "Surge Bonus", amount: 800, pct: 10, color: colors.driverAccent, icon: "flash-outline" },
  { label: "Peak Hour", amount: 600, pct: 8, color: colors.warning, icon: "time-outline" },
  { label: "Tips", amount: 220, pct: 3, color: colors.success, icon: "heart-outline" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Single bar in the chart */
const BarItem = ({
  data,
  maxAmount,
  isSelected,
  onPress,
}: {
  data: DayData;
  maxAmount: number;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const barHeightPct = (data.amount / maxAmount) * 100;
  const barPx = (barHeightPct / 100) * CHART_HEIGHT;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={styles.barWrapper}
    >
      {/* Tooltip */}
      {isSelected && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>
            ₹{(data.amount / 1000).toFixed(1)}k
          </Text>
        </View>
      )}

      {/* Bar */}
      <View style={styles.barTrack}>
        <View
          style={[
            styles.bar,
            { height: barPx },
            isSelected ? styles.barSelected : styles.barDefault,
          ]}
        />
      </View>

      {/* Day label */}
      <Text style={[styles.barLabel, isSelected && styles.barLabelSelected]}>
        {data.day}
      </Text>
    </TouchableOpacity>
  );
};

/** Earnings breakdown card */
const BreakdownCard = ({ item }: { item: BreakdownItem }) => {

   return ( 
  <View style={styles.breakdownCard} >
    <View style={styles.breakdownTop}>
      <View style={[styles.breakdownIconWrap, { backgroundColor: item.color + "18" }]}>
        <Ionicons name={item.icon} size={18} color={item.color}  />
      </View>
      <View style={[styles.pctBadge, { backgroundColor: item.color + "18" }]}>
        <Text style={[styles.pctText, { color: item.color }]}>{item.pct}%</Text>
      </View>
    </View>
    <Text style={styles.breakdownAmount}>
      ₹{item.amount.toLocaleString("en-IN")}
    </Text>
    <Text style={styles.breakdownLabel}>{item.label}</Text>
    {/* Progress bar */}
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${item.pct}%` as any, backgroundColor: item.color }]} />
    </View>
  </View>)
};

/** Transaction row */
const TransactionRow = ({ tx }: { tx: Transaction }) => {
  const isBonus = tx.status === "bonus";
  const isCancelled = tx.status === "cancelled";

  const statusColor = isCancelled
    ? colors.danger
    : isBonus
    ? colors.driverAccent
    : colors.success;

  const iconName: keyof typeof Ionicons.glyphMap = isBonus
    ? "flash"
    : isCancelled
    ? "close"
    : "checkmark";

  return (
    <View style={styles.txRow}>
      {/* Icon */}
      <View style={[styles.txIcon, { backgroundColor: statusColor + "15" }]}>
        <Ionicons name={iconName} size={18} color={statusColor} />
      </View>

      {/* Info */}
      <View style={styles.txInfo}>
        <Text style={styles.txId}>{tx.id}</Text>
        <Text style={styles.txAddress} numberOfLines={1}>{tx.address}</Text>
        <Text style={styles.txTime}>{tx.time}</Text>
      </View>

      {/* Amount */}
      <View style={styles.txAmountWrap}>
        <Text style={[styles.txAmount, { color: isCancelled ? colors.danger : statusColor }]}>
          {isCancelled ? "-" : "+"}₹{tx.amount}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + "15" }]}>
          <Text style={[styles.statusBadgeText, { color: statusColor }]}>
            {tx.status}
          </Text>
        </View>
      </View>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DriverEarningsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>("week");
  const [selectedBar, setSelectedBar] = useState<number>(4);
  const scrollY = useRef(new Animated.Value(0)).current;

  const maxAmount = Math.max(...weekData.map((d) => d.amount));
  const totalWeek = weekData.reduce((s, d) => s + d.amount, 0);
  const totalTrips = weekData.reduce((s, d) => s + d.trips, 0);
  const avgPerTrip = Math.round(totalWeek / totalTrips);
  

  const quickStats = [
    { label: "Trips", value: `${totalTrips}`, icon: "car-outline" as const, color: colors.primary },
    { label: "Avg/Trip", value: `₹${avgPerTrip}`, icon: "bar-chart-outline" as const, color: colors.driverAccent },
    { label: "Online", value: "5.2h", icon: "time-outline" as const, color: colors.warning },
    { label: "Rating", value: "4.9", icon: "star-outline" as const, color: colors.success },
  ];

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        {/* Decorative blobs */}
        <View style={styles.blobTopRight} />
        <View style={styles.blobSmall} />
        <View style={styles.blobBottomLeft} />

        <View style={styles.headerNav}>
          <TouchableOpacity style={styles.navBtn} activeOpacity={0.7} onPress={()=>router.back()}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Earnings</Text>
          <TouchableOpacity style={styles.withdrawBtn} activeOpacity={0.8}>
            <Ionicons name="wallet-outline" size={15} color="#fff" />
            <Text style={styles.withdrawText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerBody}>
          <Text style={styles.headerPeriodLabel}>THIS WEEK</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currencySign}>₹</Text>
            <Text style={styles.totalAmount}>
              {totalWeek.toLocaleString("en-IN")}
            </Text>
          </View>
          <View style={styles.growthRow}>
            <View style={styles.growthBadge}>
              <Ionicons name="trending-up-outline" size={12} color="#fff" />
              <Text style={styles.growthText}>18%</Text>
            </View>
            <Text style={styles.growthSubtitle}>vs last week</Text>
          </View>
        </View>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {/* ── FLOATING STATS CARD ── */}
        <View style={styles.statsCard}>
          {quickStats.map((stat, i) => (
            <React.Fragment key={i}>
              <View style={styles.statItem}>
                <View style={[styles.statIconWrap, { backgroundColor: stat.color + "15" }]}>
                  <Ionicons name={stat.icon} size={16} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
              {i < quickStats.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        <View style={styles.body}>

          {/* ── TAB SWITCHER ── */}
          <View style={styles.tabContainer}>
            {(["week", "month", "year"] as TabType[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── BAR CHART CARD ── */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Daily Breakdown</Text>
              {selectedBar !== null && (
                <View style={styles.selectedAmountBadge}>
                  <Text style={styles.selectedAmountText}>
                    ₹{weekData[selectedBar].amount.toLocaleString("en-IN")} · {weekData[selectedBar].trips} trips
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.chartBars}>
              {weekData.map((d, i) => (
                <BarItem
                  key={i}
                  data={d}
                  maxAmount={maxAmount}
                  isSelected={selectedBar === i}
                  onPress={() => setSelectedBar(i)}
                />
              ))}
            </View>
          </View>

          {/* ── EARNINGS BREAKDOWN ── */}
          <Text style={styles.sectionTitle}>Earnings Breakdown</Text>
          <View style={styles.breakdownGrid}>
            {breakdownItems.map((item, i) => (
              <BreakdownCard key={i} item={item} />
            ))}
          </View>

          {/* ── TRANSACTIONS ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transactions</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={()=>router.push("/(driver)/delivery/123")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.txList}>
            {transactions.map((tx, i) => (
              <TransactionRow key={i} tx={tx} />
            ))}
          </View>

        </View>
      </Animated.ScrollView>
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
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 72,
    overflow: "hidden",
    position: "relative",
  },
  blobTopRight: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  blobSmall: {
    position: "absolute",
    top: 20,
    right: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  headerNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  withdrawBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  withdrawText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  headerBody: {
    alignItems: "flex-start",
  },
  headerPeriodLabel: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  currencySign: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 46,
    marginRight: 2,
  },
  totalAmount: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "800",
    letterSpacing: -2,
    lineHeight: 52,
  },
  growthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  growthBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.successLight,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  growthText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  growthSubtitle: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
  },

  // Floating stats card
  statsCard: {
    marginHorizontal: 16,
    marginTop: -44,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 10,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },

  // Body
  body: {
    padding: 16,
    paddingTop: 20,
  },

  // Tab
  tabContainer: {
    flexDirection: "row",
    backgroundColor: colors.border,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
    gap: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: -0.2,
  },
  tabTextActive: {
    color: "#fff",
  },

  // Chart
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  selectedAmountBadge: {
    backgroundColor: colors.primary + "12",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  selectedAmountText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },
  chartBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: CHART_HEIGHT + 40,
    gap: 6,
  },

  // Bar
  barWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: CHART_HEIGHT + 40,
  },
  tooltip: {
    backgroundColor: colors.primaryDark,
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginBottom: 4,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
  },
  barTrack: {
    width: "100%",
    height: CHART_HEIGHT,
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderRadius: 8,
    minHeight: 8,
  },
  barDefault: {
    backgroundColor: "#BFDBFE",
  },
  barSelected: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  barLabel: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: "500",
    color: colors.textLight,
  },
  barLabelSelected: {
    color: colors.primary,
    fontWeight: "700",
  },

  // Breakdown
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  breakdownGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 28,
  },
  breakdownCard: {
    width: (SCREEN_WIDTH - 32 - 12) / 2,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  breakdownTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  breakdownIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  pctBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pctText: {
    fontSize: 11,
    fontWeight: "800",
  },
  breakdownAmount: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.8,
    marginBottom: 2,
  },
  breakdownLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
    marginBottom: 12,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    borderRadius: 4,
  },

  // Transactions
  txList: {
    gap: 10,
  },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  txInfo: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  txId: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  txAddress: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  txTime: {
    fontSize: 11,
    color: colors.textLight,
  },
  txAmountWrap: {
    alignItems: "flex-end",
    gap: 4,
    flexShrink: 0,
  },
  txAmount: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});