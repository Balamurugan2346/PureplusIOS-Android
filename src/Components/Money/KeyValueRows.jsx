import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../AppText';
import { spacing } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * Label/value rows (prompt 05). Pass `rows` = [{ label, value, valueColor }].
 * Falsy rows are skipped so callers can conditionally include entries inline.
 */
const KeyValueRows = ({ rows = [], style }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.wrap, style]}>
      {rows.filter(Boolean).map((r, i) => (
        <View key={i} style={styles.row}>
          <AppText variant="label" color={theme.inkMuted} style={{ marginRight: spacing.md }}>{r.label}</AppText>
          <AppText variant="label" color={r.valueColor || theme.ink} style={styles.value}>{r.value}</AppText>
        </View>
      ))}
    </View>
  );
};

export default KeyValueRows;

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  value: { flex: 1, textAlign: 'right', fontWeight: '600' },
});
