import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from '../../Components/AppText';
import NavScreen from '../../Components/NavScreen';
import { useTheme } from '../../Context/ThemeContext';
import { radius, spacing } from '../../Themes/Themes';
import ChargesService from '../../API/modules/ChargesService';

/**
 * CUS-34 · Delivery & Charges info screen.
 * Loads live pricing-rule descriptions from GET api/customer/charges/info.
 * Falls back silently to static BA-approved descriptions if the API call fails.
 */

// ─── Static fallback descriptions ────────────────────────────────────────────
const STATIC = {
  delivery:
    'Charged based on the distance between our store and your address. Heavier distances cost more. Free delivery available on larger orders.',
  floor:
    'Applied when delivering to upper floors without a lift. We carry heavy water cans up the stairs — this charge covers that extra effort.',
  convenienceFee:
    'A small fee covering order coordination, processing, and logistics — keeping our service running reliably for you.',
  instant:
    'Choose Instant delivery for an ASAP drop within ~30 minutes. A distance-based surcharge applies. No extra charge for scheduled delivery.',
  gst:
    'Goods and Services Tax (GST) is a mandatory government tax applied as per applicable product rates. Included in your bill automatically.',
  deposit:
    'A security deposit held against the reusable cans we deliver. This is NOT a charge — it\'s fully refunded when cans are returned. Protects our can inventory.',
};

// ─── Card definitions ─────────────────────────────────────────────────────────
const CARDS = [
  {
    key: 'delivery',
    title: 'Delivery Charges',
    icon: 'truck-outline',
    tone: 'primary',
  },
  {
    key: 'floor',
    title: 'Floor Charge',
    icon: 'layers-outline',
    tone: 'warning',
  },
  {
    key: 'convenienceFee',
    title: 'Handling Fee',
    icon: 'settings-outline',
    tone: 'info',
  },
  {
    key: 'instant',
    title: 'Instant Delivery',
    icon: 'flash-outline',
    tone: 'warning',
  },
  {
    key: 'gst',
    title: 'GST',
    icon: 'receipt-outline',
    tone: 'neutral',
  },
  {
    key: 'deposit',
    title: 'Refundable Can Deposit',
    icon: 'water-outline',
    tone: 'success',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
/**
 * Resolve the icon-well and icon colors for a given tone. 'neutral' falls back
 * to inkMuted since there is no `theme.neutral` token for text color.
 */
const toneColors = (theme, tone) => {
  if (tone === 'neutral') {
    return { color: theme.inkMuted, tint: theme.neutralTint ?? theme.surfaceSunken };
  }
  return {
    color: theme[tone] ?? theme.primary,
    tint: theme[`${tone}Tint`] ?? theme.primaryTint,
  };
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const ChargeCard = ({ title, icon, tone, description, theme }) => {
  const { color, tint } = toneColors(theme, tone);
  return (
    <View style={[styles.card, { backgroundColor: theme.surfaceCard }]}>
      {/* header row */}
      <View style={styles.cardHeader}>
        <View style={[styles.iconWell, { backgroundColor: tint }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <AppText variant="bodyStrong" color={theme.ink} style={styles.cardTitle}>
          {title}
        </AppText>
      </View>
      {/* description */}
      <AppText variant="caption" color={theme.inkMuted} style={styles.cardDesc}>
        {description}
      </AppText>
    </View>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────
const ChargesInfoScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ChargesService.info();
      setApiData(data ?? null);
    } catch {
      // Silently fall back to static descriptions — no error UI needed here.
      setApiData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * Resolve the description to show for a card key:
   * prefer the live API description when available, else static fallback.
   */
  const descriptionFor = (key) => {
    const live = apiData?.[key]?.description;
    return live?.trim() ? live : STATIC[key];
  };

  return (
    <NavScreen title="Delivery & Charges" navigation={navigation} background={theme.surface}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* intro blurb */}
          <View style={[styles.introBanner, { backgroundColor: theme.primaryTint }]}>
            <Ionicons name="information-circle-outline" size={18} color={theme.primary} style={{ marginRight: spacing.sm }} />
            <AppText variant="caption" color={theme.primary} style={{ flex: 1 }}>
              All charges are shown transparently before you confirm an order. You're never billed anything you haven't seen.
            </AppText>
          </View>

          {/* charge cards */}
          {CARDS.map((card) => (
            <ChargeCard
              key={card.key}
              title={card.title}
              icon={card.icon}
              tone={card.tone}
              description={descriptionFor(card.key)}
              theme={theme}
            />
          ))}

          <AppText variant="caption" color={theme.inkMuted} style={styles.footer}>
            Rates shown are indicative. Actual charges are computed at checkout and may vary by order type, address, and store policy.
          </AppText>
        </ScrollView>
      )}
    </NavScreen>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    gap: spacing.md,
    paddingBottom: 48,
    paddingTop: spacing.sm,
  },
  introBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  cardDesc: {
    lineHeight: 20,
  },
  footer: {
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 18,
  },
});

export default ChargesInfoScreen;
