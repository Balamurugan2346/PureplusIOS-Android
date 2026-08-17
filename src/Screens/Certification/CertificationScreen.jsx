import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import StateView from '../../Components/StateView';
import { certificationService } from '../../API/modules/MiscService';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-30 · Certification & Trust. Per-store FSSAI + lab reports + source info.
 * Pass the resolved storeId via route params (from serviceability / active address).
 */
const CertificationScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const storeId = route?.params?.storeId ?? 1; // TODO: pass the resolved store from address scope
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
    <NavScreen title="Quality & Certification" navigation={navigation}>
      <StateView loading={state.loading} error={state.error} onRetry={load}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card theme={theme} title="FSSAI License">
            <Line theme={theme} label="License number" value={d.fssaiNumber ?? d.fssaiLicense ?? '—'} />
            <Line theme={theme} label="Valid till" value={d.fssaiValidTill ?? d.validity ?? '—'} />
          </Card>

          <Card theme={theme} title="Water quality">
            <Line theme={theme} label="Last lab report" value={d.labReportDate ?? '—'} />
            <Line theme={theme} label="Source" value={d.source ?? '—'} />
            <Line theme={theme} label="Treatment" value={d.treatment ?? '—'} />
          </Card>

          <AppText variant="caption" color={theme.secondaryText} style={{ marginTop: spacing.md }}>
            Certification is provided by your serving store. This is informational and does not affect ordering.
          </AppText>
        </ScrollView>
      </StateView>
    </NavScreen>
  );
};

const Card = ({ theme, title, children }) => (
  <View style={[styles.card, { backgroundColor: theme.card }]}>
    <AppText variant="bodyStrong" color={theme.highlightedText} style={{ marginBottom: spacing.sm }}>{title}</AppText>
    {children}
  </View>
);

const Line = ({ theme, label, value }) => (
  <View style={styles.line}>
    <AppText variant="body" color={theme.secondaryText}>{label}</AppText>
    <AppText variant="bodyStrong" color={theme.text}>{String(value)}</AppText>
  </View>
);

const styles = StyleSheet.create({
  card: { borderRadius: radius.md, padding: spacing.lg, marginTop: spacing.md },
  line: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
});

export default CertificationScreen;
