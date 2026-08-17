import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import StateView from '../../Components/StateView';
import StatusBadge from '../../Components/StatusBadge';
import formatCurrency from '../../Utils/formatCurrency';
import SubscriptionService from '../../API/modules/SubscriptionService';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-23 · Billing / Postpaid. Monthly cycle for subscription + B2B deliveries.
 * Overdue past the Super-Admin threshold blocks ALL new orders until paid.
 *
 * Sourced from the subscription ledger (unbilled balance + next billing). If a
 * dedicated postpaid-ledger customer endpoint is added later, swap the fetch.
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
    <NavScreen title="Billing" navigation={navigation}>

      <View style={[styles.summary, { backgroundColor: anyOverdue ? theme.error : theme.primary }]}>
        <AppText variant="caption" color={theme.buttonText}>Current unbilled balance</AppText>
        <AppText variant="h1" color={theme.buttonText} style={{ marginTop: spacing.xs }}>
          {formatCurrency(totalUnbilled)}
        </AppText>
        {anyOverdue && (
          <AppText variant="caption" color={theme.buttonText} style={{ marginTop: spacing.sm }}>
            You have an overdue balance. New orders are blocked until it is paid.
          </AppText>
        )}
      </View>

      <AppText variant="h3" color={theme.highlightedText} style={{ marginVertical: spacing.md }}>
        Postpaid accounts
      </AppText>

      <StateView loading={state.loading} error={state.error} empty={!state.data.length}
        onRetry={load} emptyText="No postpaid activity">
        <FlatList
          data={state.data}
          keyExtractor={(item, i) => String(item?.id ?? i)}
          renderItem={({ item }) => (
            <View style={[styles.row, { backgroundColor: theme.card }]}>
              <View style={{ flex: 1 }}>
                <AppText variant="body" color={theme.text}>
                  {item?.productName ?? item?.product ?? 'Subscription'}
                </AppText>
                <AppText variant="caption" color={theme.secondaryText}>
                  Next bill: {item?.nextBillingDate ?? '-'}
                </AppText>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <AppText variant="bodyStrong" color={theme.text}>
                  {formatCurrency(item?.unbilledBalance ?? 0)}
                </AppText>
                <StatusBadge status={item?.status} />
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </StateView>
    </NavScreen>
  );
};

const styles = StyleSheet.create({
  summary: { borderRadius: radius.lg, padding: spacing.xl },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm },
});

export default BillingScreen;
