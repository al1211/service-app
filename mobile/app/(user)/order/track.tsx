import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Animated,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import colors from '../../../src/theme/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

type TrackingStep =
  | 'confirmed'
  | 'assigned'
  | 'on_the_way'
  | 'arrived'
  | 'in_service'
  | 'completed';

interface TimelineStep {
  key: TrackingStep;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  time?: string;
}

interface OrderInfo {
  id: string;
  title: string;
  category: string;
  provider: string;
  providerInitial: string;
  providerPhone: string;
  providerRating: number;
  providerJobs: number;
  address: string;
  scheduledTime: string;
  amount: number;
  eta: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const orderInfo: OrderInfo = {
  id: 'ORD-5231',
  title: 'Home Deep Cleaning',
  category: 'Cleaning Service',
  provider: 'Ramesh Kumar',
  providerInitial: 'R',
  providerPhone: '+91 98765 43210',
  providerRating: 4.9,
  providerJobs: 1240,
  address: 'Sector 62, Noida, Uttar Pradesh 201301',
  scheduledTime: 'Today, 3:00 PM',
  amount: 499,
  eta: '12 min away',
  icon: 'sparkles-outline',
  iconColor: colors.primary,
  iconBg: colors.primary + '15',
};

const timelineSteps: TimelineStep[] = [
  {
    key: 'confirmed',
    label: 'Order Confirmed',
    description: 'Your booking has been confirmed',
    icon: 'checkmark-circle',
    time: '2:30 PM',
  },
  {
    key: 'assigned',
    label: 'Provider Assigned',
    description: 'Ramesh Kumar has accepted your order',
    icon: 'person-circle',
    time: '2:35 PM',
  },
  {
    key: 'on_the_way',
    label: 'On The Way',
    description: 'Provider is heading to your location',
    icon: 'navigate-circle',
    time: '2:48 PM',
  },
  {
    key: 'arrived',
    label: 'Arrived',
    description: 'Provider has reached your location',
    icon: 'location',
    time: '',
  },
  {
    key: 'in_service',
    label: 'Service Started',
    description: 'Your service is in progress',
    icon: 'construct',
    time: '',
  },
  {
    key: 'completed',
    label: 'Completed',
    description: 'Service completed successfully',
    icon: 'ribbon',
    time: '',
  },
];

const STEP_ORDER: TrackingStep[] = [
  'confirmed',
  'assigned',
  'on_the_way',
  'arrived',
  'in_service',
  'completed',
];

// ─── Animated Pulse Dot ───────────────────────────────────────────────────────

const PulseDot = ({ color }: { color: string }) => {
  const pulse = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, { toValue: 2.2, duration: 900, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0, duration: 900, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={pulseStyles.wrap}>
      <Animated.View
        style={[
          pulseStyles.ring,
          {
            borderColor: color,
            transform: [{ scale: pulse }],
            opacity,
          },
        ]}
      />
      <View style={[pulseStyles.dot, { backgroundColor: color }]} />
    </View>
  );
};

const pulseStyles = StyleSheet.create({
  wrap: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

// ─── Map Placeholder ──────────────────────────────────────────────────────────

const MapPlaceholder = () => {
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(moveAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const translateX = moveAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 30] });
  const translateY = moveAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -15] });

  return (
    <View style={mapStyles.container}>
      {/* Faux map grid */}
      {[...Array(6)].map((_, i) => (
        <View key={`h${i}`} style={[mapStyles.hLine, { top: i * 46 }]} />
      ))}
      {[...Array(8)].map((_, i) => (
        <View key={`v${i}`} style={[mapStyles.vLine, { left: i * 52 }]} />
      ))}

      {/* Route line */}
      <View style={mapStyles.routeLine} />

      {/* Destination pin */}
      <View style={mapStyles.destPin}>
        <View style={mapStyles.destPinHead}>
          <Ionicons name="home" size={14} color="#fff" />
        </View>
        <View style={mapStyles.destPinTail} />
      </View>

      {/* Moving provider dot */}
      <Animated.View
        style={[
          mapStyles.providerDot,
          { transform: [{ translateX }, { translateY }] },
        ]}
      >
        <View style={mapStyles.providerDotInner}>
          <Ionicons name="bicycle" size={14} color="#fff" />
        </View>
        <View style={mapStyles.providerDotRing} />
      </Animated.View>

      {/* ETA chip */}
      <View style={mapStyles.etaChip}>
        <Ionicons name="time-outline" size={13} color={colors.primary} />
        <Text style={mapStyles.etaText}>{orderInfo.eta}</Text>
      </View>

      {/* Map label */}
      <View style={mapStyles.liveChip}>
        <View style={mapStyles.liveDot} />
        <Text style={mapStyles.liveText}>LIVE</Text>
      </View>
    </View>
  );
};

const mapStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    backgroundColor: '#EFF6FF',
    overflow: 'hidden',
    position: 'relative',
  },
  hLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#BFDBFE',
    opacity: 0.6,
  },
  vLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#BFDBFE',
    opacity: 0.6,
  },
  routeLine: {
    position: 'absolute',
    left: 60,
    top: 80,
    width: 200,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
    opacity: 0.6,
    transform: [{ rotate: '-15deg' }],
  },
  destPin: {
    position: 'absolute',
    right: 80,
    top: 60,
    alignItems: 'center',
  },
  destPinHead: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  destPinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.danger,
    marginTop: -1,
  },
  providerDot: {
    position: 'absolute',
    left: 70,
    top: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerDotInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  providerDotRing: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.primary,
    opacity: 0.25,
  },
  etaChip: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  etaText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  liveChip: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.danger,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function TrackOrderScreen() {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState<TrackingStep>('on_the_way');
  const [showTimeline, setShowTimeline] = useState(false);
  const timelineAnim = useRef(new Animated.Value(0)).current;

  const currentStepIndex = STEP_ORDER.indexOf(currentStep);

  const toggleTimeline = () => {
    const toValue = showTimeline ? 0 : 1;
    setShowTimeline(!showTimeline);
    Animated.spring(timelineAnim, {
      toValue,
      useNativeDriver: false,
      tension: 60,
      friction: 10,
    }).start();
  };

  // Demo: simulate progress
  const simulateNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEP_ORDER.length) {
      setCurrentStep(STEP_ORDER[nextIndex]);
    }
  };

  const currentStepData = timelineSteps.find((s) => s.key === currentStep)!;

  const getStepState = (step: TimelineStep) => {
    const stepIdx = STEP_ORDER.indexOf(step.key);
    if (stepIdx < currentStepIndex) return 'done';
    if (stepIdx === currentStepIndex) return 'active';
    return 'pending';
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Track Order</Text>
          <Text style={styles.headerId}>{orderInfo.id}</Text>
        </View>
        <TouchableOpacity style={styles.helpBtn} activeOpacity={0.8}>
          <Ionicons name="help-circle-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* ── MAP ── */}
        <MapPlaceholder />

        {/* ── CURRENT STATUS CARD (overlaps map) ── */}
        <View style={styles.statusCard}>
          {/* Live status pill */}
          <View style={styles.statusPill}>
            <PulseDot color={colors.primary} />
            <Text style={styles.statusPillText}>{currentStepData.label}</Text>
          </View>

          {/* ETA + order brief */}
          <View style={styles.statusMain}>
            <View style={styles.etaBlock}>
              <Text style={styles.etaLabel}>Estimated Arrival</Text>
              <Text style={styles.etaBig}>{orderInfo.eta}</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.orderBrief}>
              <View style={[styles.orderBriefIcon, { backgroundColor: orderInfo.iconBg }]}>
                <Ionicons name={orderInfo.icon} size={20} color={orderInfo.iconColor} />
              </View>
              <View>
                <Text style={styles.orderBriefTitle} numberOfLines={1}>
                  {orderInfo.title}
                </Text>
                <Text style={styles.orderBriefSub}>{orderInfo.category}</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.statusDescription}>{currentStepData.description}</Text>

          {/* Timeline toggle */}
          <TouchableOpacity
            style={styles.timelineToggle}
            onPress={toggleTimeline}
            activeOpacity={0.8}
          >
            <Text style={styles.timelineToggleText}>
              {showTimeline ? 'Hide' : 'View'} Full Timeline
            </Text>
            <Ionicons
              name={showTimeline ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={colors.primary}
            />
          </TouchableOpacity>

          {/* ── TIMELINE ── */}
          {showTimeline && (
            <View style={styles.timeline}>
              {timelineSteps.map((step, i) => {
                const state = getStepState(step);
                const isLast = i === timelineSteps.length - 1;
                const stepColor =
                  state === 'done'
                    ? colors.success
                    : state === 'active'
                    ? colors.primary
                    : colors.border;

                return (
                  <View key={step.key} style={styles.timelineRow}>
                    {/* Left: dot + line */}
                    <View style={styles.timelineLeft}>
                      <View
                        style={[
                          styles.timelineDot,
                          {
                            backgroundColor:
                              state === 'pending' ? colors.background : stepColor,
                            borderColor: stepColor,
                          },
                        ]}
                      >
                        {state === 'done' && (
                          <Ionicons name="checkmark" size={10} color="#fff" />
                        )}
                        {state === 'active' && (
                          <View style={styles.timelineActiveDot} />
                        )}
                      </View>
                      {!isLast && (
                        <View
                          style={[
                            styles.timelineLine,
                            {
                              backgroundColor:
                                state === 'done' ? colors.success : colors.border,
                            },
                          ]}
                        />
                      )}
                    </View>

                    {/* Right: content */}
                    <View style={styles.timelineContent}>
                      <View style={styles.timelineTopRow}>
                        <Text
                          style={[
                            styles.timelineLabel,
                            state === 'active' && { color: colors.primary },
                            state === 'pending' && { color: colors.textLight },
                          ]}
                        >
                          {step.label}
                        </Text>
                        {step.time ? (
                          <Text style={styles.timelineTime}>{step.time}</Text>
                        ) : state === 'active' ? (
                          <View style={styles.nowBadge}>
                            <Text style={styles.nowText}>NOW</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text
                        style={[
                          styles.timelineDesc,
                          state === 'pending' && { color: colors.border },
                        ]}
                      >
                        {step.description}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* ── PROVIDER CARD ── */}
        <View style={styles.providerCard}>
          <Text style={styles.sectionTitle}>Your Provider</Text>
          <View style={styles.providerRow}>
            {/* Avatar */}
            <View style={styles.providerAvatar}>
              <Text style={styles.providerInitial}>{orderInfo.providerInitial}</Text>
              <View style={styles.onlineBadge} />
            </View>

            {/* Info */}
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{orderInfo.provider}</Text>
              <View style={styles.providerMeta}>
                <Ionicons name="star" size={12} color={colors.warning} />
                <Text style={styles.providerRating}>{orderInfo.providerRating}</Text>
                <Text style={styles.providerJobs}>
                  · {orderInfo.providerJobs.toLocaleString('en-IN')} jobs
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.providerActions}>
              <TouchableOpacity
                style={[styles.providerBtn, { backgroundColor: colors.success + '15' }]}
                activeOpacity={0.8}
                onPress={() => Linking.openURL(`tel:${orderInfo.providerPhone}`)}
              >
                <Ionicons name="call" size={18} color={colors.success} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.providerBtn, { backgroundColor: colors.primary + '15' }]}
                activeOpacity={0.8}
              >
                <Ionicons name="chatbubble-ellipses" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── ADDRESS CARD ── */}
        <View style={styles.addressCard}>
          <Text style={styles.sectionTitle}>Service Location</Text>
          <View style={styles.addressRow}>
            <View style={styles.addressIconWrap}>
              <Ionicons name="location-sharp" size={18} color={colors.danger} />
            </View>
            <View style={styles.addressInfo}>
              <Text style={styles.addressText}>{orderInfo.address}</Text>
              <Text style={styles.scheduledTime}>
                <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
                {' '}{orderInfo.scheduledTime}
              </Text>
            </View>
            <TouchableOpacity style={styles.directionBtn} activeOpacity={0.8}>
              <Ionicons name="navigate-outline" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── ORDER SUMMARY ── */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {[
            { label: 'Home Deep Cleaning', amount: 399 },
            { label: 'Equipment Charges', amount: 60 },
            { label: 'Platform Fee', amount: 40 },
          ].map((item, i) => (
            <View key={i} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={styles.summaryValue}>₹{item.amount}</Text>
            </View>
          ))}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>Total Paid</Text>
            <Text style={styles.summaryTotalValue}>₹{orderInfo.amount}</Text>
          </View>
        </View>

        {/* Demo next step button */}
        {currentStepIndex < STEP_ORDER.length - 1 && (
          <TouchableOpacity
            style={styles.demoBtn}
            activeOpacity={0.8}
            onPress={simulateNext}
          >
            <Ionicons name="play-forward-outline" size={16} color={colors.driverAccent} />
            <Text style={styles.demoBtnText}>Simulate Next Step (Demo)</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* ── BOTTOM ACTIONS ── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity style={styles.cancelOrderBtn} activeOpacity={0.8}>
          <Ionicons name="close-outline" size={18} color={colors.danger} />
          <Text style={styles.cancelOrderText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.supportBtn} activeOpacity={0.85}>
          <Ionicons name="headset-outline" size={18} color="#fff" />
          <Text style={styles.supportBtnText}>Get Support</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerId: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 1,
  },
  helpBtn: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Status card
  statusCard: {
    marginHorizontal: 16,
    marginTop: -20,
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 18,
    elevation: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 10,
    marginBottom: 16,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.primary + '10',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary + '25',
  },
  statusPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.2,
  },
  statusMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  etaBlock: {
    flex: 1,
  },
  etaLabel: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  etaBig: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.8,
  },
  statusDivider: {
    width: 1,
    height: 44,
    backgroundColor: colors.border,
  },
  orderBrief: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orderBriefIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  orderBriefTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  orderBriefSub: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  statusDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 14,
  },

  // Timeline toggle
  timelineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  timelineToggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },

  // Timeline
  timeline: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 14,
    minHeight: 60,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 20,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  timelineActiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 3,
    borderRadius: 1,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  timelineLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  timelineTime: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '600',
  },
  nowBadge: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  nowText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  timelineDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 17,
  },

  // Provider card
  providerCard: {
    marginHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  providerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: colors.primary + '18',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  providerInitial: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.card,
  },
  providerInfo: {
    flex: 1,
    gap: 4,
  },
  providerName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  providerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  providerRating: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  providerJobs: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  providerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  providerBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Address card
  addressCard: {
    marginHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addressIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.danger + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressInfo: {
    flex: 1,
    gap: 3,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  scheduledTime: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  directionBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Summary card
  summaryCard: {
    marginHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.6,
  },

  // Demo button
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.driverAccent + '40',
    borderStyle: 'dashed',
    backgroundColor: colors.driverAccent + '08',
  },
  demoBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.driverAccent,
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  cancelOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  cancelOrderText: {
    color: colors.danger,
    fontWeight: '800',
    fontSize: 15,
  },
  supportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: colors.primary,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  supportBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: -0.2,
  },
});