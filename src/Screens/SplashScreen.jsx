import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import AppText from '../Components/AppText';
import BrandShape from '../Components/BrandShape';
import { useTheme } from '../Context/ThemeContext';

/**
 * Splash / launch frame (redesign 01). Routing is handled elsewhere
 * (ActivityEntry) — this file stays logic-free: brand mark + wordmark on the
 * light surface with decorative BrandShapes.
 */
const SplashScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: theme.surface }]}>
      <BrandShape shape="drop" size={180} color={theme.sky200} style={{ right: -40, top: -40 }} />
      <BrandShape shape="leaf" size={120} color={theme.primaryTint} style={{ left: -30, bottom: 90 }} />

      <View style={styles.center}>
        <Image
          source={require('../../assets/images/logo_new.png')}
          resizeMode="contain"
          style={styles.logo}
        />
        <AppText variant="display" color={theme.ink} style={styles.wordmark}>Pureplus</AppText>
      </View>

      <AppText variant="caption" color={theme.inkMuted} style={styles.caption}>Made in Chennai</AppText>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  center: { alignItems: 'center' },
  logo: { width: 148, height: 148 },
  wordmark: { marginTop: 20, textAlign: 'center' },
  caption: { position: 'absolute', bottom: 48, alignSelf: 'center' },
});
