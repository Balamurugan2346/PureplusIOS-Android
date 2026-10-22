import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import StateView from '../../Components/StateView';
import QuantityStepper from '../../Components/QuantityStepper';
import KeyValueRows from '../../Components/Money/KeyValueRows';
import DeliveryAddressBar from '../../Components/DeliveryAddressBar';
import BottomSheet from '../../Components/BottomSheet';
import AddressScreen from '../Address/AddressScreen';
import formatCurrency from '../../Utils/formatCurrency';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';
import { refillService } from '../../API/modules/MiscService';
import GeoService from '../../API/modules/GeoService';
import { getSelectedAddressId, getSelectedAddress } from '../../Utils/GetSelectedAddress';

/**
 * CUS-25 · Refill order flow (prompt 05 restyle, pureLight). Refill ≠ new order: swaps
 * empty cans for full ones at the door. Deposit unchanged (can-for-can swap); you only
 * pay for the water. Balance/validate/place + serviceability logic preserved.
 */

const PAYMENT_TYPES = [
  { label: 'Cash (COD)', value: 'COD' },
  { label: 'UPI / Online', value: 'UPI' },
];

const RefillScreen = ({ navigation, route }) => {
  const { theme } = useTheme();

  const addressList = useSelector((st) => st.address?.addressList ?? []);

  // Slot placeholder (no live slot API for refill yet).
  const slots = [{ id: 'next', label: 'Next available' }];

  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [paymentType, setPaymentType] = useState('COD');
  const [selectedAddressId, setSelectedAddressId] = useState(-1);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [showAddressSheet, setShowAddressSheet] = useState(false);
  const [slotId, setSlotId] = useState(slots[0]?.id ?? null);
  const [placing, setPlacing] = useState(false);

  const [validateState, setValidateState] = useState(null);
  const [validating, setValidating] = useState(false);

  const selected = balances.find((b) => b.productId === selectedProductId) ?? null;
  const balance = selected?.balance ?? 0;
  const qtyNum = Number(quantity) || 0;

  const hasCans = balances.some((b) => (b.balance ?? 0) > 0);
  const allowed = validateState?.isAllowed === true && qtyNum > 0 && hasCans;

  const loadBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await refillService.balance();
      const list = Array.isArray(data) ? data : [];
      setBalances(list);
      const firstWithStock = list.find((b) => (b.balance ?? 0) > 0);
      setSelectedProductId(firstWithStock?.productId ?? null);
      setQuantity(firstWithStock ? '1' : '0');
    } catch (e) {
      setError(e?.message || 'Could not load your cans. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBalance(); }, [loadBalance]);

  const validateTimer = useRef(null);
  useEffect(() => {
    if (validateTimer.current) clearTimeout(validateTimer.current);
    if (!selectedProductId || qtyNum <= 0) {
      setValidateState(null);
      setValidating(false);
      return undefined;
    }
    setValidating(true);
    validateTimer.current = setTimeout(async () => {
      try {
        const v = await refillService.validate(selectedProductId, qtyNum);
        setValidateState(v ?? null);
      } catch (e) {
        setValidateState({ isAllowed: false, shortage: 0, depositRequired: 0 });
      } finally {
        setValidating(false);
      }
    }, 400);
    return () => {
      if (validateTimer.current) clearTimeout(validateTimer.current);
    };
  }, [selectedProductId, qtyNum]);

  const onSelectProduct = (pid) => {
    setSelectedProductId(pid);
    const b = balances.find((x) => x.productId === pid);
    const max = b?.balance ?? 0;
    if (max <= 0) {
      setQuantity('0');
    } else if (Number(quantity) > max) {
      setQuantity(String(max));
    } else if (Number(quantity) < 1) {
      setQuantity('1');
    }
  };

  // Stepper handlers — clamp to 1..balance (same range as the old numeric input).
  const incQty = () => {
    const max = Math.max(balance, 1);
    if (qtyNum < max) setQuantity(String(qtyNum + 1));
  };
  const decQty = () => {
    if (qtyNum > 1) setQuantity(String(qtyNum - 1));
  };

  const onSelectPayment = (v) => setPaymentType(v);

  const syncSelectedAddress = useCallback(async () => {
    const id = await getSelectedAddressId();
    const numId = Number(id);
    let addr = addressList.find((a) => String(a.id) === String(id)) || null;
    if (!addr) {
      const stored = await getSelectedAddress();
      addr = stored && typeof stored === 'object' && stored.id ? stored : null;
    }
    setSelectedAddressId(Number.isNaN(numId) ? -1 : numId);
    setSelectedAddr(addr);
  }, [addressList]);

  useEffect(() => { syncSelectedAddress(); }, [syncSelectedAddress]);

  const onPlace = async () => {
    if (!allowed || placing) return;

    if (!(selectedAddressId > 0)) {
      Alert.alert('No address', 'Please choose a delivery address first.');
      return;
    }

    setPlacing(true);
    try {
      const addr = selectedAddr || addressList.find((a) => a.id === selectedAddressId) || null;
      const pincode = addr?.pincode || addr?.pinCode || addr?.pin_code;
      if (!pincode) {
        Alert.alert('No address', 'Please choose a delivery address with a pincode first.');
        return;
      }

      const svc = await GeoService.resolveServiceability(String(pincode).trim());
      if (!svc?.serviceable || !svc?.storeId) {
        Alert.alert('Not serviceable', svc?.reason || "We don't deliver to this area yet.");
        return;
      }
      const storeId = svc.storeId;

      const res = await refillService.place({
        storeId,
        productId: selectedProductId,
        quantity: qtyNum,
        paymentType,
        addressId: selectedAddressId,
        slotId: typeof slotId === 'number' ? slotId : null,
      });

      Alert.alert(
        'Refill scheduled',
        `Order #${res?.orderId} placed. Your empties will be swapped at delivery.`,
        [{
          text: 'OK',
          onPress: () => (navigation?.navigate
            ? navigation.navigate('MyOrdersScreen')
            : navigation?.goBack?.()),
        }],
      );
    } catch (e) {
      Alert.alert('Could not place refill', e?.message || 'Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const emptyNoCans = !loading && !error && !hasCans;
  const depositRequired = validateState?.depositRequired ?? 0;
  const shortage = validateState?.shortage ?? 0;
  const payWord = paymentType === 'COD' ? 'in cash' : 'by UPI';

  return (
    <>
      <NavScreen title="Refill Cans" navigation={navigation} background={theme.surface}>
        <StateView loading={loading} error={error} onRetry={loadBalance}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl, gap: spacing.xl }}>

            {emptyNoCans && (
              <View style={[styles.sunken, { backgroundColor: theme.surfaceSunken }]}>
                <AppText variant="bodyStrong" color={theme.ink}>No cans to refill yet</AppText>
                <AppText variant="body" color={theme.inkMuted} style={{ marginTop: spacing.xs }}>
                  Place a standard order to get cans, then come back here to refill them.
                </AppText>
              </View>
            )}

            {/* 1 · Product chips */}
            <Section theme={theme} label="Product">
              <View style={styles.chipWrap}>
                {balances.map((b) => {
                  const active = selectedProductId === b.productId;
                  return (
                    <TouchableOpacity
                      key={b.productId}
                      onPress={() => onSelectProduct(b.productId)}
                      style={[styles.chip, {
                        borderColor: active ? theme.ink : theme.borderStrong,
                        backgroundColor: active ? theme.ink : theme.surfaceCard,
                      }]}
                    >
                      <AppText variant="label" color={active ? theme.onInk : theme.ink}>{b.productName}</AppText>
                      <View style={[styles.badge, { backgroundColor: active ? theme.onInk : theme.primaryTint }]}>
                        <AppText variant="caption" color={active ? theme.ink : theme.primary}>{b.balance} held</AppText>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Section>

            {/* 2 · Quantity */}
            <Section theme={theme} label="Cans to refill">
              <View style={[styles.qtyRow, { backgroundColor: theme.surfaceCard }]}>
                <AppText variant="caption" color={theme.inkMuted} style={{ flex: 1, marginRight: spacing.md }}>
                  You hold {balance} can{balance !== 1 ? 's' : ''}{selected ? ` of ${selected.productName}` : ''}
                </AppText>
                <QuantityStepper value={qtyNum} min={1} onIncrease={incQty} onDecrease={decQty} />
              </View>
            </Section>

            {/* 3 · Payment — segmented */}
            <Section theme={theme} label="Payment">
              <View style={[styles.segment, { backgroundColor: theme.surfaceSunken }]}>
                {PAYMENT_TYPES.map((p) => {
                  const active = paymentType === p.value;
                  return (
                    <TouchableOpacity
                      key={p.value}
                      onPress={() => onSelectPayment(p.value)}
                      style={[styles.segmentItem, active && { backgroundColor: theme.surfaceCard, borderColor: theme.primary, borderWidth: 1.5 }]}
                    >
                      <AppText variant="bodyStrong" color={active ? theme.primary : theme.inkMuted}>{p.label}</AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Section>

            {/* 4 · Delivery address */}
            <Section theme={theme} label="Delivery address">
              <DeliveryAddressBar address={selectedAddr} onPress={() => setShowAddressSheet(true)} />
            </Section>

            {/* 5 · Slot (placeholder) */}
            <Section theme={theme} label="Delivery slot">
              <View style={styles.chipWrap}>
                {slots.map((sl) => {
                  const active = slotId === sl.id;
                  return (
                    <TouchableOpacity
                      key={sl.id}
                      onPress={() => setSlotId(sl.id)}
                      style={[styles.chip, {
                        borderColor: active ? theme.ink : theme.borderStrong,
                        backgroundColor: active ? theme.ink : theme.surfaceCard,
                      }]}
                    >
                      <AppText variant="label" color={active ? theme.onInk : theme.ink}>{sl.label}</AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Section>

            {/* 6 · Refill summary */}
            <View style={[styles.card, { backgroundColor: theme.surfaceCard }]}>
              <View style={styles.summaryHeader}>
                <AppText variant="title" color={theme.ink}>Refill summary</AppText>
                {validating && (
                  <View style={styles.checking}>
                    <ActivityIndicator size="small" color={theme.inkMuted} />
                    <AppText variant="caption" color={theme.inkMuted} style={{ marginLeft: spacing.xs }}>Checking…</AppText>
                  </View>
                )}
              </View>

              <KeyValueRows
                rows={[
                  { label: 'Cans to refill', value: String(qtyNum) },
                  { label: 'Deposit required', value: formatCurrency(depositRequired), valueColor: depositRequired > 0 ? theme.ink : theme.success },
                ]}
              />

              {shortage > 0 ? (
                <View style={[styles.banner, { backgroundColor: theme.dangerTint }]}>
                  <Ionicons name="alert-circle-outline" size={18} color={theme.danger} style={{ marginRight: spacing.sm }} />
                  <AppText variant="caption" color={theme.danger} style={{ flex: 1 }}>
                    Short by {shortage} can{shortage !== 1 ? 's' : ''}. Place a standard order to get more cans.
                  </AppText>
                </View>
              ) : allowed ? (
                <View style={[styles.banner, { backgroundColor: theme.infoTint }]}>
                  <Ionicons name="information-circle-outline" size={18} color={theme.info} style={{ marginRight: spacing.sm }} />
                  <AppText variant="caption" color={theme.info} style={{ flex: 1 }}>
                    Hand over {qtyNum} empty can{qtyNum !== 1 ? 's' : ''} at the door. You pay only for the water, {payWord}.
                  </AppText>
                </View>
              ) : null}
            </View>

            {/* 7 · How refill works */}
            <View style={[styles.sunken, { backgroundColor: theme.surfaceSunken }]}>
              <AppText variant="bodyStrong" color={theme.ink} style={{ marginBottom: spacing.sm }}>How refill works</AppText>
              <AppText variant="caption" color={theme.inkMuted}>
                The delivery partner brings fresh full cans and takes back your empties at the door —
                a can-for-can swap. Your deposit stays the same. You only pay for the water.
              </AppText>
            </View>

            {/* 8 · Primary action */}
            <AppButton
              title={allowed ? 'Schedule refill' : (hasCans ? 'Not enough cans' : 'No cans to refill')}
              isLoading={placing}
              disabled={!allowed}
              onAction={allowed && !placing ? onPlace : undefined}
            />
          </ScrollView>
        </StateView>
      </NavScreen>

      {/* Address bottom sheet — rendered at screen root so its overlay is full-screen. */}
      {showAddressSheet && (
        <BottomSheet visible={showAddressSheet} onClose={() => setShowAddressSheet(false)}>
          <AddressScreen
            navigation={navigation}
            onClose={() => { setShowAddressSheet(false); syncSelectedAddress(); }}
            callGetSelectedAddressCallBack={syncSelectedAddress}
          />
        </BottomSheet>
      )}
    </>
  );
};

const Section = ({ theme, label, children }) => (
  <View>
    <AppText variant="label" color={theme.ink} style={{ marginBottom: spacing.sm }}>{label}</AppText>
    {children}
  </View>
);

const styles = StyleSheet.create({
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  badge: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  segment: {
    flexDirection: 'row',
    borderRadius: radius.sm,
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  card: { borderRadius: radius.lg, padding: spacing.lg },
  sunken: { borderRadius: radius.md, padding: spacing.lg },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  checking: { flexDirection: 'row', alignItems: 'center' },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: radius.sm,
    padding: spacing.md,
    marginTop: spacing.md,
  },
});

export default RefillScreen;
