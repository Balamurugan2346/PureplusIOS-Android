import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppText from '../../../Components/AppText';
import Card from '../../../Components/Card';
import TopAppBar from '../../../Components/TopAppBar';
import { useTheme } from '../../../Context/ThemeContext';
import { privacypolicy } from '../../../Documents/Privacypolicy';
import { fontFamily, spacing, radius } from '../../../Themes/Themes';

/**
 * Privacy Policy (redesign 01). Read-only. The policy is a single string constant,
 * so it's split into paragraphs on blank lines and rendered as body copy (14/23).
 * No heading heuristics applied since the constant's structure is unknown.
 */
const PrivacyPolicy = ({ navigation }) => {
  const { theme } = useTheme();

  const paragraphs = String(privacypolicy || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface}}>
      <TopAppBar title="Privacy Policy" navigation={navigation} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={[styles.brandCard,{borderRadius:15}]}>
          <Image source={require('../../../../assets/images/logo_new.png')} resizeMode="contain" style={styles.logo} />
          <Text style={[styles.wordmark, { color: theme.ink }]}>Pureplus</Text>
        </Card>

        <Card style={styles.policyCard}>
          {paragraphs.length ? (
            paragraphs.map((p, i) => (
              <Text key={i} style={[styles.body, { color: theme.ink }, i > 0 && { marginTop: spacing.md }]}>
                {p}
              </Text>
            ))
          ) : (
            <AppText variant="body" color={theme.inkMuted}>Privacy policy is unavailable right now.</AppText>
          )}
        </Card>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  content: { padding: spacing.sm, gap: spacing.lg},
  brandCard: { padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  logo: { width: 40, height: 40 },
  wordmark: { fontFamily: fontFamily.bold, fontSize: 24, lineHeight: 30 },
  policyCard: { padding: spacing.xl, borderRadius: radius.lg },
  body: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 23 },
});
