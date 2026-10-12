import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import StateView from '../../Components/StateView';
import StatusBadge from '../../Components/StatusBadge';
import BulkService from '../../API/modules/BulkService';
import formatCurrency from '../../Utils/formatCurrency';
import { spacing, radius, lightSurface } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-27 · Bulk request detail + lifecycle actions.
 *
 * Drives the customer side of the B2B / Event bulk-request lifecycle. Action buttons
 * are gated STRICTLY off the backend `status` (plus requestType / advance balance),
 * NOT off allowedTransitions:
 *   - accept-counter : status === 'COUNTER_OFFERED'
 *   - pay-advance    : status === 'APPROVED' && requestType === 'EVENT' && advancePaid < advanceAmount
 *   - confirm        : status === 'APPROVED' && (B2B OR EVENT advance fully paid)
 *   - cancel         : any non-terminal status
 *
 * Renders on a WHITE surface (lightSurface) inside the dark darkSea theme — same
 * convention as RefillScreen.
 */
const BulkRequestDetailScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const { theme } = useTheme();
  // White surface palette; keep the brand primary, add a legible error red for white bg.
  const s = { ...lightSurface, primary: theme.primary, error: '#D90202' };

  const [state, setState] = useState({ loading: true, error: null, data: null });
  const [busy, setBusy] = useState(false);

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

  // --- DERIVED GATING -------------------------------------------------------
  const status = data?.status;
  const isEvent = data?.requestType === 'EVENT';
  const advanceAmount = data?.advanceAmount || 0;
  const advancePaid = data?.advancePaid || 0;
  const outstanding = advanceAmount - advancePaid;

  const TERMINAL = ['REJECTED', 'CANCELLED', 'DELIVERED'];
  const isTerminal = TERMINAL.includes(status);

  const canAcceptCounter = status === 'COUNTER_OFFERED';
  const canPayAdvance = status === 'APPROVED' && isEvent && advancePaid < advanceAmount;
  // Confirm: APPROVED and (B2B OR an EVENT whose advance is fully paid).
  const canConfirm = status === 'APPROVED' && (!isEvent || advancePaid >= advanceAmount);
  const canCancel = !isTerminal && !!status;

  const onCancel = () => {
    let message = 'This will cancel your bulk request. This cannot be undone.';
    if (isEvent && advancePaid > 0) {
      message += ' Your advance may be forfeited if you cancel close to the event date.';
    }
    Alert.alert('Cancel request?', message, [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Cancel request',
        style: 'destructive',
        onPress: () => doAction(() => BulkService.cancel(id)),
      },
    ]);
  };

  return (
    <NavScreen title="Bulk Request" navigation={navigation} background={s.background}>
      <StateView loading={state.loading} error={state.error} onRetry={load}>
        {data && (
          <ScrollView showsVerticalScrollIndicator={false}>

            {/* Header card — type + status */}
            <View style={[styles.card, { backgroundColor: s.card }]}>
              <View style={styles.headerRow}>
                <AppText variant="h2" color={s.highlightedText}>
                  {isEvent ? 'Event' : 'B2B'} request
                </AppText>
                <StatusBadge status={status} />
              </View>
              <Row theme={s} label="Quantity" value={`${data.quantity ?? '-'} units`} />
              <Row theme={s} label="Requested date" value={String(data.requestedDate ?? '-')} />
              {data.estimatedAmount != null && (
                <Row theme={s} label="Estimated amount" value={formatCurrency(data.estimatedAmount)} />
              )}
            </View>

            {/* Advance card (EVENT only) */}
            {isEvent && (
              <Section theme={s} label="Advance">
                <View style={[styles.card, { backgroundColor: s.card }]}>
                  <Row theme={s} label="Advance amount" value={formatCurrency(advanceAmount)} />
                  <Row theme={s} label="Advance paid" value={formatCurrency(advancePaid)} />
                  <Row theme={s} label="Outstanding" value={formatCurrency(Math.max(outstanding, 0))} />
                  {data.advanceForfeited > 0 && (
                    <Row theme={s} label="Forfeited" value={formatCurrency(data.advanceForfeited)} />
                  )}
                </View>
              </Section>
            )}

            {/* GSTIN (B2B only, when present) */}
            {!isEvent && data.gstin ? (
              <Section theme={s} label="GSTIN">
                <View style={[styles.card, { backgroundColor: s.card }]}>
                  <AppText variant="body" color={s.text}>{data.gstin}</AppText>
                </View>
              </Section>
            ) : null}

            {/* Event details (when present) */}
            {data.eventDetails ? (
              <Section theme={s} label="Event details">
                <View style={[styles.card, { backgroundColor: s.card }]}>
                  <AppText variant="body" color={s.text}>{data.eventDetails}</AppText>
                </View>
              </Section>
            ) : null}

            {/* Counter-offer card — prominent when COUNTER_OFFERED */}
            {status === 'COUNTER_OFFERED' && (
              <Section theme={s} label="Store counter-offer">
                <View style={[styles.card, styles.counterCard, { backgroundColor: `${s.primary}11`, borderColor: s.primary }]}>
                  {data.counterDate != null && (
                    <Row theme={s} label="Proposed date" value={String(data.counterDate)} />
                  )}
                  {data.counterQuantity != null && (
                    <Row theme={s} label="Proposed quantity" value={`${data.counterQuantity} units`} />
                  )}
                  {data.counterNote ? (
                    <AppText variant="body" color={s.text} style={{ marginTop: spacing.sm }}>
                      {data.counterNote}
                    </AppText>
                  ) : null}
                </View>
              </Section>
            )}

            {/* Review note (when present) */}
            {data.reviewNote ? (
              <Section theme={s} label="Store note">
                <View style={[styles.card, { backgroundColor: s.card }]}>
                  <AppText variant="body" color={s.text}>{data.reviewNote}</AppText>
                </View>
              </Section>
            ) : null}

            {/* Scheduled delivery (when present) */}
            {data.scheduledDeliveryDate ? (
              <Section theme={s} label="Scheduled delivery">
                <View style={[styles.card, { backgroundColor: s.card }]}>
                  <AppText variant="body" color={s.text}>{String(data.scheduledDeliveryDate)}</AppText>
                </View>
              </Section>
            ) : null}

            <View style={{ height: spacing.lg }} />

            {/* --- ACTIONS (gated off status) --- */}
            {canAcceptCounter && (
              <AppButton
                title="Accept counter-offer"
                isLoading={busy}
                onAction={busy ? undefined : () => doAction(() => BulkService.acceptCounter(id))}
              />
            )}

            {canPayAdvance && (
              <AppButton
                title={`Pay advance ${formatCurrency(outstanding)}`}
                isLoading={busy}
                onAction={busy ? undefined : () => doAction(() => BulkService.payAdvance(id, { amount: outstanding }))}
              />
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
                borderOnly
                isLoading={busy}
                onAction={busy ? undefined : onCancel}
              />
            )}

            <View style={{ height: spacing.xxl }} />
          </ScrollView>
        )}
      </StateView>
    </NavScreen>
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

const Row = ({ theme, label, value }) => (
  <View style={styles.row}>
    <AppText variant="body" color={theme.secondaryText}>{label}</AppText>
    <AppText variant="bodyStrong" color={theme.text}>{value}</AppText>
  </View>
);

const styles = StyleSheet.create({
  card: { borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.md },
  counterCard: { borderWidth: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
});

export default BulkRequestDetailScreen;
