import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ionicons } from "@expo/vector-icons";
import colors from "../../../src/theme/colors"; // Path check kar lein
import { router } from "expo-router";

export default function DriverDashboard() {
 const insets=useSafeAreaInsets();
  const [isOnline, setIsOnline] = useState(false);



  return (
    <View style={[styles.container,{paddingTop:insets.top}]}>
      {/* 1. Top Status Bar (Online/Offline) */}
      <View style={[styles.statusHeader, { backgroundColor: isOnline ? colors.success : colors.textSecondary }]}>
        <Text style={styles.statusText}>
          {isOnline ? "You are Online" : "You are Offline"}
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#FFF" }}
          thumbColor={isOnline ? colors.card : "#f4f3f4"}
          onValueChange={() => setIsOnline(!isOnline)}
          value={isOnline}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 2. Earnings Overview Card */}
        <View style={styles.earningsCard}>
          <Text style={styles.cardLabel}>Today's Earnings</Text>
          <Text style={styles.earningsAmount}>₹1,240.50</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5.2h</Text>
              <Text style={styles.statLabel}>Online</Text>
            </View>
          </View>
        </View>

        {/* 3. Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionButton} onPress={()=>router.push("/(driver)/(tabs)/earning")}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + "15" }]}>
              <Ionicons name="wallet-outline" size={24} color={colors.primary} />
            </View>
            <Text style={styles.actionText} >Payout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.iconCircle, { backgroundColor: colors.warning + "15" }]}>
              <Ionicons name="star-outline" size={24} color={colors.warning} />
            </View>
            <Text style={styles.actionText}>Ratings</Text>
          </TouchableOpacity>
        </View>

        {/* 4. Recent Orders List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Deliveries</Text>
          <TouchableOpacity>
            <Text style={{ color: colors.primary, fontWeight: "600" }}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Order Item Example */}
        {[1, 2].map((item) => (
          <View key={item} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Order #ORD-523{item}</Text>
              <Text style={[styles.orderStatus, { color: colors.success }]}>Completed</Text>
            </View>
            <View style={styles.orderBody}>
              <Ionicons name="location-sharp" size={18} color={colors.danger} />
              <Text style={styles.addressText} numberOfLines={1}>
                Sector 62, Noida, Uttar Pradesh
              </Text>
            </View>
            <View style={styles.orderFooter}>
              <Text style={styles.orderDate}>Today, 02:45 PM</Text>
              <Text style={styles.orderPrice}>₹145.00</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    // marginTop: Platform.OS === 'android' ? 40 : 0,
  },
  statusText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  scrollContent: {
    padding: 20,
  },
  earningsCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 25,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  cardLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginBottom: 8,
  },
  earningsAmount: {
    color: "#FFF",
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    paddingTop: 20,
    width: "100%",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  divider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 25,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontWeight: "600",
    color: colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderId: {
    fontWeight: "700",
    color: colors.textPrimary,
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: "600",
  },
  orderBody: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  addressText: {
    color: colors.textSecondary,
    fontSize: 14,
    flex: 1,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  orderDate: {
    color: colors.textLight,
    fontSize: 12,
  },
  orderPrice: {
    fontWeight: "700",
    color: colors.textPrimary,
  },
});