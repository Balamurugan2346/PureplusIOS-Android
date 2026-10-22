import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from './AppText';
import AppButton from './AppButton';
import { useTheme } from '../Context/ThemeContext';
import { spacing, radius } from '../Themes/Themes';

/**
 * Shown when the selected delivery address's pincode has no serving store (CUS-07).
 * Redesign 02 — StateView-style card. Props preserved: pincode, reason, onChangeAddress.
 */
const UnserviceableArea = ({ pincode, reason, onChangeAddress }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surfaceCard }]}>
      <View style={[styles.iconWell, { backgroundColor: theme.dangerTint }]}>
        <Ionicons name="location-outline" size={26} color={theme.danger} />
      </View>

      <AppText variant="title" color={theme.ink} style={styles.title}>We don't deliver here yet</AppText>

      <AppText variant="caption" color={theme.inkMuted} style={styles.msg}>
        {reason || 'This area is not serviceable right now.'}
        {pincode ? ` (Pincode ${pincode})` : ''}
      </AppText>

      <AppText variant="caption" color={theme.inkMuted} style={styles.hint}>
        Change your delivery address — or the receiver's address when ordering for someone else — to see products available in that area.
      </AppText>

      {!!onChangeAddress && (
        <AppButton title="Change address" size="small" icon="swap-horizontal" onAction={onChangeAddress} style={styles.btn} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { margin: spacing.lg, padding: spacing.xl, borderRadius: radius.lg, alignItems: 'center', gap: spacing.sm },
  iconWell: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  title: { textAlign: 'center' },
  msg: { textAlign: 'center' },
  hint: { textAlign: 'center', marginBottom: spacing.sm },
  btn: { width: 200 },
});

export default UnserviceableArea;
