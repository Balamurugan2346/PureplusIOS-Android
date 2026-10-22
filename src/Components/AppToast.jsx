import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Context/ThemeContext';
import { fontFamily, radius, spacing, floatShadow } from '../Themes/Themes';

/**
 * Floating toast (00-foundation): ink pill, tone icon + onInk text, floatShadow,
 * centred above the tab bar. Props preserved: visible, message, onHide, duration.
 * Added optional: `isError` (alert icon in danger vs check in success).
 */
const AppToast = ({ visible, message, onHide, duration = 3000, isError = false }) => {
  const { theme } = useTheme();
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide && onHide());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity, backgroundColor: theme.ink }, floatShadow]}>
      <Ionicons
        name={isError ? 'alert-circle' : 'checkmark-circle'}
        size={18}
        color={isError ? theme.danger : theme.success}
      />
      <Text style={[styles.message, { color: theme.onInk }]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    zIndex: 9999,
  },
  message: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default AppToast;
