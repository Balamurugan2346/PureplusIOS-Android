import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../../Context/ThemeContext";
import Fonts from "../../../../assets/fonts/Fonts";
import { buildTimeline, formatOrderTime } from "../../../Utils/orderStatus";

/**
 * Track-order timeline — driven by the real order (`order.history`, else canonical
 * progression from `deliveryStatus`). Previously used non-existent fields
 * (order.status === 'PENDING'/'COMPLETED', createdAt/assignedAt) so it never filled.
 */
export default function OrderTimeline({ order }) {
  const { theme } = useTheme();
  const steps = buildTimeline(order);

  if (!steps.length) {
    return (
      <View style={styles.container}>
        <Text style={[styles.time, { color: theme.secondaryText }]}>No tracking updates yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={step.key} style={styles.row}>
          <View style={styles.left}>
            <View style={[styles.circle, { backgroundColor: step.completed ? theme.primary : "#ccc" }]} />
            {index !== steps.length - 1 && (
              <View style={[styles.line, { backgroundColor: step.completed ? theme.primary : "#ddd" }]} />
            )}
          </View>
          <View style={styles.right}>
            <Text style={[styles.title, { color: step.completed ? theme.text : theme.secondaryText }]}>
              {step.title}
            </Text>
            {!!step.remarks && <Text style={styles.time}>{step.remarks}</Text>}
            {!!step.time && <Text style={styles.time}>{formatOrderTime(step.time)}</Text>}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: 20, marginTop: 20 },
  row: { flexDirection: "row" },
  left: { alignItems: "center", marginRight: 14 },
  circle: { width: 16, height: 16, borderRadius: 10 },
  line: { width: 2, flex: 1 },
  right: { paddingBottom: 30, flex: 1 },
  title: { fontSize: 14, fontFamily: Fonts.family.semiBold },
  time: { fontSize: 12, color: "#888", marginTop: 4 },
});
