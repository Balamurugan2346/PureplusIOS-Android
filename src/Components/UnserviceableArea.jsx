import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from './AppText';
import { useTheme } from '../Context/ThemeContext';
import { spacing, radius } from '../Themes/Themes';

/**
 * Shown on the dashboard (and cart) when the selected delivery address's pincode
 * does not resolve to a serving store (CUS-07). Products are hidden and ordering
 * is blocked until the user picks a serviceable address.
 */
const UnserviceableArea = ({ pincode, reason, onChangeAddress }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.inputContainerBorder }]}>
      <View style={[styles.iconWrap, { backgroundColor: theme.onPrimaryContainer }]}>
        <Ionicons name="location-outline" size={30} color={theme.error} />
      </View>

      <AppText variant="h3" color={theme.highlightedText} style={styles.title}>
        We don't deliver here yet
      </AppText>

      <AppText variant="body" color={theme.secondaryText} style={styles.msg}>
        {reason || 'This area is not serviceable right now.'}
        {pincode ? ` (Pincode ${pincode})` : ''}
      </AppText>

      <AppText variant="caption" color={theme.secondaryText} style={styles.hint}>
        Change your delivery address — or the receiver's address when ordering for
        someone else — to see products available in that area.
      </AppText>

      {!!onChangeAddress && (
        <TouchableOpacity
          onPress={onChangeAddress}
          style={[styles.btn, { backgroundColor: theme.primary }]}
          activeOpacity={0.85}
        >
          <Ionicons name="swap-horizontal" size={18} color={theme.buttonText} />
          <AppText variant="button" color={theme.buttonText} style={{ marginLeft: 6 }}>
            Change address
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: spacing.md,
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: { textAlign: 'center', marginBottom: spacing.xs },
  msg: { textAlign: 'center', marginBottom: spacing.sm },
  hint: { textAlign: 'center', marginBottom: spacing.lg },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
});

export default UnserviceableArea;
