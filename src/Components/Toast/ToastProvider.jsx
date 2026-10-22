import React, { createContext, useContext, useState, useCallback } from 'react';
import { Animated, Text, StyleSheet, Dimensions, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { themes, fontFamily, radius, spacing, floatShadow } from '../../Themes/Themes';

const ToastContext = createContext();
const { width } = Dimensions.get('window');

// This provider renders ABOVE ThemeProvider in the tree, so it can't call
// useTheme(). Pull the token values straight from the active (pureLight) theme
// — keeps all hex literals inside Themes.js.
const t = themes.pureLight;

export const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [alignTop, setAlignTop] = useState(false);
  const [isError, setIsError] = useState();

  const opacity = new Animated.Value(100);

  const showToast = useCallback((msg, isError = false, options = {}) => {
    setIsError(isError);
    setMessage(msg);
    setAlignTop(options.alignTop || false);
    setVisible(true);

    Animated.timing(opacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start(() => setVisible(false));
      }, options.duration || 3000);
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, isError, setIsError }}>
      {children}

      {visible && (
        <View
          pointerEvents="none"
          style={[styles.container, alignTop ? { top: 60 } : { bottom: 100 }]}
        >
          <Animated.View style={[styles.toast, floatShadow, { opacity }]}>
            <Ionicons
              name={isError ? 'alert-circle' : 'checkmark-circle'}
              size={18}
              color={isError ? t.danger : t.success}
            />
            <Text style={styles.text}>{message}</Text>
          </Animated.View>
        </View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    left: 0,
    right: 0,
    zIndex: 999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: t.ink,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
    maxWidth: width * 0.9,
  },
  text: {
    color: t.onInk,
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
  },
});
