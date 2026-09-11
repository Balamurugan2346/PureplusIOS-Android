import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import StateView from '../../Components/StateView';
import formatCurrency from '../../Utils/formatCurrency';
import { refillService } from '../../API/modules/MiscService';
import { getSelectedAddressId } from '../../Utils/GetSelectedAddress';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-25 · Refill order flow.
 * Step 1: validate (GET /refill/validate) — shows what's refillable + cost.
 * Step 2: confirm → place (POST /refill/place).
 *
 * Refill ≠ new order: swaps empty cans for full ones at the door.
 * Deposit stays unchanged (can-for-can swap).
 */
const RefillScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [validateState, setValidateState] = useState({ loading: true, error: null, data: null });
  const [placing, setPlacing] = useState(false);

  const runValidate = useCallback(async () => {
    setValidateState({ loading: true, error: null, data: null });
    try {
      const addressId = Number(await getSelectedAddressId());
      const data = await refillService.validate(addressId > 0 ? { addressId } : {});
      setValidateState({ loading: false, error: null, data });
    } catch (e) {
      setValidateState({ loading: false, error: e, data: null });
    }
  }, []);

  useEffect(() => { runValidate(); }, [runValidate]);

  const placeRefill = async () => {
    setPlacing(true);
    try {
      const addressId = Number(await getSelectedAddressId());
      if (!addressId || addressId === -1) {
        Alert.alert('No address', 'Please save a delivery address first.');
        setPlacing(false);
        return;
      }
      const qty = validateState.data?.refillableCount
        ?? validateState.data?.quantity
        ?? validateState.data?.cansHeld
        ?? 0;

      await refillService.place({ addressId, quantity: qty });
      Alert.alert(
        'Refill scheduled',
        'Your empty cans will be swapped at the next delivery.',
        [{ text: 'OK', onPress: () => navigation?.goBack?.() }],
      );
    } catch (e) {
      Alert.alert('Could not place refill', e?.message || 'Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const d = validateState.data;
  const refillableCount = d?.refillableCount ?? d?.quantity ?? d?.cansHeld ?? 0;
  const amountDue = d?.amountDue ?? d?.totalAmount ?? d?.cost ?? 0;
  const isEligible = d?.eligible ?? d?.isEligible ?? refillableCount > 0;

  return (
    <NavScreen title="Refill Cans" navigation={navigation}>
      <StateView
        loading={validateState.loading}
        error={validateState.error}
        onRetry={runValidate}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Summary card */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <AppText variant="h2" color={theme.highlightedText} style={{ marginBottom: spacing.sm }}>
              Refill summary
            </AppText>

            <Row theme={theme} label="Cans to refill" value={String(refillableCount)} />
            {amountDue > 0 && (
              <Row theme={theme} label="Amount due at door" value={formatCurrency(amountDue)} />
            )}
            {d?.depositChange != null && d.depositChange !== 0 && (
              <Row theme={theme} label="Deposit adjustment" value={formatCurrency(d.depositChange)} />
            )}
          </View>

          {/* How it works */}
          <View style={[styles.card, { backgroundColor: theme.card, marginTop: spacing.md }]}>
            <AppText variant="bodyStrong" color={theme.highlightedText} style={{ marginBottom: spacing.sm }}>
              How refill works
            </AppText>
            <AppText variant="body" color={theme.secondaryText}>
              The delivery partner brings fresh full cans and takes back your empties at the door —
              a can-for-can swap. Your deposit stays the same. You only pay for the water.
            </AppText>
          </View>

          {!isEligible && (
            <View style={[styles.notice, { backgroundColor: `${theme.error ?? '#e74c3c'}18`, borderColor: theme.error ?? '#e74c3c' }]}>
              <AppText variant="body" color={theme.error ?? '#e74c3c'}>
                {d?.reason ?? 'No cans eligible for refill right now. Place a regular order to get started.'}
              </AppText>
            </View>
          )}

          <View style={{ height: spacing.xl }} />

          <AppButton
            title={isEligible ? `Schedule refill (${refillableCount} can${refillableCount !== 1 ? 's' : ''})` : 'Not eligible'}
            isLoading={placing}
            onAction={isEligible ? placeRefill : undefined}
            style={!isEligible ? { opacity: 0.5 } : undefined}
          />
          <View style={{ height: spacing.xxl }} />
        </ScrollView>
      </StateView>
    </NavScreen>
  );
};

const Row = ({ theme, label, value }) => (
  <View style={styles.row}>
    <AppText variant="body" color={theme.secondaryText}>{label}</AppText>
    <AppText variant="bodyStrong" color={theme.text}>{value}</AppText>
  </View>
);

const styles = StyleSheet.create({
  card: { borderRadius: radius.md, padding: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  notice: { borderRadius: radius.md, borderWidth: 1, padding: spacing.md, marginTop: spacing.md },
});

export default RefillScreen;
