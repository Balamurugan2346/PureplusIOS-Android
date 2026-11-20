import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import AppModal from '../../Components/AppModal';
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
import CheckoutService from '../../API/modules/CheckoutService';
import GeoService from '../../API/modules/GeoService';
import { getSelectedAddressId, getSelectedAddress } from '../../Utils/GetSelectedAddress';

const PAYMENT_TYPES = [
  { label: 'Cash (COD)', value: 'COD' },
  { label: 'UPI / Online', value: 'UPI' },
];

const RefillScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const addressList = useSelector((st) => st.address?.addressList ?? []);

  // ── Balance ──────────────────────────────────────────────
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Product / qty ─────────────────────────────────────────
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [quantity, setQuantity] = useState('1');

  // ── Delivery type ─────────────────────────────────────────
  const [deliveryType, setDeliveryType] = useState('instant');
  const [dayGroups, setDayGroups] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const slotsLoadedRef = useRef(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  // ── Payment / address ─────────────────────────────────────
  const [paymentType, setPaymentType] = useState('COD');
  const [selectedAddressId, setSelectedAddressId] = useState(-1);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [showAddressSheet, setShowAddressSheet] = useState(false);

  // ── Serviceability ────────────────────────────────────────
  const [resolvedStoreId, setResolvedStoreId] = useState(null);

  // ── Quote ─────────────────────────────────────────────────
  const [quote, setQuote] = useState(null);
  const [quoting, setQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState(null);

  // ── Place ─────────────────────────────────────────────────
  const [placing, setPlacing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);

  // ── Validate info: held / pending / available per selected product ──
  const [validateInfo, setValidateInfo] = useState(null);

  // ── Computed ──────────────────────────────────────────────
  const selected = balances.find((b) => b.productId === selectedProductId) ?? null;
  const balance = selected?.balance ?? 0;
  const qtyNum = Number(quantity) || 0;
  const hasCans = balances.some((b) => (b.balance ?? 0) > 0);
  // Use available (held − pending) so an active refill in-flight correctly reduces the max.
  const available = validateInfo?.available ?? balance;
  const pendingCans = validateInfo?.pending ?? 0;
  const shortage = selected ? Math.max(0, qtyNum - available) : 0;
  const allowedLocally = hasCans && qtyNum >= 1 && shortage === 0 && selectedProductId !== null;
  const isScheduled = deliveryType === 'scheduled';
  const scheduledReady = !isScheduled || (!!selectedDate && !!selectedSlotId);

  const pricing = quote?.pricing ?? null;
  const canPlace = allowedLocally && selectedAddressId > 0 && !!resolvedStoreId && scheduledReady;

  const buttonTitle = (() => {
    if (!hasCans) return 'No cans to refill';
    if (shortage > 0) return `Short by ${shortage} can${shortage !== 1 ? 's' : ''}`;
    if (!(selectedAddressId > 0)) return 'Choose a delivery address';
    if (isScheduled && !selectedDate) return 'Choose a delivery date';
    if (isScheduled && !selectedSlotId) return 'Choose a time slot';
    if (quoting) return 'Checking price…';
    if (pricing && canPlace) return `Confirm refill · ${formatCurrency(pricing.total, { compact: true })}`;
    return 'Confirm refill';
  })();

  // ── Load balance on mount ─────────────────────────────────
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

  // ── Load slots when schedule is chosen (once) ─────────────
  useEffect(() => {
    if (!isScheduled || slotsLoadedRef.current) return;
    slotsLoadedRef.current = true;
    setSlotsLoading(true);
    CheckoutService.slots()
      .then((data) => {
        const groups = Array.isArray(data) ? data : [];
        setDayGroups(groups);
        const firstWithSlots = groups.find((g) => (g.slots?.length ?? 0) > 0);
        if (firstWithSlots) setSelectedDate(firstWithSlots.date);
      })
      .catch(() => setDayGroups([]))
      .finally(() => setSlotsLoading(false));
  }, [isScheduled]);

  // ── Clear slot selections when switching to instant ───────
  useEffect(() => {
    if (!isScheduled) {
      setSelectedDate(null);
      setSelectedSlotId(null);
    }
  }, [isScheduled]);

  // ── Fetch held/pending/available for the selected product ────
  useEffect(() => {
    if (!selectedProductId) { setValidateInfo(null); return; }
    refillService.validate(selectedProductId, 1)
      .then((v) => setValidateInfo(v ?? null))
      .catch(() => setValidateInfo(null));
  }, [selectedProductId]);

  // Clamp quantity to available once validateInfo loads (pending may reduce the max).
  useEffect(() => {
    if (validateInfo && qtyNum > validateInfo.available && validateInfo.available > 0)
      setQuantity(String(validateInfo.available));
  }, [validateInfo]);

  // ── Resolve storeId from selected address ─────────────────
  useEffect(() => {
    const addr = selectedAddr || addressList.find((a) => a.id === selectedAddressId) || null;
    const pincode = addr?.pincode || addr?.pinCode || addr?.pin_code;
    if (!pincode) { setResolvedStoreId(null); return; }
    GeoService.resolveServiceability(String(pincode).trim())
      .then((svc) => setResolvedStoreId(svc?.serviceable && svc?.storeId ? svc.storeId : null))
      .catch(() => setResolvedStoreId(null));
  }, [selectedAddr, selectedAddressId, addressList]);

  // ── Fetch quote (debounced 600 ms) ───────────────────────
  const quoteTimer = useRef(null);
  useEffect(() => {
    if (quoteTimer.current) clearTimeout(quoteTimer.current);
    if (!selectedProductId || qtyNum < 1 || !(selectedAddressId > 0) || !resolvedStoreId || shortage > 0) {
      setQuote(null);
      setQuoting(false);
      setQuoteError(null);
      return undefined;
    }
    setQuoting(true);
    quoteTimer.current = setTimeout(async () => {
      try {
        const q = await refillService.quote({
          storeId: resolvedStoreId,
          addressId: selectedAddressId,
          deliveryType,
          lines: [{ productId: selectedProductId, quantity: qtyNum }],
        });
        setQuote(q ?? null);
        setQuoteError(null);
      } catch (e) {
        setQuote(null);
        setQuoteError(e?.message || 'Price unavailable. Please try again.');
      } finally {
        setQuoting(false);
      }
    }, 600);
    return () => { if (quoteTimer.current) clearTimeout(quoteTimer.current); };
  }, [selectedProductId, qtyNum, selectedAddressId, resolvedStoreId, deliveryType, shortage]);

  // ── Sync address from storage / redux ────────────────────
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

  // ── Product selection ─────────────────────────────────────
  const onSelectProduct = (pid) => {
    setSelectedProductId(pid);
    const b = balances.find((x) => x.productId === pid);
    const max = b?.balance ?? 0;
    if (max <= 0) setQuantity('0');
    else if (Number(quantity) > max) setQuantity(String(max));
    else if (Number(quantity) < 1) setQuantity('1');
  };

  const incQty = () => { if (qtyNum < available) setQuantity(String(qtyNum + 1)); };
  const decQty = () => { if (qtyNum > 1) setQuantity(String(qtyNum - 1)); };

  // ── Place order ───────────────────────────────────────────
  const onPlace = async () => {
    if (!canPlace || placing) return;
    setPlacing(true);
    try {
      const payload = {
        storeId: resolvedStoreId,
        productId: selectedProductId,
        quantity: qtyNum,
        paymentType,
        addressId: selectedAddressId,
        deliveryType,
        ...(isScheduled && selectedSlotId ? { slotId: selectedSlotId } : {}),
        ...(isScheduled && selectedDate ? { deliveryDate: selectedDate } : {}),
      };
      const res = await refillService.place(payload);
      setPlacedOrderId(res?.orderId ?? res?.OrderId ?? null);
      setShowSuccessModal(true);
    } catch (e) {
      setQuoteError(e?.message || 'Could not place refill. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  // ── Slots for the selected day ─────────────────────────────
  const activeDaySlots = (isScheduled && selectedDate)
    ? (dayGroups.find((g) => g.date === selectedDate)?.slots ?? [])
    : [];

  const emptyNoCans = !loading && !error && !hasCans;
  const payWord = paymentType === 'COD' ? 'in cash' : 'by UPI';

  return (
    <>
      <NavScreen title="Refill Cans" navigation={navigation} background={theme.surface}>
        <StateView loading={loading} error={error} onRetry={loadBalance}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: spacing.xxl, gap: spacing.xl }}
          >

            {emptyNoCans && (
              <View style={[styles.sunken, { backgroundColor: theme.surfaceSunken }]}>
                <AppText variant="bodyStrong" color={theme.ink}>No cans to refill yet</AppText>
                <AppText variant="body" color={theme.inkMuted} style={{ marginTop: spacing.xs }}>
                  Place a standard order to get cans, then come back here to refill them.
                </AppText>
              </View>
            )}

            {/* 1 · Product */}
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
                      {active && pendingCans > 0 ? (
                        <View style={[styles.badge, { backgroundColor: theme.warningTint }]}>
                          <AppText variant="caption" color={theme.warning}>{available} avail · {pendingCans} pending</AppText>
                        </View>
                      ) : (
                        <View style={[styles.badge, { backgroundColor: active ? theme.onInk : theme.primaryTint }]}>
                          <AppText variant="caption" color={active ? theme.ink : theme.primary}>{b.balance} held</AppText>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Section>

            {/* 2 · Quantity */}
            <Section theme={theme} label="Cans to refill">
              <View style={[styles.qtyRow, { backgroundColor: theme.surfaceCard }]}>
                <View style={{ flex: 1, marginRight: spacing.md }}>
                  <AppText variant="caption" color={theme.inkMuted}>
                    {`${validateInfo?.held ?? balance} held${selected ? ` of ${selected.productName}` : ''}`}
                  </AppText>
                  {pendingCans > 0 && (
                    <AppText variant="caption" color={theme.warning} style={{ marginTop: 2 }}>
                      {`${pendingCans} in active refill · ${available} available now`}
                    </AppText>
                  )}
                </View>
                <QuantityStepper value={qtyNum} min={1} onIncrease={incQty} onDecrease={decQty} />
              </View>
            </Section>

            {/* 3 · Delivery type */}
            <Section theme={theme} label="Delivery">
              <View style={styles.deliveryRow}>
                <DeliveryTypeCard
                  theme={theme}
                  icon="flash-outline"
                  title="Instant"
                  subtitle="ASAP"
                  active={!isScheduled}
                  onPress={() => setDeliveryType('instant')}
                />
                <DeliveryTypeCard
                  theme={theme}
                  icon="calendar-outline"
                  title="Schedule"
                  subtitle="Pick a slot"
                  active={isScheduled}
                  onPress={() => setDeliveryType('scheduled')}
                />
              </View>
            </Section>

            {/* 4 · Date + Slot (scheduled only) */}
            {isScheduled && (
              <>
                <Section theme={theme} label="Delivery date">
                  {slotsLoading ? (
                    <View style={[styles.loadingRow, { backgroundColor: theme.surfaceCard }]}>
                      <ActivityIndicator size="small" color={theme.inkMuted} />
                      <AppText variant="caption" color={theme.inkMuted} style={{ marginLeft: spacing.sm }}>Loading slots…</AppText>
                    </View>
                  ) : dayGroups.length === 0 ? (
                    <View style={[styles.sunken, { backgroundColor: theme.surfaceSunken }]}>
                      <AppText variant="caption" color={theme.inkMuted}>No slots available. Try again later.</AppText>
                    </View>
                  ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
                      {dayGroups.map((g) => {
                        const active = selectedDate === g.date;
                        const empty = (g.slots?.length ?? 0) === 0;
                        return (
                          <TouchableOpacity
                            key={g.date}
                            onPress={() => { setSelectedDate(g.date); setSelectedSlotId(null); }}
                            style={[styles.dayTile, {
                              backgroundColor: active ? theme.ink : theme.surfaceCard,
                              borderColor: active ? theme.ink : theme.borderSubtle,
                              opacity: empty && !active ? 0.45 : 1,
                            }]}
                          >
                            <AppText variant="caption" color={active ? theme.onInk : theme.inkMuted}>{g.label}</AppText>
                            <AppText variant="title" color={active ? theme.onInk : theme.ink} style={{ marginTop: 2 }}>
                              {g.date?.split('-')?.[2] ?? ''}
                            </AppText>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  )}
                </Section>

                {selectedDate && activeDaySlots.length > 0 && (
                  <Section theme={theme} label="Time slot">
                    <View style={styles.slotGrid}>
                      {activeDaySlots.map((sl) => {
                        const active = selectedSlotId === sl.slotId;
                        return (
                          <TouchableOpacity
                            key={sl.slotId}
                            onPress={() => sl.isAvailable !== false && setSelectedSlotId(sl.slotId)}
                            style={[styles.slotChip, {
                              backgroundColor: active ? theme.ink : theme.surfaceCard,
                              borderColor: active ? theme.ink : theme.borderSubtle,
                              opacity: sl.isAvailable === false ? 0.4 : 1,
                            }]}
                          >
                            <AppText variant="label" color={active ? theme.onInk : theme.ink}>{sl.slotName}</AppText>
                            <AppText variant="caption" color={active ? theme.onInk : theme.inkMuted}>
                              {sl.startTime}–{sl.endTime}
                            </AppText>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </Section>
                )}
              </>
            )}

            {/* 5 · Payment */}
            <Section theme={theme} label="Payment">
              <View style={[styles.segment, { backgroundColor: theme.surfaceSunken }]}>
                {PAYMENT_TYPES.map((p) => {
                  const active = paymentType === p.value;
                  return (
                    <TouchableOpacity
                      key={p.value}
                      onPress={() => setPaymentType(p.value)}
                      style={[styles.segmentItem, active && {
                        backgroundColor: theme.surfaceCard,
                        borderColor: theme.primary,
                        borderWidth: 1.5,
                      }]}
                    >
                      <AppText variant="bodyStrong" color={active ? theme.primary : theme.inkMuted}>{p.label}</AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Section>

            {/* 6 · Delivery address */}
            <Section theme={theme} label="Delivery address">
              <DeliveryAddressBar address={selectedAddr} onPress={() => setShowAddressSheet(true)} />
            </Section>

            {/* 7 · Price estimate */}
            <View style={[styles.card, { backgroundColor: theme.surfaceCard }]}>
              <View style={styles.cardHeader}>
                <AppText variant="title" color={theme.ink}>Price estimate</AppText>
                {quoting && (
                  <View style={styles.row}>
                    <ActivityIndicator size="small" color={theme.inkMuted} />
                    <AppText variant="caption" color={theme.inkMuted} style={{ marginLeft: spacing.xs }}>Checking…</AppText>
                  </View>
                )}
              </View>

              {/* Shortage blocks pricing */}
              {shortage > 0 ? (
                <View style={[styles.banner, { backgroundColor: theme.dangerTint }]}>
                  <Ionicons name="alert-circle-outline" size={18} color={theme.danger} style={{ marginRight: spacing.sm }} />
                  <AppText variant="caption" color={theme.danger} style={{ flex: 1 }}>
                    Short by {shortage} can{shortage !== 1 ? 's' : ''}. Place a standard order to get more cans.
                  </AppText>
                </View>
              ) : pricing ? (
                <>
                  <KeyValueRows
                    rows={[
                      pricing.subtotal > 0 && { label: 'Item total', value: formatCurrency(pricing.subtotal) },
                      pricing.gstAmount > 0 && { label: 'GST', value: formatCurrency(pricing.gstAmount) },
                      pricing.deliveryCharge > 0 && { label: 'Delivery', value: formatCurrency(pricing.deliveryCharge) },
                      pricing.convenienceFee > 0 && { label: 'Convenience fee', value: formatCurrency(pricing.convenienceFee) },
                      pricing.floorCharge > 0 && { label: 'Floor charge', value: formatCurrency(pricing.floorCharge) },
                      pricing.deliverySurcharge > 0 && { label: 'Express surcharge', value: formatCurrency(pricing.deliverySurcharge) },
                    ]}
                  />
                  <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />
                  <View style={styles.totalRow}>
                    <AppText variant="bodyStrong" color={theme.ink}>Total</AppText>
                    <AppText variant="bodyStrong" color={theme.ink}>{formatCurrency(pricing.total)}</AppText>
                  </View>
                  <View style={styles.depositRow}>
                    <AppText variant="caption" color={theme.inkMuted}>Deposit</AppText>
                    <AppText variant="caption" color={theme.success}>₹0 — stays the same</AppText>
                  </View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ChargesInfo')}
                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm }}
                  >
                    <Ionicons name="information-circle-outline" size={14} color={theme.info} />
                    <AppText variant="caption" color={theme.info} style={{ marginLeft: 4 }}>About these charges</AppText>
                  </TouchableOpacity>
                  <View style={[styles.banner, { backgroundColor: theme.infoTint, marginTop: spacing.md }]}>
                    <Ionicons name="information-circle-outline" size={16} color={theme.info} style={{ marginRight: spacing.sm }} />
                    <AppText variant="caption" color={theme.info} style={{ flex: 1 }}>
                      Hand {qtyNum} empty can{qtyNum !== 1 ? 's' : ''} to the driver at the door. Pay {payWord}.
                    </AppText>
                  </View>
                </>
              ) : quoteError ? (
                <View style={[styles.banner, { backgroundColor: theme.dangerTint }]}>
                  <Ionicons name="alert-circle-outline" size={16} color={theme.danger} style={{ marginRight: spacing.sm }} />
                  <AppText variant="caption" color={theme.danger} style={{ flex: 1 }}>{quoteError}</AppText>
                </View>
              ) : (
                <AppText variant="caption" color={theme.inkMuted}>
                  {!(selectedAddressId > 0)
                    ? 'Add a delivery address above to see the price.'
                    : !selectedProductId
                    ? 'Select a product to see the price.'
                    : 'Price will appear here.'}
                </AppText>
              )}
            </View>

            {/* 8 · How refill works */}
            <View style={[styles.sunken, { backgroundColor: theme.surfaceSunken }]}>
              <AppText variant="bodyStrong" color={theme.ink} style={{ marginBottom: spacing.sm }}>How refill works</AppText>
              <AppText variant="caption" color={theme.inkMuted}>
                The driver brings fresh full cans and takes back your empties at the door —
                a can-for-can swap. Your deposit stays the same. You only pay for the water.
              </AppText>
            </View>

            {/* 9 · Action button */}
            <AppButton
              title={buttonTitle}
              isLoading={placing}
              loadingText="Placing refill…"
              disabled={!canPlace}
              onAction={canPlace && !placing ? onPlace : undefined}
            />

          </ScrollView>
        </StateView>
      </NavScreen>

      {/* Address bottom sheet */}
      {showAddressSheet && (
        <BottomSheet visible={showAddressSheet} onClose={() => setShowAddressSheet(false)}>
          <AddressScreen
            navigation={navigation}
            onClose={() => { setShowAddressSheet(false); syncSelectedAddress(); }}
            callGetSelectedAddressCallBack={syncSelectedAddress}
          />
        </BottomSheet>
      )}

      {/* Success modal */}
      <AppModal
        visible={showSuccessModal}
        setModalVisible={setShowSuccessModal}
        title="Refill scheduled!"
        description={
          placedOrderId
            ? `Order #${placedOrderId} placed. Hand your empties to the driver at the door.`
            : 'Your refill order has been placed.'
        }
        confirmText="View orders"
        hideCancel
        onPositive={() => navigation?.navigate?.('MyOrdersScreen')}
      />
    </>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────

const Section = ({ theme, label, children }) => (
  <View>
    <AppText variant="label" color={theme.ink} style={{ marginBottom: spacing.sm }}>{label}</AppText>
    {children}
  </View>
);

const DeliveryTypeCard = ({ theme, icon, title, subtitle, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.deliveryCard, {
      backgroundColor: active ? theme.primaryTint : theme.surfaceCard,
      borderColor: active ? theme.primary : theme.borderSubtle,
    }]}
  >
    <View style={[styles.deliveryIcon, { backgroundColor: active ? theme.surfaceCard : theme.surfaceSunken }]}>
      <Ionicons name={icon} size={20} color={active ? theme.primary : theme.inkMuted} />
    </View>
    <AppText variant="bodyStrong" color={theme.ink} style={{ marginTop: spacing.sm }}>{title}</AppText>
    <AppText variant="caption" color={theme.inkMuted}>{subtitle}</AppText>
  </TouchableOpacity>
);

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },

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

  deliveryRow: { flexDirection: 'row', gap: spacing.md },
  deliveryCard: {
    flex: 1,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderRadius: radius.md,
    alignItems: 'flex-start',
  },
  deliveryIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dayTile: {
    minWidth: 68,
    height: 60,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slotChip: {
    minWidth: '47%',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  divider: { height: 1, marginVertical: spacing.md },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  depositRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },

  sunken: { borderRadius: radius.md, padding: spacing.lg },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
  },
});

export default RefillScreen;
