import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../src/theme/colors';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

interface CartItem {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  qty: number;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  isVeg: boolean;
  customization?: string;
}

interface PromoCode {
  code: string;
  discount: number;
  type: 'flat' | 'percent';
  label: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const initialCart: CartItem[] = [
  {
    id: '1',
    name: 'Paneer Butter Masala',
    restaurant: "Punjabi Tadka",
    price: 280,
    qty: 1,
    icon: 'restaurant-outline',
    iconColor: colors.warning,
    iconBg: colors.warning + '15',
    isVeg: true,
    customization: 'Extra spicy, No onion',
  },
  {
    id: '2',
    name: 'Chicken Biryani',
    restaurant: "Punjabi Tadka",
    price: 320,
    qty: 2,
    icon: 'restaurant-outline',
    iconColor: colors.danger,
    iconBg: colors.danger + '12',
    isVeg: false,
  },
  {
    id: '3',
    name: 'Garlic Naan (x2)',
    restaurant: "Punjabi Tadka",
    price: 80,
    qty: 1,
    icon: 'pizza-outline',
    iconColor: colors.success,
    iconBg: colors.success + '12',
    isVeg: true,
  },
  {
    id: '4',
    name: 'Mango Lassi',
    restaurant: "Punjabi Tadka",
    price: 120,
    qty: 1,
    icon: 'cafe-outline',
    iconColor: colors.driverAccent,
    iconBg: colors.driverAccent + '12',
    isVeg: true,
  },
];

const promoCodes: PromoCode[] = [
  { code: 'FIRST50', discount: 50, type: 'flat', label: '₹50 off on first order' },
  { code: 'SAVE20', discount: 20, type: 'percent', label: '20% off up to ₹80' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const VegBadge = ({ isVeg }: { isVeg: boolean }) => (
  <View style={[vegStyles.badge, { borderColor: isVeg ? colors.success : colors.danger }]}>
    <View style={[vegStyles.dot, { backgroundColor: isVeg ? colors.success : colors.danger }]} />
  </View>
);

const vegStyles = StyleSheet.create({
  badge: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
});

const QtyControl = ({
  qty,
  onInc,
  onDec,
}: {
  qty: number;
  onInc: () => void;
  onDec: () => void;
}) => (
  <View style={qtyStyles.container}>
    <TouchableOpacity onPress={onDec} style={qtyStyles.btn} activeOpacity={0.75}>
      <Ionicons
        name={qty === 1 ? 'trash-outline' : 'remove'}
        size={14}
        color={qty === 1 ? colors.danger : colors.primary}
      />
    </TouchableOpacity>
    <Text style={qtyStyles.value}>{qty}</Text>
    <TouchableOpacity onPress={onInc} style={[qtyStyles.btn, qtyStyles.btnAdd]} activeOpacity={0.75}>
      <Ionicons name="add" size={14} color="#fff" />
    </TouchableOpacity>
  </View>
);

const qtyStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  btn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAdd: {
    backgroundColor: colors.primary,
  },
  value: {
    width: 28,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');
  const [selectedTip, setSelectedTip] = useState<number | null>(20);
  const [selectedPayment, setSelectedPayment] = useState<'online' | 'cash'>('online');

  // ── Calculations ──
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const platformFee = 5;
  const tipAmount = selectedTip ?? 0;

  let discount = 0;
  if (appliedPromo) {
    discount =
      appliedPromo.type === 'flat'
        ? appliedPromo.discount
        : Math.min(Math.round((subtotal * appliedPromo.discount) / 100), 80);
  }

  const total = subtotal + deliveryFee + platformFee + tipAmount - discount;

  // ── Handlers ──
  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const applyPromo = () => {
    const found = promoCodes.find(
      (p) => p.code.toLowerCase() === promoInput.trim().toLowerCase()
    );
    if (found) {
      setAppliedPromo(found);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try FIRST50 or SAVE20');
      setAppliedPromo(null);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError('');
  };

  const tips = [0, 10, 20, 30, 50];

  if (cart.length === 0) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.emptyHeader}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.emptyHeaderTitle}>Your Cart</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="cart-outline" size={48} color={colors.textLight} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add items from a restaurant to get started</Text>
          <TouchableOpacity style={styles.emptyBtn} activeOpacity={0.85}>
            <Text style={styles.emptyBtnText}>Browse Services</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <Text style={styles.headerSub}>{cart.length} items · Punjabi Tadka</Text>
        </View>
        <TouchableOpacity
          onPress={() => setCart([])}
          style={styles.clearBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.clearBtnText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* ── DELIVERY ADDRESS ── */}
        <TouchableOpacity style={styles.addressCard} activeOpacity={0.82}>
          <View style={styles.addressIconWrap}>
            <Ionicons name="location-sharp" size={18} color={colors.primary} />
          </View>
          <View style={styles.addressContent}>
            <Text style={styles.addressLabel}>Delivering to</Text>
            <Text style={styles.addressText} numberOfLines={1}>
              Sector 62, Noida, Uttar Pradesh
            </Text>
          </View>
          <View style={styles.changeBtn}>
            <Text style={styles.changeBtnText}>Change</Text>
          </View>
        </TouchableOpacity>

        {/* ── CART ITEMS ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <View style={styles.itemsCard}>
            {cart.map((item, i) => (
              <React.Fragment key={item.id}>
                <View style={styles.cartItem}>
                  {/* Icon */}
                  <View style={[styles.itemIcon, { backgroundColor: item.iconBg }]}>
                    <Ionicons name={item.icon} size={20} color={item.iconColor} />
                  </View>

                  {/* Info */}
                  <View style={styles.itemInfo}>
                    <View style={styles.itemNameRow}>
                      <VegBadge isVeg={item.isVeg} />
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>
                    {item.customization && (
                      <Text style={styles.itemCustomization} numberOfLines={1}>
                        {item.customization}
                      </Text>
                    )}
                    <Text style={styles.itemPrice}>
                      ₹{item.price}
                      {item.qty > 1 && (
                        <Text style={styles.itemPriceEach}> × {item.qty}</Text>
                      )}
                    </Text>
                  </View>

                  {/* Qty */}
                  <View style={styles.itemRight}>
                    <QtyControl
                      qty={item.qty}
                      onInc={() => updateQty(item.id, 1)}
                      onDec={() => updateQty(item.id, -1)}
                    />
                    <Text style={styles.itemTotal}>
                      ₹{item.price * item.qty}
                    </Text>
                  </View>
                </View>
                {i < cart.length - 1 && <View style={styles.itemDivider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── ADD MORE ── */}
        <TouchableOpacity style={styles.addMoreBtn} activeOpacity={0.8}>
          <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
          <Text style={styles.addMoreText}>Add more items</Text>
        </TouchableOpacity>

        {/* ── PROMO CODE ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promo Code</Text>
          <View style={styles.promoCard}>
            {appliedPromo ? (
              <View style={styles.promoApplied}>
                <View style={styles.promoAppliedLeft}>
                  <View style={styles.promoCheckWrap}>
                    <Ionicons name="checkmark-circle" size={22} color={colors.success} />
                  </View>
                  <View>
                    <Text style={styles.promoAppliedCode}>{appliedPromo.code}</Text>
                    <Text style={styles.promoAppliedLabel}>{appliedPromo.label}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={removePromo} activeOpacity={0.8}>
                  <Ionicons name="close-circle" size={22} color={colors.textLight} />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.promoInputRow}>
                  <Ionicons name="pricetag-outline" size={18} color={colors.textLight} />
                  <TextInput
                    value={promoInput}
                    onChangeText={(t) => {
                      setPromoInput(t);
                      setPromoError('');
                    }}
                    placeholder="Enter promo code"
                    placeholderTextColor={colors.textLight}
                    style={styles.promoInput}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity
                    onPress={applyPromo}
                    style={[
                      styles.promoApplyBtn,
                      { opacity: promoInput.trim().length > 0 ? 1 : 0.4 },
                    ]}
                    activeOpacity={0.85}
                    disabled={promoInput.trim().length === 0}
                  >
                    <Text style={styles.promoApplyText}>Apply</Text>
                  </TouchableOpacity>
                </View>
                {promoError ? (
                  <Text style={styles.promoError}>{promoError}</Text>
                ) : null}
                {/* Quick codes */}
                <View style={styles.quickCodes}>
                  {promoCodes.map((p) => (
                    <TouchableOpacity
                      key={p.code}
                      onPress={() => setPromoInput(p.code)}
                      style={styles.quickCodeChip}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="flash-outline" size={11} color={colors.primary} />
                      <Text style={styles.quickCodeText}>{p.code}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>

        {/* ── DELIVERY TIP ── */}
        <View style={styles.section}>
          <View style={styles.tipHeader}>
            <Text style={styles.sectionTitle}>Tip Your Delivery Partner</Text>
            <Text style={styles.tipSubtitle}>100% goes to them 💛</Text>
          </View>
          <View style={styles.tipRow}>
            {tips.map((tip) => (
              <TouchableOpacity
                key={tip}
                onPress={() => setSelectedTip(tip === selectedTip ? null : tip)}
                style={[
                  styles.tipChip,
                  selectedTip === tip && styles.tipChipSelected,
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tipChipText,
                    selectedTip === tip && styles.tipChipTextSelected,
                  ]}
                >
                  {tip === 0 ? 'No Tip' : `₹${tip}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── PAYMENT MODE ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentCard}>
            {[
              { key: 'online' as const, label: 'Pay Online', sub: 'UPI / Cards / Wallets', icon: 'card-outline' as const, color: colors.primary },
              { key: 'cash' as const, label: 'Cash on Delivery', sub: 'Pay when delivered', icon: 'cash-outline' as const, color: colors.success },
            ].map((pm, i) => (
              <React.Fragment key={pm.key}>
                <TouchableOpacity
                  onPress={() => setSelectedPayment(pm.key)}
                  style={styles.paymentRow}
                  activeOpacity={0.8}
                >
                  <View style={[styles.paymentIconWrap, { backgroundColor: pm.color + '15' }]}>
                    <Ionicons name={pm.icon} size={20} color={pm.color} />
                  </View>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentLabel}>{pm.label}</Text>
                    <Text style={styles.paymentSub}>{pm.sub}</Text>
                  </View>
                  <View
                    style={[
                      styles.radioOuter,
                      selectedPayment === pm.key && { borderColor: colors.primary },
                    ]}
                  >
                    {selectedPayment === pm.key && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                </TouchableOpacity>
                {i === 0 && <View style={styles.paymentDivider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── BILL SUMMARY ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Summary</Text>
          <View style={styles.billCard}>
            {[
              { label: 'Item Total', value: `₹${subtotal}`, color: colors.textPrimary },
              {
                label: 'Delivery Fee',
                value: deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`,
                color: deliveryFee === 0 ? colors.success : colors.textPrimary,
                sub: deliveryFee === 0 ? 'Free above ₹500' : undefined,
              },
              { label: 'Platform Fee', value: `₹${platformFee}`, color: colors.textPrimary },
              ...(selectedTip
                ? [{ label: 'Delivery Tip', value: `₹${tipAmount}`, color: colors.textPrimary }]
                : []),
              ...(discount > 0
                ? [{ label: `Discount (${appliedPromo?.code})`, value: `-₹${discount}`, color: colors.success }]
                : []),
            ].map((row, i) => (
              <View key={i} style={styles.billRow}>
                <View>
                  <Text style={styles.billLabel}>{row.label}</Text>
                  {row.sub && <Text style={styles.billSub}>{row.sub}</Text>}
                </View>
                <Text style={[styles.billValue, { color: row.color }]}>{row.value}</Text>
              </View>
            ))}

            <View style={styles.billDivider} />

            <View style={styles.billTotal}>
              <Text style={styles.billTotalLabel}>To Pay</Text>
              <Text style={styles.billTotalValue}>₹{total}</Text>
            </View>

            {discount > 0 && (
              <View style={styles.savingsBanner}>
                <Ionicons name="happy-outline" size={14} color={colors.success} />
                <Text style={styles.savingsText}>
                  You're saving ₹{discount} on this order!
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* ── PLACE ORDER BUTTON ── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.footerInner}>
          <View>
            <Text style={styles.footerTotal}>₹{total}</Text>
            <Text style={styles.footerItems}>{cart.length} items · {selectedPayment === 'cash' ? 'Cash' : 'Online'}</Text>
          </View>
          <TouchableOpacity style={styles.placeOrderBtn} activeOpacity={0.88} onPress={()=>router.push("/(user)/order/123")}>
            <Text style={styles.placeOrderText}>Place Order</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
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
    paddingBottom: 14,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  headerSub: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 1,
  },
  clearBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.danger + '12',
  },
  clearBtnText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },

  // Address
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    backgroundColor: colors.card,
    borderRadius: 16,
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
  addressIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressContent: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  changeBtn: {
    backgroundColor: colors.primary + '12',
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  changeBtnText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },

  // Section
  section: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 12,
  },

  // Cart Items
  itemsCard: {
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
  cartItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    gap: 12,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
    flex: 1,
  },
  itemCustomization: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  itemPriceEach: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 8,
    flexShrink: 0,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.3,
  },
  itemDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },

  // Add More
  addMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: colors.primary + '0C',
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: colors.primary + '25',
    borderStyle: 'dashed',
  },
  addMoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },

