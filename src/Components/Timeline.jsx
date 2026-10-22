import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../Context/ThemeContext';
import { spacing } from '../Themes/Themes';
import { buildTimeline, formatOrderTime } from '../Utils/orderStatus';

/**
 * Canonical order timeline (00-foundation). Merges the two legacy timelines
 * (Screens/Product/Order/OrderTimeLine.jsx + Components/OrderTracking/OrderTimeLIne.jsx);
 * both old paths now re-export this. Driven by the real order via buildTimeline().
 *
 * Steps:
 *   completed → brandBlue filled dot + 2px brandBlue connector
 *   current (first incomplete) → white dot with 5px primary ring
 *   pending → white dot with 2px borderStrong ring, borderSubtle connector, muted title
 *
 * Props preserved from both predecessors: `order`, `style`, `fromWhiteBg` (now a no-op
 * since everything is light, kept for call-site compatibility).
 */
const Timeline = ({ order, style }) => {
  const { theme } = useTheme();
  const steps = buildTimeline(order);

  if (!steps.length) {
    return (
      <View style={[styles.container, style]}>
        <AppText variant="caption" color={theme.inkMuted}>No tracking updates yet.</AppText>
      </View>
    );
  }

  const currentIndex = steps.findIndex((s) => !s.completed);

  return (
    <View style={[styles.container, style]}>
      {steps.map((item, index) => {
        const isCurrent = index === currentIndex;
        const isLast = index === steps.length - 1;

        let dotStyle;
        if (item.completed) {
          dotStyle = { backgroundColor: theme.brandBlue };
        } else if (isCurrent) {
          dotStyle = { backgroundColor: theme.surfaceCard, borderWidth: 5, borderColor: theme.primary };
        } else {
          dotStyle = { backgroundColor: theme.surfaceCard, borderWidth: 2, borderColor: theme.borderStrong };
        }

        const connectorColor = item.completed ? theme.brandBlue : theme.borderSubtle;
        const titleColor = item.completed || isCurrent ? theme.ink : theme.inkMuted;

        return (
          <View key={item.key} style={styles.row}>
            <View style={styles.left}>
              <View style={[styles.dot, dotStyle]} />
              {!isLast && <View style={[styles.line, { backgroundColor: connectorColor }]} />}
            </View>
            <View style={styles.content}>
              <AppText variant="bodyStrong" color={titleColor}>{item.title}</AppText>
              {!!item.remarks && <AppText variant="caption" color={theme.inkMuted} style={styles.sub}>{item.remarks}</AppText>}
              {!!item.time && <AppText variant="caption" color={theme.inkMuted} style={styles.sub}>{formatOrderTime(item.time)}</AppText>}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.lg },
  row: { flexDirection: 'row' },
  left: { width: 16, alignItems: 'center', marginRight: spacing.md },
  dot: { width: 16, height: 16, borderRadius: 8, zIndex: 1 },
  line: { width: 2, flex: 1, marginVertical: 2 },
  content: { flex: 1, paddingBottom: spacing.lg },
  sub: { marginTop: 2 },
});

export default Timeline;
