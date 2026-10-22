import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../../Context/ThemeContext";
import TopAppBar from "../../../Components/TopAppBar";
import AppText from "../../../Components/AppText";
import StatusBadge from "../../../Components/StatusBadge";
import { radius, spacing } from "../../../Themes/Themes";
import { getOrderDetailed } from "../../../Redux/Slices/OrderSlice";
import OrderApi from "../../../API/modules/OrderService";
import { statusLabel, formatOrderTime, buildTimeline } from "../../../Utils/orderStatus";

/**
 * CUS-18 Track Order — wired to the live tracking APIs (prompt 03 restyle, pureLight).
 *   - GET orders/track/{id} → { orderId, timeline:[{status,time,isCompleted,description}], history }
 *   - GET orders/eta/{id}   → { etaMinutes }
 * The order header (address) still comes from order-detail. ETA is best-effort: its failure
 * must not blank the timeline. Polls every 20s for live updates while the screen is open.
 */
export default function OrderTrackingScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const orderId = route?.params?.id;

  const { data: order } = useSelector((state) => state.order.orderDetailed);

  const [tracking, setTracking] = useState(null);
  const [etaMinutes, setEtaMinutes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);

    // Order detail drives the address/header — keep the existing flow.
    dispatch(getOrderDetailed({ id: orderId, onSuccess: () => {}, onError: () => {} }));

    // Tracking timeline + ETA. allSettled so an ETA failure never blanks the timeline.
    const [trackRes, etaRes] = await Promise.allSettled([
      OrderApi.track(orderId),
      OrderApi.eta(orderId),
    ]);

    if (trackRes.status === "fulfilled") {
      setTracking(trackRes.value ?? null);
    } else {
      setError(trackRes.reason?.message || "Could not load tracking updates.");
    }
    setEtaMinutes(etaRes.status === "fulfilled" ? (etaRes.value?.etaMinutes ?? null) : null);

    setLoading(false);
  }, [orderId, dispatch]);

  useEffect(() => { load(); }, [load]);

  // Live refresh while the screen is open (read-only; cheap). Stops on unmount.
  useEffect(() => {
    if (!orderId) return undefined;
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, [orderId, load]);

  // Normalize both sources into one step shape so the same renderer draws either:
  //   server tracking timeline → when available; else the order-derived timeline.
  const serverTimeline = Array.isArray(tracking?.timeline) ? tracking.timeline : [];
  const steps = serverTimeline.length
    ? serverTimeline.map((t) => ({
        title: statusLabel(t.status),
        time: t.time,
        detail: t.description,
        completed: t.isCompleted,
      }))
    : buildTimeline(order).map((h) => ({
        title: h.title,
        time: h.time,
        detail: h.remarks,
        completed: h.completed,
      }));

  // First incomplete step = the "current" step (gets the primary ring).
  const currentIndex = steps.findIndex((st) => !st.completed);

  // Best-effort partner name + pay-at-door, shown only when the data exists.
  const partnerName = tracking?.partnerName ?? tracking?.driverName ?? null;
  const payTotal = order?.collectAtDoor;
  const payMethod = order?.paymentMode ?? order?.paymentMethod;
  const showPayRow = Number(payTotal) > 0 && !!payMethod;

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <TopAppBar navigation={navigation} title="Track Order" />

      <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.lg, paddingBottom: 40 }}>

        {/* ETA HERO */}
        {typeof etaMinutes === "number" && etaMinutes > 0 && (
          <View style={[styles.hero, { backgroundColor: theme.brandBlue }]}>
            <View style={[styles.heroDrop, { backgroundColor: theme.brandBlueLight }]} />
            <AppText variant="caption" color={theme.ink}>Arriving in</AppText>
            <AppText variant="display" color={theme.ink} style={styles.heroBig}>{etaMinutes} min</AppText>
            {!!partnerName && (
              <AppText variant="caption" color={theme.ink} style={{ marginTop: 4 }}>
                {`${partnerName} is on the way with your cans`}
              </AppText>
            )}
          </View>
        )}

        {/* ORDER CARD */}
        <View style={[styles.card, { backgroundColor: theme.surfaceCard }]}>
          <View style={styles.orderTopRow}>
            <View style={{ flex: 1 }}>
              <AppText variant="caption" color={theme.inkMuted}>Order</AppText>
              <AppText variant="bodyStrong" color={theme.ink} style={{ marginTop: 2 }}>#{orderId}</AppText>
            </View>
            <StatusBadge status={order?.deliveryStatus ?? order?.status} />
          </View>

          {!!order?.deliveryAddress && (
            <View style={styles.addressRow}>
              <Ionicons name="location-outline" size={18} color={theme.primary} style={{ marginRight: 8, marginTop: 1 }} />
              <AppText variant="caption" color={theme.inkMuted} style={{ flex: 1 }}>{order.deliveryAddress}</AppText>
            </View>
          )}

          {showPayRow && (
            <View style={[styles.payRow, { borderTopColor: theme.borderSubtle }]}>
              <AppText variant="label" color={theme.inkMuted}>{`To Pay at door · ${payMethod}`}</AppText>
              <AppText variant="bodyStrong" color={theme.ink}>₹{Number(payTotal).toFixed(2)}</AppText>
            </View>
          )}
        </View>

        {loading && !tracking && (
          <ActivityIndicator style={{ marginTop: spacing.lg }} color={theme.primary} />
        )}

        {!!error && steps.length === 0 && !loading && (
          <AppText variant="caption" color={theme.inkMuted}>{error}</AppText>
        )}

        {/* TIMELINE CARD */}
        {steps.length > 0 ? (
          <View style={[styles.card, { backgroundColor: theme.surfaceCard }]}>
            <AppText variant="title" color={theme.ink} style={{ marginBottom: spacing.lg }}>Order progress</AppText>

            {steps.map((step, index) => {
              const isCurrent = index === currentIndex;
              const isLast = index === steps.length - 1;
              const dotColor = step.completed ? theme.brandBlue : theme.surfaceCard;
              const ringColor = step.completed ? theme.brandBlue : (isCurrent ? theme.primary : theme.borderStrong);
              const connectorColor = step.completed ? theme.brandBlue : theme.borderSubtle;
              return (
                <View key={index} style={styles.row}>
                  <View style={styles.left}>
                    <View style={[styles.dot, { backgroundColor: dotColor, borderColor: ringColor, borderWidth: step.completed ? 0 : (isCurrent ? 5 : 2) }]} />
                    {!isLast && <View style={[styles.line, { backgroundColor: connectorColor }]} />}
                  </View>
                  <View style={styles.right}>
                    <AppText variant="bodyStrong" color={step.completed || isCurrent ? theme.ink : theme.inkMuted}>
                      {step.title}
                    </AppText>
                    {!!step.detail && <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>{step.detail}</AppText>}
                    {!!step.time && <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>{formatOrderTime(step.time)}</AppText>}
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          !loading && (
            <AppText variant="caption" color={theme.inkMuted}>No tracking updates yet.</AppText>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  hero: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    overflow: "hidden",
  },
  heroDrop: {
    position: "absolute",
    top: -36,
    right: -36,
    width: 140,
    height: 140,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70,
  },
  heroBig: {
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.8,
    marginTop: 2,
  },

  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  orderTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: spacing.md,
  },
  payRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    marginTop: spacing.md,
    paddingTop: spacing.md,
  },

  // timeline
  row: { flexDirection: "row" },
  left: { alignItems: "center", marginRight: spacing.lg },
  dot: { width: 16, height: 16, borderRadius: 8 },
  line: { width: 2, flex: 1, marginVertical: 2 },
  right: { paddingBottom: spacing.lg, flex: 1 },
});
