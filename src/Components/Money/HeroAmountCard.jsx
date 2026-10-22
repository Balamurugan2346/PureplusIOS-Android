import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../AppText';
import { radius, spacing } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * Big balance/amount hero card (prompt 05). Default tone = brandBlue with ink text +
 * decorative drop/leaf shapes; alert tone = danger fill with onPrimary text, no shapes.
 *
 * Props: caption (uppercase label), amount (string), subLine, tone ('default'|'alert'),
 *        children (extra content rendered under the sub-line, e.g. the overdue box).
 */
const HeroAmountCard = ({ caption, amount, subLine, tone = 'default', children }) => {
  const { theme } = useTheme();
  const alert = tone === 'alert';
  const bg = alert ? theme.danger : theme.brandBlue;
  const fg = alert ? theme.onPrimary : theme.ink;

  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      {!alert && (
        <>
          <View style={[styles.drop, { backgroundColor: theme.brandBlueLight }]} pointerEvents="none" />
          <View style={[styles.leaf, { backgroundColor: theme.brandGreen }]} pointerEvents="none" />
        </>
      )}

      {!!caption && <AppText variant="badge" color={fg} style={styles.caption}>{caption}</AppText>}
      {!!amount && <AppText variant="display" color={fg} style={styles.amount}>{amount}</AppText>}
      {!!subLine && <AppText variant="caption" color={fg} style={styles.subLine}>{subLine}</AppText>}
      {children}
    </View>
  );
};

export default HeroAmountCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    overflow: 'hidden',
  },
  drop: {
    position: 'absolute',
    bottom: -40,
    right: -40,
    width: 170,
    height: 170,
    borderTopLeftRadius: 85,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 85,
    borderBottomRightRadius: 85,
    opacity: 0.5,
  },
  leaf: {
    position: 'absolute',
    top: -10,
    right: 40,
    width: 70,
    height: 70,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 0,
    opacity: 0.8,
  },
  caption: { letterSpacing: 0.6 },
  amount: { fontSize: 44, lineHeight: 50, letterSpacing: -0.9, marginTop: 6 },
  subLine: { marginTop: 4 },
});
