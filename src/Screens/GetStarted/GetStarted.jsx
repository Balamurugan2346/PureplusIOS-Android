import AppNavButton from '../../Components/AppNavButton';
import { useTheme } from '../../Context/ThemeContext';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../Components/AppButton';
import AppText from '../../Components/AppText';
import AppToast from '../../Components/AppToast';
import { storeData } from '../../OfflineStore/OfflineStore';
import { fontFamily, radius, spacing } from '../../Themes/Themes';

const { width } = Dimensions.get('window');
const CARD_W = width - spacing.xl * 2;

const pages = [
  { title: 'Welcome to Pureplus!', description: "Pureplus brings fresh and safe drinking water right to your doorstep", image: require('../../../assets/images/pureQuality.png') },
  { title: 'Minimal Chemical Treatment', description: "We use an advanced purification process that relies on natural filtration, ensuring our water is pure with significantly fewer chemicals.", image: require('../../../assets/images/purification.png') },
  { title: 'Naturally pure water', description: "Sourced from pristine springs, our water is naturally clean and refreshing, providing you with hydration as nature intended.", image: require('../../../assets/images/DrinkingWater.png') },
];

export default function GetStarted({ navigation }) {
  const { theme } = useTheme();
  const [showToast, setShowToast] = useState(false);
  const [page, setPage] = useState(0);
  const pagerRef = useRef(null);

  useEffect(() => {
    if (pagerRef.current) {
      pagerRef.current.setPage(page);
    }
  }, [page]);

  const nav = () => {
    if (page < 2) {
      setPage((prevPage) => prevPage + 1);
    } else if (page == 2) {
      storeData("isGetStartedViewed", "1");
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.surface }}>
      <StatusBar />
      {showToast && (
        <AppToast
          visible={showToast}
          message="Back button Disabled at this moment"
          onHide={() => setShowToast(false)}
        />
      )}

      <View style={styles.container}>
        {/* Top row: back (from slide 2) · logo · spacer */}
        <View style={styles.topRow}>
          <TouchableOpacity
            disabled={page <= 0}
            style={{ opacity: page > 0 ? 1 : 0 }}
            onPress={page <= 0 ? () => {} : () => setPage(page - 1)}
          >
            <AppNavButton color={theme.ink} />
          </TouchableOpacity>

          <Image source={require('../../../assets/images/logo_new.png')} resizeMode="contain" style={styles.logo} />

          <View style={{ width: 44, height: 44 }} />
        </View>

        {/* Pager: illustration cards */}
        <PagerView
          ref={pagerRef}
          style={styles.pager}
          initialPage={0}
          onPageSelected={(e) => setPage(e.nativeEvent.position)}
        >
          {pages.map((item, index) => (
            <View key={index} style={styles.page}>
              <View style={[styles.card, { backgroundColor: theme.sky200 }]}>
                <Image source={item.image} resizeMode="contain" style={styles.image} />
              </View>
            </View>
          ))}
        </PagerView>

        {/* Text block (updates with the current page) */}
        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: theme.ink }]}>{pages[page].title}</Text>
          <AppText variant="body" color={theme.inkMuted}>{pages[page].description}</AppText>
        </View>

        {/* Bottom row: dots · button */}
        <View style={styles.bottomRow}>
          <View style={styles.dots}>
            {pages.map((_, i) => (
              <View
                key={i}
                style={
                  page === i
                    ? [styles.dotActive, { backgroundColor: theme.primary }]
                    : [styles.dot, { backgroundColor: theme.borderStrong }]
                }
              />
            ))}
          </View>

          <AppButton
            onAction={nav}
            title={page === 2 ? 'Get Started' : 'Next'}
            style={{ width: page === 2 ? 180 : 160 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: 40, gap: spacing.xl },
  topRow: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { width: 36, height: 36 },
  pager: { flex: 1, width: '100%' },
  page: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { width: CARD_W, flex: 1, borderRadius: radius.lg, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  image: { width: CARD_W * 0.8, height: '80%' },
  textBlock: { minHeight: 120, gap: 10 },
  title: { fontFamily: fontFamily.bold, fontSize: 28, lineHeight: 34, letterSpacing: -0.5 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.lg },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { width: 24, height: 8, borderRadius: 4 },
});
