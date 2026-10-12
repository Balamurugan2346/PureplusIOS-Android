import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';
import { buildTimeline, formatOrderTime } from '../../Utils/orderStatus';

const TIMELINE_ACCENT_COLOR = '#2ecc71';

/**
 * Dynamic order timeline — driven by the real order (`order.history`, else canonical
 * progression from `deliveryStatus`). No more hardcoded dates. Pass the order object:
 *   <OrderTimeline order={order} />
 * `fromWhiteBg` renders headings dark for light surfaces.
 */
const OrderTimeline = ({ order, style, fromWhiteBg = false }) => {
  const { theme } = useTheme();
  const steps = buildTimeline(order);

  const headerColor = fromWhiteBg ? '#1A2433' : theme.highlightedText;
  const subColor = fromWhiteBg ? '#6B7280' : theme.secondaryText;

  if (!steps.length) {
    return (
      <View style={[styles.container, style]}>
        <Text style={{ color: subColor, fontFamily: Fonts.family.medium, fontSize: Fonts.size.xs }}>
          No tracking updates yet.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {steps.map((item, index) => {
        const dotColor = item.completed ? TIMELINE_ACCENT_COLOR : '#C4CDD8';
        return (
          <View key={item.key} style={styles.timelineItem}>
            <View style={styles.timelineIndicator}>
              <View style={[styles.circle, { backgroundColor: dotColor }]} />
              {index < steps.length - 1 && (
                <View style={[styles.line, { backgroundColor: item.completed ? TIMELINE_ACCENT_COLOR : '#DDE3EB' }]} />
              )}
            </View>
            <View style={styles.content}>
              <Text style={{ color: item.completed ? headerColor : subColor, fontFamily: Fonts.family.semiBold, fontSize: Fonts.size.sm }}>
                {item.title}
              </Text>
              {!!item.remarks && (
                <Text style={{ color: subColor, fontFamily: Fonts.family.regular, fontSize: Fonts.size.xs, marginTop: 2 }}>
                  {item.remarks}
                </Text>
              )}
              {!!item.time && (
                <Text style={{ color: subColor, fontFamily: Fonts.family.regular, fontSize: Fonts.size.xs, marginTop: 2 }}>
                  {formatOrderTime(item.time)}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 20 },
  timelineItem: { flexDirection: 'row', marginBottom: 20 },
  timelineIndicator: { width: 20, alignItems: 'center', marginRight: 5 },
  circle: { width: 10, height: 10, borderRadius: 5, zIndex: 1 },
  line: { width: 2, flex: 1, position: 'absolute', top: 10, bottom: -10 },
  content: { flex: 1 },
});

export default OrderTimeline;
