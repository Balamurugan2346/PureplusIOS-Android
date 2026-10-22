import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from '../AppText';
import { useTheme } from '../../Context/ThemeContext';
import { radius, spacing } from '../../Themes/Themes';

/**
 * Feature row (redesign 02): 40 icon well + title + description. Rendered inside a
 * Card by the parent (gap between rows handled there). Props preserved: iconName,
 * title, description (iconColor/iconBgColor accepted but default to theme tokens).
 */
const IconTextFeature = ({ iconName = 'water-outline', title = '', description = '' }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.row}>
      <View style={[styles.well, { backgroundColor: theme.primaryTint }]}>
        <Ionicons name={iconName} size={20} color={theme.primary} />
      </View>
      <View style={styles.text}>
        <AppText variant="bodyStrong" color={theme.ink}>{title}</AppText>
        <AppText variant="caption" color={theme.inkMuted} style={styles.desc}>{description}</AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  well: { width: 40, height: 40, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1 },
  desc: { marginTop: 2, lineHeight: 18 },
});

export default IconTextFeature;
