import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import StateView from '../../Components/StateView';
import formatCurrency from '../../Utils/formatCurrency';
import { refillService } from '../../API/modules/MiscService';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-25 · My Cans. The customer's reusable-can position + deposit liability.
 * Refund is full once all cans are returned (schedules a collection visit).
 */
const MyCansScreen = ({ navigation }) => {

  const { theme } = useTheme();
  const [state, setState] = useState({ loading: true, error: null, data: null });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await refillService.balance();
      setState({ loading: false, error: null, data });
    } catch (e) {
      setState({ loading: false, error: e, data: null });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const held = state.data?.cansHeld ?? state.data?.heldCans ?? state.data?.balance ?? 0;
  const depositPaid = state.data?.depositPaid ?? state.data?.totalDeposit ?? 0;

  return (
    <NavScreen title="My Cans" navigation={navigation}>
      <StateView loading={state.loading} error={state.error} onRetry={load}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.statRow}>
            <Stat theme={theme} label="Cans held" value={String(held)} />
            <Stat theme={theme} label="Deposit paid" value={formatCurrency(depositPaid)} />
          </View>

          <View style={[styles.info, { backgroundColor: theme.card }]}>
            <AppText variant="bodyStrong" color={theme.highlightedText}>How it works</AppText>
            <AppText variant="body" color={theme.secondaryText} style={{ marginTop: spacing.sm }}>
              Each delivery swaps your empty can for a full one at the door. Your deposit is fully
              refundable — return all held cans and close out, and we schedule a collection visit.
            </AppText>
          </View>

          <View style={[styles.info, { backgroundColor: theme.card, marginTop: spacing.md }]}>
            <AppText variant="caption" color={theme.secondaryText}>
              To request a deposit refund, return all held cans on your next delivery or raise a
              service request. Refunds are full, with no restocking deduction.
            </AppText>
          </View>

          <View style={{ marginTop: spacing.xl }}>
            <AppButton
              title="Schedule refill"
              onAction={() => navigation?.navigate?.('Refill')}
            />
          </View>
        </ScrollView>
      </StateView>
    </NavScreen>
  );
};

const Stat = ({ theme, label, value }) => (
  <View style={[styles.stat, { backgroundColor: theme.card }]}>
    <AppText variant="h1" color={theme.primary}>{value}</AppText>
    <AppText variant="caption" color={theme.secondaryText} style={{ marginTop: spacing.xs }}>{label}</AppText>
  </View>
);

const styles = StyleSheet.create({
  statRow: { flexDirection: 'row', gap: spacing.md },
  stat: { flex: 1, borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center' },
  info: { borderRadius: radius.md, padding: spacing.lg, marginTop: spacing.lg },
});

export default MyCansScreen;
