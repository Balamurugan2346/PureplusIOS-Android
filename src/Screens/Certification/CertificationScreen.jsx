import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import StateView from '../../Components/StateView';
import { certificationService } from '../../API/modules/MiscService';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-30 · Certification & Trust (prompt 04 restyle, pureLight). Per-store FSSAI +
 * lab reports + source info. storeId comes from route params (serviceability scope).
 */
const CertificationScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const storeId = route?.params?.storeId ?? 1;
  const [state, setState] = useState({ loading: true, error: null, data: null });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await certificationService.byStore(storeId);
      setState({ loading: false, error: null, data });
    } catch (e) {
      setState({ loading: false, error: e, data: null });
    }
  }, [storeId]);

  useEffect(() => { load(); }, [load]);

  const d = state.data || {};

  return (
    <NavScreen title="Quality & Certification" navigation={navigation} background={theme.surface}>
      <StateView loading={state.loading} error={state.error} onRetry={load}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: spacing.lg, paddingBottom: 40 }}>

          {/* FSSAI */}
          <View style={[styles.card, { backgroundColor: theme.surfaceCard, borderColor: theme.successTint, borderWidth: 1.5 }]}>
            <View style={[styles.leaf, { backgroundColor: theme.successTint }]} pointerEvents="none" />
            <View style={styles.cardHeader}>
              <View style={[styles.circle, { backgroundColor: theme.success }]}>
                <Ionicons name="shield-checkmark-outline" size={22} color={theme.onPrimary} />
              </View>
              <View style={{ flex: 1 }}>
                <AppText variant="bodyStrong" color={theme.ink} style={styles.cardTitle}>FSSAI License</AppText>
                <AppText variant="caption" color={theme.inkMuted}>Food safety licence of your serving store</AppText>
              </View>
            </View>
            <Line theme={theme} label="License number" value={d.fssaiNumber ?? d.fssaiLicense ?? '—'} tabular />
            <Line theme={theme} label="Valid till" value={d.fssaiValidTill ?? d.validity ?? '—'} />
          </View>

          {/* Water quality */}
          <View style={[styles.card, { backgroundColor: theme.surfaceCard }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.circle, { backgroundColor: theme.brandBlue }]}>
                <Ionicons name="water-outline" size={22} color={theme.ink} />
              </View>
              <View style={{ flex: 1 }}>
                <AppText variant="bodyStrong" color={theme.ink} style={styles.cardTitle}>Water quality</AppText>
                <AppText variant="caption" color={theme.inkMuted}>Latest lab testing and treatment</AppText>
              </View>
            </View>
            <Line theme={theme} label="Last lab report" value={d.labReportDate ?? '—'} />
            <Line theme={theme} label="Source" value={d.source ?? '—'} />
            <Line theme={theme} label="Treatment" value={d.treatment ?? '—'} />
          </View>

          <AppText variant="caption" color={theme.inkMuted}>
            Certification is provided by your serving store. This is informational and does not affect ordering.
          </AppText>
        </ScrollView>
      </StateView>
    </NavScreen>
  );
};

const Line = ({ theme, label, value, tabular }) => (
  <View style={styles.line}>
    <AppText variant="label" color={theme.inkMuted}>{label}</AppText>
    <AppText variant="bodyStrong" color={theme.ink} style={tabular ? styles.tabular : undefined}>{String(value)}</AppText>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    overflow: 'hidden',
    gap: spacing.md,
  },
  leaf: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 17, lineHeight: 24 },
  line: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tabular: { fontVariant: ['tabular-nums'] },
});

export default CertificationScreen;
