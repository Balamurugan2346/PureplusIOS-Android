import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import StateView from '../../Components/StateView';
import StatusBadge from '../../Components/StatusBadge';
import HeroAmountCard from '../../Components/Money/HeroAmountCard';
import formatCurrency from '../../Utils/formatCurrency';
import SubscriptionService from '../../API/modules/SubscriptionService';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-23 · Billing / Postpaid (prompt 05 restyle). Monthly cycle for subscription + B2B.
 * Overdue past the Super-Admin threshold blocks ALL new orders until paid. Read-only
 * (no in-app pay). Sourced from the subscription ledger.
 */
const BillingScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [state, setState] = useState({ loading: true, error: null, data: [] });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await SubscriptionService.list();
      setState({ loading: false, error: null, data: Array.isArray(data) ? data : data?.items ?? [] });
    } catch (e) {
      setState({ loading: false, error: e, data: [] });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalUnbilled = state.data.reduce((sum, s) => sum + (Number(s?.unbilledBalance) || 0), 0);
  const anyOverdue = state.data.some((s) => String(s?.status || '').toUpperCase() === 'OVERDUE');

  return (
    <NavScreen title="Billing" navigation={navigation} background={theme.surface}>

      <HeroAmountCard
        caption="CURRENT UNBILLED BALANCE"
        amount={formatCurrency(totalUnbilled)}
        subLine={anyOverdue ? undefined : 'Billed monthly for subscriptions and B2B deliveries.'}
        tone={anyOverdue ? 'alert' : 'default'}
      >
        {anyOverdue && (
          <View style={[styles.overdueBox, { backgroundColor: theme.surfaceCard }]}>
            <Ionicons name="warning-outline" size={18} color={theme.danger} style={{ marginRight: 8 }} />
            <AppText variant="caption" color={theme.danger} style={{ flex: 1, fontWeight: '600' }}>
              You have an overdue balance. New orders are blocked until it is paid.
            </AppText>
          </View>
        )}
      </HeroAmountCard>

      <AppText variant="title" color={theme.ink} style={{ marginVertical: spacing.lg }}>Postpaid accounts</AppText>

      <StateView loading={state.loading} error={state.error} empty={!state.data.length}
        onRetry={load} emptyText="No postpaid activity">
        <View style={[styles.listCard, { backgroundColor: theme.surfaceCard }]}>
          <FlatList
            data={state.data}
            keyExtractor={(item, i) => String(item?.id ?? i)}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <View style={[styles.row, index > 0 && { borderTopWidth: 1, borderTopColor: theme.borderSubtle }]}>
                <View style={{ flex: 1, marginRight: spacing.md }}>
                  <AppText variant="bodyStrong" color={theme.ink}>
                    {item?.productName ?? item?.product ?? 'Subscription'}
                  </AppText>
                  <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>
                    Next bill: {item?.nextBillingDate ?? '-'}
                  </AppText>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <AppText variant="bodyStrong" color={theme.ink}>
                    {formatCurrency(item?.unbilledBalance ?? 0)}
                  </AppText>
                  <StatusBadge status={item?.status} />
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </StateView>
    </NavScreen>
  );
};

const styles = StyleSheet.create({
  overdueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.sm,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  listCard: { borderRadius: radius.lg, paddingHorizontal: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 72,
  },
});

export default BillingScreen;
