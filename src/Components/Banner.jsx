import { ImageBackground, StyleSheet, View } from 'react-native';
import AppText from './AppText';
import BrandShape from './BrandShape';
import { useTheme } from '../Context/ThemeContext';
import { radius, spacing } from '../Themes/Themes';
import { API_BASE_URL } from '../API/Client';

/**
 * Dashboard promo banner card (redesign 02). Props preserved: title, description, img.
 * With an image → photo background + white caption panel (ink text stays readable).
 * Without → brandBlue card with decorative shapes (ink text — never white on brandBlue).
 */
const Banner = ({ title, description, img }) => {
  const { theme } = useTheme();

  if (img) {
    return (
      <View style={[styles.card, { backgroundColor: theme.sky200 }]}>
        <ImageBackground source={{ uri: `${API_BASE_URL + img}` }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <View style={[styles.caption, { backgroundColor: theme.surfaceCard }]}>
          {!!title && <AppText variant="title" color={theme.ink} numberOfLines={1}>{title}</AppText>}
          {!!description && <AppText variant="caption" color={theme.inkMuted} numberOfLines={2}>{description}</AppText>}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, styles.solid, { backgroundColor: theme.brandBlue }]}>
      <BrandShape shape="drop" size={160} color={theme.brandBlueLight} style={{ right: -40, top: -30 }} />
      <BrandShape shape="leaf" size={90} color={theme.brandGreen} style={{ right: 20, bottom: -20 }} />
      {!!title && <AppText variant="title" color={theme.ink} style={styles.solidTitle}>{title}</AppText>}
      {!!description && <AppText variant="caption" color={theme.ink} numberOfLines={2}>{description}</AppText>}
    </View>
  );
};

export default Banner;

const styles = StyleSheet.create({
  card: { width: 300, height: 150, borderRadius: radius.md, overflow: 'hidden', marginRight: spacing.md },
  caption: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing.md },
  solid: { padding: spacing.lg, justifyContent: 'center', gap: spacing.xs },
  solidTitle: { fontSize: 18, lineHeight: 24 },
});
