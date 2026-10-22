// import LottieView from 'lottie-react-native';
// import React from 'react';
// import { StyleSheet, View } from 'react-native';

// export default function AppLoading({ isVisible ,style }) {
//     if (!isVisible) return null; // Don't render at all when not visible

//     return (
//         <View style={[styles.container,style]}>
//             <LottieView
//                 source={require('../../assets/animations/WaterAnimation.json')}
//                 autoPlay
//                 loop
//                 style={{ width: 150, height: 150 }}
//                 paused={!isVisible} 
//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         position: 'absolute',
//         top: 0, left: 0, right: 0, bottom: 0,
//         backgroundColor: 'rgba(0,0,0,0.8)',
//         zIndex: 9999,
//     },
// });


import LottieView from 'lottie-react-native';
import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { radius, floatShadow } from '../Themes/Themes';

/**
 * Full-screen loading (00-foundation): the Lottie water animation on a white
 * rounded 160×160 card over the scrim. Prop preserved: `isVisible`.
 */
export default function AppLoading({ isVisible }) {
  const { theme } = useTheme();
  return (
    <Modal visible={isVisible} transparent animationType="fade" statusBarTranslucent>
      <View style={[styles.container, { backgroundColor: theme.scrim }]}>
        <View style={[styles.card, { backgroundColor: theme.surfaceCard }, floatShadow]}>
          <LottieView
            source={require('../../assets/animations/WaterAnimation.json')}
            autoPlay
            loop
            style={{ width: 120, height: 120 }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 160,
    height: 160,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