  // Promo
  promoCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  promoInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  promoInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    padding: 0,
    letterSpacing: 0.5,
  },
  promoApplyBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  promoApplyText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  promoError: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: '600',
    marginTop: 8,
  },
  quickCodes: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  quickCodeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary + '0E',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.primary + '25',
  },
  quickCodeText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.3,
  },
  promoApplied: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoAppliedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  promoCheckWrap: {},
  promoAppliedCode: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.success,
    letterSpacing: 0.5,
  },
  promoAppliedLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },

  // Tip
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tipChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipChipSelected: {
    backgroundColor: colors.warning + '15',
    borderColor: colors.warning,
  },
  tipChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tipChipTextSelected: {
    color: colors.warning,
  },

  // Payment
  paymentCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  paymentIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  paymentSub: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  paymentDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },

  // Bill
  billCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  billLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  billSub: {
    fontSize: 11,
    color: colors.success,
    fontWeight: '600',
    marginTop: 1,
  },
  billValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  billDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  billTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  billTotalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.8,
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.success + '10',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.success + '25',
    marginTop: 4,
  },
  savingsText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '700',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 14,
    paddingHorizontal: 16,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  footerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerTotal: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.8,
  },
  footerItems: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  placeOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 14,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },

  // Empty state
  emptyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  emptyHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyIconWrap: {
    width: 90,
    height: 90,
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
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  emptyBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
});