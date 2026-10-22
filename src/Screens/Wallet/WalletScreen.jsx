import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import StateView from '../../Components/StateView';
import HeroAmountCard from '../../Components/Money/HeroAmountCard';
import formatCurrency from '../../Utils/formatCurrency';
import WalletService from '../../API/modules/WalletService';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-24 · Wallet (prompt 05 restyle). Credit from floor-charge overcharges + dispute
 * credit; auto-applies to orders. Read-only (no top-up).
 */
const WalletScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [state, setState] = useState({ loading: true, error: null, data: null });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await WalletService.get();
      setState({ loading: false, error: null, data });
    } catch (e) {
      setState({ loading: false, error: e, data: null });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const balance = state.data?.balance ?? state.data?.walletBalance ?? 0;
  const ledger = state.data?.ledger ?? state.data?.transactions ?? state.data?.history ?? [];

  return (
    <NavScreen title="Wallet" navigation={navigation} background={theme.surface}>

      <HeroAmountCard
        caption="AVAILABLE BALANCE"
        amount={formatCurrency(balance)}
        subLine="Credit auto-applies to your next order."
      />

      <AppText variant="title" color={theme.ink} style={{ marginVertical: spacing.lg }}>History</AppText>

      <StateView
        loading={state.loading}
        error={state.error}
        empty={!ledger.length}
        onRetry={load}
        emptyText="No wallet activity yet"
      >
        <View style={[styles.ledgerCard, { backgroundColor: theme.surfaceCard }]}>
          <FlatList
            data={ledger}
            keyExtractor={(item, i) => String(item?.id ?? i)}
            scrollEnabled={false}
            renderItem={({ item, index }) => {
              const amt = item?.amount ?? item?.value ?? 0;
              const credit = amt >= 0;
              return (
                <View style={[styles.row, index > 0 && { borderTopWidth: 1, borderTopColor: theme.borderSubtle }]}>
                  <View style={[styles.rowIcon, { backgroundColor: credit ? theme.successTint : theme.dangerTint }]}>
                    <Ionicons name={credit ? 'add' : 'remove'} size={18} color={credit ? theme.success : theme.danger} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText variant="bodyStrong" color={theme.ink}>
                      {item?.reason ?? item?.source ?? item?.description ?? 'Adjustment'}
                    </AppText>
                    <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>
                      {item?.createdAt ?? item?.date ?? ''}
                    </AppText>
                  </View>
                  <AppText variant="bodyStrong" color={credit ? theme.success : theme.danger}>
                    {credit ? '+' : '-'}{formatCurrency(Math.abs(amt))}
                  </AppText>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </StateView>
    </NavScreen>
  );
};

const styles = StyleSheet.create({
  ledgerCard: { borderRadius: radius.lg, paddingHorizontal: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 64,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WalletScreen;
