import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import AppModal from '../../Components/AppModal';
import StateView from '../../Components/StateView';
import StatusBadge from '../../Components/StatusBadge';
import KeyValueRows from '../../Components/Money/KeyValueRows';
import SectionLabel from '../../Components/Money/SectionLabel';
import BulkService from '../../API/modules/BulkService';
import formatCurrency from '../../Utils/formatCurrency';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-27 · Bulk request detail + lifecycle actions (prompt 05 restyle, pureLight).
 * Action buttons are gated STRICTLY off the backend `status` (plus requestType / advance):
 *   - accept-counter : status === 'COUNTER_OFFERED'
 *   - pay-advance    : status === 'APPROVED' && EVENT && advancePaid < advanceAmount
 *   - confirm        : status === 'APPROVED' && (B2B OR EVENT advance fully paid)
 *   - cancel         : any non-terminal status
 */
const BulkRequestDetailScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const { theme } = useTheme();

  const [state, setState] = useState({ loading: true, error: null, data: null });
  const [busy, setBusy] = useState(false);
  const [cancelVisible, setCancelVisible] = useState(false);

  const load = useCallback(async () => {
    setState((st) => ({ ...st, loading: true, error: null }));
    try {
      const data = await BulkService.byId(id);
      setState({ loading: false, error: null, data });
    } catch (e) {
      setState({ loading: false, error: e, data: null });
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const doAction = async (fn) => {
    setBusy(true);
    try {
      await fn();
      await load();
    } catch (e) {
      Alert.alert('Action failed', e?.message || 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const data = state.data;

  const status = data?.status;
  const isEvent = data?.requestType === 'EVENT';
  const advanceAmount = data?.advanceAmount || 0;
  const advancePaid = data?.advancePaid || 0;
  const outstanding = advanceAmount - advancePaid;

  const TERMINAL = ['REJECTED', 'CANCELLED', 'DELIVERED'];
  const isTerminal = TERMINAL.includes(status);

  const canAcceptCounter = status === 'COUNTER_OFFERED';
  const canPayAdvance = status === 'APPROVED' && isEvent && advancePaid < advanceAmount;
  const canConfirm = status === 'APPROVED' && (!isEvent || advancePaid >= advanceAmount);
  const canCancel = !isTerminal && !!status;

  const cancelMessage = isEvent
    ? 'Cancelling inside the event window forfeits any advance you have paid.'
    : 'The store will stop preparing this order.';

  return (
    <NavScreen title="Bulk Request" navigation={navigation} background={theme.surface}>
      <StateView loading={state.loading} error={state.error} onRetry={load}>
        {data && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md, paddingBottom: 40 }}>

            {/* Header card */}
            <View style={[styles.card, { backgroundColor: theme.surfaceCard }]}>
              <View style={styles.headerRow}>
                <AppText variant="display" color={theme.ink} style={styles.headTitle}>
                  {isEvent ? 'Event' : 'B2B'} request
                </AppText>
                <StatusBadge status={status} />
              </View>
              <KeyValueRows
                rows={[
                  { label: 'Quantity', value: `${data.quantity ?? '-'} units` },
                  { label: 'Requested date', value: String(data.requestedDate ?? '-') },
                  data.estimatedAmount != null && { label: 'Estimated amount', value: formatCurrency(data.estimatedAmount) },
                ]}
              />
            </View>

            {/* Advance (EVENT only) */}
            {isEvent && (
              <View style={[styles.card, { backgroundColor: theme.surfaceCard, gap: spacing.md }]}>
                <SectionLabel>ADVANCE</SectionLabel>
                <KeyValueRows
                  rows={[
                    { label: 'Advance amount', value: formatCurrency(advanceAmount) },
                    { label: 'Advance paid', value: formatCurrency(advancePaid), valueColor: theme.success },
                    { label: 'Outstanding', value: formatCurrency(Math.max(outstanding, 0)), valueColor: theme.warning },
                    data.advanceForfeited > 0 && { label: 'Forfeited', value: formatCurrency(data.advanceForfeited), valueColor: theme.danger },
                  ]}
                />
              </View>
            )}

            {/* GSTIN (B2B only) */}
            {!isEvent && data.gstin ? (
              <View style={[styles.card, { backgroundColor: theme.surfaceCard, gap: spacing.sm }]}>
                <SectionLabel>GSTIN</SectionLabel>
                <AppText variant="bodyStrong" color={theme.ink} style={{ letterSpacing: 0.5 }}>{data.gstin}</AppText>
              </View>
            ) : null}

            {/* Event details */}
            {data.eventDetails ? (
              <View style={[styles.card, { backgroundColor: theme.surfaceCard, gap: spacing.sm }]}>
                <SectionLabel>EVENT DETAILS</SectionLabel>
                <AppText variant="body" color={theme.ink}>{data.eventDetails}</AppText>
              </View>
            ) : null}

            {/* Counter-offer */}
            {status === 'COUNTER_OFFERED' && (
              <View style={[styles.card, { backgroundColor: theme.warningTint, borderColor: theme.warning, borderWidth: 1.5, gap: spacing.md }]}>
                <View style={styles.counterHeader}>
                  <Ionicons name="swap-horizontal-outline" size={20} color={theme.warning} style={{ marginRight: spacing.sm }} />
                  <AppText variant="bodyStrong" color={theme.warning}>Store counter-offer</AppText>
                </View>
                <KeyValueRows
                  rows={[
                    data.counterDate != null && { label: 'Proposed date', value: String(data.counterDate) },
                    data.counterQuantity != null && { label: 'Proposed quantity', value: `${data.counterQuantity} units` },
                  ]}
                />
                {data.counterNote ? (
                  <AppText variant="body" color={theme.ink}>“{data.counterNote}”</AppText>
                ) : null}
              </View>
            )}

            {/* Store note */}
            {data.reviewNote ? (
              <View style={[styles.card, { backgroundColor: theme.surfaceCard, gap: spacing.sm }]}>
                <SectionLabel>STORE NOTE</SectionLabel>
                <AppText variant="body" color={theme.ink}>{data.reviewNote}</AppText>
              </View>
            ) : null}

            {/* Scheduled delivery */}
            {data.scheduledDeliveryDate ? (
              <View style={[styles.card, styles.deliveryCard, { backgroundColor: theme.surfaceCard }]}>
                <View style={[styles.well, { backgroundColor: theme.primaryTint }]}>
                  <Ionicons name="car-outline" size={22} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <SectionLabel>SCHEDULED DELIVERY</SectionLabel>
                  <AppText variant="bodyStrong" color={theme.ink} style={{ marginTop: 2 }}>{String(data.scheduledDeliveryDate)}</AppText>
                </View>
              </View>
            ) : null}

            {/* ACTIONS (gated off status) */}
            <View style={{ gap: spacing.md, marginTop: spacing.xs }}>
              {canAcceptCounter && (
                <AppButton
                  title="Accept counter-offer"
                  isLoading={busy}
                  onAction={busy ? undefined : () => doAction(() => BulkService.acceptCounter(id))}
                />
              )}

              {canPayAdvance && (
                <View style={{ gap: spacing.xs }}>
                  <AppButton
                    title={`Pay advance ${formatCurrency(outstanding)}`}
                    isLoading={busy}
                    onAction={busy ? undefined : () => doAction(() => BulkService.payAdvance(id, { amount: outstanding }))}
                  />
                  <AppText variant="caption" color={theme.inkMuted} style={{ textAlign: 'center' }}>
                    This records your advance with the store. No online payment is taken in the app.
                  </AppText>
                </View>
              )}

              {canConfirm && (
                <AppButton
                  title="Confirm request"
                  isLoading={busy}
                  onAction={busy ? undefined : () => doAction(() => BulkService.confirm(id))}
                />
              )}

              {canCancel && (
                <AppButton
                  title="Cancel request"
                  variant="dangerSoft"
                  isLoading={busy}
                  onAction={busy ? undefined : () => setCancelVisible(true)}
                />
              )}
            </View>
          </ScrollView>
        )}
      </StateView>

      <AppModal
        visible={cancelVisible}
        setModalVisible={setCancelVisible}
        title="Cancel request?"
        description={cancelMessage}
        destructive
        confirmText="Cancel request"
        cancelText="Keep it"
        onPositive={() => doAction(() => BulkService.cancel(id))}
      />
    </NavScreen>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: spacing.lg },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headTitle: { fontSize: 20, lineHeight: 26, flex: 1, marginRight: spacing.sm },
  counterHeader: { flexDirection: 'row', alignItems: 'center' },
  deliveryCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  well: { width: 44, height: 44, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
});

export default BulkRequestDetailScreen;
