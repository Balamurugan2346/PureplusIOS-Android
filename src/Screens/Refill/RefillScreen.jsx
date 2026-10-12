import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import StateView from '../../Components/StateView';
import DeliveryAddressBar from '../../Components/DeliveryAddressBar';
import BottomSheet from '../../Components/BottomSheet';
import AddressScreen from '../Address/AddressScreen';
import formatCurrency from '../../Utils/formatCurrency';
import { spacing, radius, lightSurface } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';
import { refillService } from '../../API/modules/MiscService';
import GeoService from '../../API/modules/GeoService';
import { getSelectedAddressId, getSelectedAddress } from '../../Utils/GetSelectedAddress';

/**
 * CUS-25 · Refill order flow — live-wired.
 *
 * Refill ≠ new order: swaps empty cans for full ones at the door.
 * Deposit stays unchanged (can-for-can swap); you only pay for the water.
 *
 * Renders on a WHITE surface (lightSurface) inside the dark darkSea theme — the brand
 * `primary` is kept for accents; everything else is dark-on-light for legibility.
 *
 * Data: balance from refillService.balance(); gating from
 * refillService.validate(productId, quantity); storeId resolved via
 * GeoService.resolveServiceability(pincode) before place; place via
 * refillService.place(...). Address comes from the reusable DeliveryAddressBar.
 */

const PAYMENT_TYPES = [
  { label: 'Cash (COD)', value: 'COD' },
  { label: 'UPI / Online', value: 'UPI' },
];

const RefillScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  // White surface palette; keep the brand primary, add a legible error red for white bg.
  const s = { ...lightSurface, primary: theme.primary, error: '#D90202' };

  // --- REDUX DATA SOURCES ---------------------------------------------------
  const addressList = useSelector((st) => st.address?.addressList ?? []);

  // Slot placeholder (no live slot API for refill yet).
  const slots = [{ id: 'next', label: 'Next available' }];

  // --- LOCAL STATE ----------------------------------------------------------
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [paymentType, setPaymentType] = useState('COD');
  // Selected address — synced from AsyncStorage + Redux, exactly like CartScreen.
  const [selectedAddressId, setSelectedAddressId] = useState(-1);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [showAddressSheet, setShowAddressSheet] = useState(false);
  const [slotId, setSlotId] = useState(slots[0]?.id ?? null);
  const [placing, setPlacing] = useState(false);

  // Server validate result + in-flight flag.
  const [validateState, setValidateState] = useState(null);
  const [validating, setValidating] = useState(false);

  // --- DERIVED --------------------------------------------------------------
  const selected = balances.find((b) => b.productId === selectedProductId) ?? null;
  const balance = selected?.balance ?? 0;
  const qtyNum = Number(quantity) || 0;

  const hasCans = balances.some((b) => (b.balance ?? 0) > 0);
  // Gate on the server validate result; backend is the source of truth.
  const allowed = validateState?.isAllowed === true && qtyNum > 0 && hasCans;

  // --- LOAD BALANCE ON MOUNT ------------------------------------------------
  const loadBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await refillService.balance();
      const list = Array.isArray(data) ? data : [];
      setBalances(list);
      // Default to the first product that actually has cans to refill.
      const firstWithStock = list.find((b) => (b.balance ?? 0) > 0);
      setSelectedProductId(firstWithStock?.productId ?? null);
      // Only pre-fill "1" when there's actually a can to refill; otherwise show 0
      // so an ineligible customer isn't shown a misleading quantity.
      setQuantity(firstWithStock ? '1' : '0');
    } catch (e) {
      setError(e?.message || 'Could not load your cans. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  // --- VALIDATE (debounced gating) -----------------------------------------
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

  // --- HANDLERS -------------------------------------------------------------
  const onSelectProduct = (pid) => {
    setSelectedProductId(pid);
    const b = balances.find((x) => x.productId === pid);
    // Clamp quantity within the newly selected product's balance.
    const max = b?.balance ?? 0;
    if (max <= 0) {
      // No cans of this product → 0 (not eligible to refill it).
      setQuantity('0');
    } else if (Number(quantity) > max) {
      setQuantity(String(max));
    } else if (Number(quantity) < 1) {
      setQuantity('1');
    }
  };

  const onChangeQty = (text) => {
    // Clamp to 1..balance so the field stays sensible; backend still gates.
    const digits = text.replace(/[^0-9]/g, '');
    if (digits === '') {
      setQuantity('');
      return;
    }
    const n = Math.max(1, Math.min(Number(digits), Math.max(balance, 1)));
    setQuantity(String(n));
  };

  const onSelectPayment = (v) => setPaymentType(v);

  // Resolve the selected address from AsyncStorage + Redux (same approach as CartScreen's
  // getAddressFromStateList). AddressScreen writes `selectedAddressID` / `selectedAddress`
  // on pick, so re-running this after the sheet closes reflects the new selection.
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

    // 1 · Must have an address selected.
    if (!(selectedAddressId > 0)) {
      Alert.alert('No address', 'Please choose a delivery address first.');
      return;
    }

    setPlacing(true);
    try {
      // 2 · Resolve the serving store from the address pincode.
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

      // 3 · Place the refill.
      const res = await refillService.place({
        storeId,
        productId: selectedProductId,
        quantity: qtyNum,
        paymentType,
        addressId: selectedAddressId,
        // Backend SlotId is int?; the slot picker is a placeholder with no live
        // refill slot API yet, so send null until a numeric slot id exists.
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

  // Empty state: no cans held at all (or all balances 0).
  const emptyNoCans = !loading && !error && !hasCans;

  return (
    <>
    <NavScreen title="Refill Cans" navigation={navigation} background={s.background}>
      <StateView loading={loading} error={error} onRetry={loadBalance}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {emptyNoCans && (
            <View style={[styles.card, { backgroundColor: s.card, marginBottom: spacing.md }]}>
              <AppText variant="bodyStrong" color={s.highlightedText}>
                No cans to refill yet
              </AppText>
              <AppText variant="body" color={s.secondaryText} style={{ marginTop: spacing.xs }}>
                Place a standard order to get cans, then come back here to refill them.
              </AppText>
            </View>
          )}

          {/* 1 · Held-cans / product picker */}
          <Section theme={s} label="Product">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.xs }}>
              {balances.map((b) => {
                const active = selectedProductId === b.productId;
                return (
                  <TouchableOpacity
                    key={b.productId}
                    onPress={() => onSelectProduct(b.productId)}
                    style={[styles.chip, {
                      borderColor: active ? s.primary : s.divider,
                      backgroundColor: active ? `${s.primary}22` : s.cardContainer,
                    }]}
                  >
                    <AppText variant="bodyStrong" color={active ? s.primary : s.secondaryText}>
                      {b.productName}
                    </AppText>
                    <View style={[styles.badge, { backgroundColor: active ? s.primary : s.divider }]}>
                      <AppText variant="caption" color={active ? s.buttonText : s.secondaryText}>
                        {b.balance} held
                      </AppText>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Section>

          {/* 2 · Quantity */}
          <Section theme={s} label="Cans to refill">
            <Field
              theme={s}
              placeholder="e.g. 2"
              value={quantity}
              onChangeText={onChangeQty}
              keyboardType="numeric"
            />
            <AppText variant="caption" color={s.secondaryText} style={{ marginTop: spacing.xs }}>
              You hold {balance} can{balance !== 1 ? 's' : ''}.
            </AppText>
          </Section>

          {/* 3 · Payment type */}
          <Section theme={s} label="Payment">
            <View style={styles.toggle}>
              {PAYMENT_TYPES.map((p) => {
                const active = paymentType === p.value;
                return (
                  <TouchableOpacity
                    key={p.value}
                    onPress={() => onSelectPayment(p.value)}
                    style={[styles.toggleBtn, {
                      borderColor: active ? s.primary : s.divider,
                      backgroundColor: active ? `${s.primary}22` : s.cardContainer,
                    }]}
                  >
                    <AppText variant="bodyStrong" color={active ? s.primary : s.secondaryText}>
                      {p.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Section>

          {/* 4 · Delivery address — trigger bar; the AddressScreen sheet is rendered at screen root (below) */}
          <Section theme={s} label="Delivery address">
            <DeliveryAddressBar
              address={selectedAddr}
              surface={s}
              onPress={() => setShowAddressSheet(true)}
            />
          </Section>

          {/* 5 · Slot (placeholder) */}
          <Section theme={s} label="Delivery slot">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.xs }}>
              {slots.map((sl) => {
                const active = slotId === sl.id;
                return (
                  <TouchableOpacity
                    key={sl.id}
                    onPress={() => setSlotId(sl.id)}
                    style={[styles.chip, {
                      borderColor: active ? s.primary : s.divider,
                      backgroundColor: active ? `${s.primary}22` : s.cardContainer,
                    }]}
                  >
                    <AppText variant="bodyStrong" color={active ? s.primary : s.secondaryText}>
                      {sl.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Section>

          {/* 6 · Validation summary */}
          <View style={[styles.card, { backgroundColor: s.card }]}>
            <View style={styles.summaryHeader}>
              <AppText variant="h2" color={s.highlightedText}>
                Refill summary
              </AppText>
              {validating && (
                <View style={styles.checking}>
                  <ActivityIndicator size="small" color={s.secondaryText} />
                  <AppText variant="caption" color={s.secondaryText} style={{ marginLeft: spacing.xs }}>
                    Checking…
                  </AppText>
                </View>
              )}
            </View>
            <Row theme={s} label="Cans to refill" value={String(qtyNum)} />
            {(validateState?.depositRequired ?? 0) > 0 && (
              <Row theme={s} label="Deposit required" value={formatCurrency(validateState.depositRequired)} />
            )}
            {(validateState?.shortage ?? 0) > 0 && (
              <AppText variant="body" color={s.error} style={{ marginTop: spacing.xs }}>
                Short by {validateState.shortage} can{validateState.shortage !== 1 ? 's' : ''}. Place a standard order to get more cans.
              </AppText>
            )}
          </View>

          {/* 7 · How refill works */}
          <View style={[styles.card, { backgroundColor: s.card, marginTop: spacing.md }]}>
            <AppText variant="bodyStrong" color={s.highlightedText} style={{ marginBottom: spacing.sm }}>
              How refill works
            </AppText>
            <AppText variant="body" color={s.secondaryText}>
              The delivery partner brings fresh full cans and takes back your empties at the door —
              a can-for-can swap. Your deposit stays the same. You only pay for the water.
            </AppText>
          </View>

          <View style={{ height: spacing.xl }} />

          {/* 8 · Primary action */}
          <AppButton
            title={allowed ? 'Schedule refill' : (hasCans ? 'Not enough cans' : 'No cans to refill')}
            isLoading={placing}
            onAction={allowed && !placing ? onPlace : undefined}
            style={!allowed ? { opacity: 0.5 } : undefined}
          />
          <View style={{ height: spacing.xxl }} />
        </ScrollView>
      </StateView>
    </NavScreen>

    {/* Address bottom sheet — rendered at the SCREEN ROOT so its overlay is full-screen
        (same as CartScreen). AddressScreen persists the pick; re-sync on close/select. */}
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
  <View style={{ marginBottom: spacing.lg }}>
    <AppText variant="label" color={theme.secondaryText} style={{ marginBottom: spacing.sm }}>
      {label}
    </AppText>
    {children}
  </View>
);

const Field = ({ theme, ...rest }) => (
  <TextInput
    placeholderTextColor={theme.secondaryText}
    style={[styles.input, {
      color: theme.text,
      borderColor: theme.inputContainerBorder,
      backgroundColor: theme.inputContainer,
    }]}
    {...rest}
  />
);

const Row = ({ theme, label, value }) => (
  <View style={styles.row}>
    <AppText variant="body" color={theme.secondaryText}>{label}</AppText>
    <AppText variant="bodyStrong" color={theme.text}>{value}</AppText>
  </View>
);

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill ?? 999,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  badge: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill ?? 999,
  },
  toggle: { flexDirection: 'row', gap: spacing.sm },
  toggleBtn: {
    flex: 1, alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md, borderWidth: 1,
  },
  input: {
    borderWidth: 1, borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  card: { borderRadius: radius.md, padding: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  checking: { flexDirection: 'row', alignItems: 'center' },
});

export default RefillScreen;
