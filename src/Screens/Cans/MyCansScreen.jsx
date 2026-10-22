import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import StateView from '../../Components/StateView';
import formatCurrency from '../../Utils/formatCurrency';
import { canService } from '../../API/modules/MiscService';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-25 · My Cans (prompt 05 restyle). The customer's reusable-can position + deposit
 * liability. Refund is full once all cans are returned (schedules a collection visit).
 */
const MyCansScreen = ({ navigation }) => {

  const { theme } = useTheme();
  const [state, setState] = useState({ loading: true, error: null, data: null });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await canService.held();
      setState({ loading: false, error: null, data });
    } catch (e) {
      setState({ loading: false, error: e, data: null });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const lines = state.data?.heldCans ?? state.data?.cans ?? state.data?.lines ?? [];
  const held =
    state.data?.totalHeld ??
    state.data?.cansHeldTotal ??
    state.data?.cansHeld ??
    (Array.isArray(lines) ? lines.reduce((sum, l) => sum + (l?.held ?? l?.quantity ?? 0), 0) : 0);
  const depositPaid =
    state.data?.totalDepositPaid ??
    state.data?.depositPaid ??
    state.data?.totalDeposit ??
    (Array.isArray(lines) ? lines.reduce((sum, l) => sum + (l?.depositPaid ?? 0), 0) : 0);

  return (
    <NavScreen title="My Cans" navigation={navigation} background={theme.surface}>
      <StateView loading={state.loading} error={state.error} onRetry={load}>
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.lg }}>
            {/* Stat tiles */}
            <View style={styles.statRow}>
              <View style={[styles.tile, { backgroundColor: theme.sky200 }]}>
                <Image source={require('../../../assets/images/watercan2.png')} style={styles.canImg} resizeMode="contain" />
                <AppText variant="display" color={theme.primary} style={styles.bigNum}>{String(held)}</AppText>
                <AppText variant="label" color={theme.ink}>Cans held</AppText>
              </View>

              <View style={[styles.tile, { backgroundColor: theme.successTint }]}>
                <View style={[styles.shieldWell, { backgroundColor: theme.surfaceCard }]}>
                  <Ionicons name="shield-checkmark-outline" size={24} color={theme.success} />
                </View>
                <AppText variant="display" color={theme.success} style={styles.depositNum}>{formatCurrency(depositPaid)}</AppText>
                <AppText variant="label" color={theme.ink}>Deposit paid · fully refundable</AppText>
              </View>
            </View>

            {/* How it works */}
            <View style={[styles.info, { backgroundColor: theme.surfaceCard }]}>
              <AppText variant="title" color={theme.ink}>How it works</AppText>
              <AppText variant="body" color={theme.inkMuted} style={{ marginTop: spacing.sm }}>
                Each delivery swaps your empty can for a full one at the door. Your deposit is fully
                refundable — return all held cans and close out, and we schedule a collection visit.
              </AppText>
            </View>

            {/* Refund policy note with inline service-request link */}
            <View style={[styles.note, { backgroundColor: theme.surfaceSunken }]}>
              <AppText variant="caption" color={theme.ink}>
                To request a deposit refund, return all held cans on your next delivery or{' '}
                <AppText
                  variant="caption"
                  color={theme.primary}
                  style={styles.link}
                  onPress={() => navigation?.navigate?.('ServiceRequest')}
                >
                  raise a service request
                </AppText>
                . Refunds are full, with no restocking deduction.
              </AppText>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <AppButton title="Schedule refill" onAction={() => navigation?.navigate?.('Refill')} />
          </View>
        </View>
      </StateView>
    </NavScreen>
  );
};

const styles = StyleSheet.create({
  statRow: { flexDirection: 'row', gap: spacing.md },
  tile: { flex: 1, borderRadius: radius.lg, padding: spacing.lg, gap: 10 },
  canImg: { width: 28, height: 36 },
  bigNum: { fontSize: 40, lineHeight: 44 },
  shieldWell: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  depositNum: { fontSize: 28, lineHeight: 34 },
  info: { borderRadius: radius.lg, padding: spacing.lg },
  note: { borderRadius: radius.md, padding: spacing.lg },
  link: { textDecorationLine: 'underline' },
  footer: { paddingTop: spacing.lg, paddingBottom: spacing.xl },
});

export default MyCansScreen;
