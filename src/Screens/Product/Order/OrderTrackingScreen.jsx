import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../../Context/ThemeContext";
import Fonts from "../../../../assets/fonts/Fonts";
import TopAppBar from "../../../Components/TopAppBar";
import { getOrderDetailed } from "../../../Redux/Slices/OrderSlice";
import OrderApi from "../../../API/modules/OrderService";
import { statusLabel, formatOrderTime, buildTimeline } from "../../../Utils/orderStatus";
import { lightSurface } from "../../../Themes/Themes";

/**
 * CUS-18 Track Order — wired to the live tracking APIs, rendered on a WHITE surface
 * (lightSurface) to match the Refill screen; brand `primary` kept for accents.
 *   - GET orders/track/{id} → { orderId, timeline:[{status,time,isCompleted,description}], history }
 *   - GET orders/eta/{id}   → { etaMinutes }
 * The order header (address) still comes from order-detail. ETA is best-effort: its failure
 * must not blank the timeline. Polls every 20s for live updates while the screen is open.
 */
export default function OrderTrackingScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  // White surface palette; keep the brand primary for accents.
  const s = { ...lightSurface, primary: theme.primary };

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

  // Normalize both sources into one step shape so the same (white) renderer draws either:
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

  const etaText =
    typeof etaMinutes === "number" && etaMinutes > 0
      ? `Arriving in about ${etaMinutes} min`
      : null;

  return (
    <View style={[styles.container, { backgroundColor: s.background }]}>
      <TopAppBar navigation={navigation} title="Track Order" />

      <ScrollView>
        {/* ORDER CARD */}
        <View style={[styles.card, { backgroundColor: s.card }]}>
          <Text style={[styles.title, { color: s.text }]}>Order #{orderId}</Text>

          {!!order?.deliveryAddress && (
            <Text style={[styles.subTitle, { color: s.secondaryText }]}>
              {order.deliveryAddress}
            </Text>
          )}

          {etaText && (
            <View style={[styles.etaPill, { backgroundColor: s.primary + "22", borderColor: s.primary }]}>
              <Text style={[styles.etaText, { color: s.primary }]}>{etaText}</Text>
            </View>
          )}
        </View>

        {loading && !tracking && (
          <ActivityIndicator style={{ marginTop: 24 }} color={s.primary} />
        )}

        {!!error && steps.length === 0 && !loading && (
          <Text style={[styles.subTitle, { color: s.secondaryText, marginHorizontal: 20 }]}>
            {error}
          </Text>
        )}

        {/* TIMELINE — one white-themed renderer for server or order-derived steps */}
        {steps.length > 0 ? (
          <View style={styles.timeline}>
            {steps.map((step, index) => (
              <View key={index} style={styles.row}>
                <View style={styles.left}>
                  <View style={[styles.circle, { backgroundColor: step.completed ? s.primary : s.divider }]} />
                  {index !== steps.length - 1 && (
                    <View style={[styles.line, { backgroundColor: step.completed ? s.primary : s.divider }]} />
                  )}
                </View>
                <View style={styles.right}>
                  <Text style={[styles.stepTitle, { color: step.completed ? s.text : s.secondaryText }]}>
                    {step.title}
                  </Text>
                  {!!step.detail && <Text style={[styles.time, { color: s.secondaryText }]}>{step.detail}</Text>}
                  {!!step.time && <Text style={[styles.time, { color: s.secondaryText }]}>{formatOrderTime(step.time)}</Text>}
                </View>
              </View>
            ))}
          </View>
        ) : (
          !loading && (
            <Text style={[styles.subTitle, { color: s.secondaryText, marginHorizontal: 20 }]}>
              No tracking updates yet.
            </Text>
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

  card: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },

  title: {
    fontSize: 18,
    fontFamily: Fonts.family.bold,
  },

  subTitle: {
    fontSize: 13,
    marginTop: 4,
  },

  etaPill: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },

  etaText: {
    fontSize: 13,
    fontFamily: Fonts.family.semiBold,
  },

  // timeline
  timeline: { marginHorizontal: 20, marginTop: 20 },
  row: { flexDirection: "row" },
  left: { alignItems: "center", marginRight: 14 },
  circle: { width: 16, height: 16, borderRadius: 10 },
  line: { width: 2, flex: 1 },
  right: { paddingBottom: 30, flex: 1 },
  stepTitle: { fontSize: 14, fontFamily: Fonts.family.semiBold },
  time: { fontSize: 12, marginTop: 4 },
});
