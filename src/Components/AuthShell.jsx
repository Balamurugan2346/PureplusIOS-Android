import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BrandShape from './BrandShape';
import { useTheme } from '../Context/ThemeContext';
import { radius, spacing, floatShadow } from '../Themes/Themes';

/**
 * Shared auth-shell (redesign 01) for Login / OTP / Name / Email.
 *
 * A sky200 hero with decorative BrandShapes (varied per screen) and a white
 * bottom sheet that wraps its content. Pure UI — no app/logic imports.
 *
 * Keyboard + system-bar handling (iOS + Android, edge-to-edge safe):
 *  - The sheet is lifted by the REAL keyboard height (keyboard events, both
 *    platforms) so the focused input/button is never hidden behind the keyboard.
 *  - When the keyboard is closed, the sheet's bottom padding uses the dynamic
 *    safe-area bottom inset (`useSafeAreaInsets`) so the button clears the
 *    Android gesture/nav bar and the iOS home indicator — no static padding.
 *
 * Props:
 *   variant  - 'login' | 'otp' | 'name' | 'email' (shape placement)
 *   onBack   - if set, renders a 44×44 white back circle top-left
 *   topLeft  - node rendered top-left over the hero (e.g. Login logo lockup)
 *   topRight - node rendered top-right (e.g. "Step 1 of 2")
 *   minHeight- optional minimum sheet height (number) when content is short
 *   children - sheet content
 */
const SHAPES = {
  login: [
    { shape: 'drop', size: 220, color: 'brandBlue', style: { right: -40, top: 30 } },
    { shape: 'leaf', size: 120, color: 'brandGreen', style: { left: 30, top: 150 } },
  ],
  otp: [
    { shape: 'drop', size: 210, color: 'brandBlue', style: { left: -40, top: 60 } },
    { shape: 'leaf', size: 120, color: 'brandGreen', style: { left: 150, top: 150 } },
  ],
  name: [
    { shape: 'drop', size: 220, color: 'brandBlue', style: { right: -50, top: 80 } },
    { shape: 'leaf', size: 110, color: 'brandGreen', style: { left: 20, top: 60 } },
  ],
  email: [
    { shape: 'drop', size: 210, color: 'brandBlue', style: { left: -30, top: 40 } },
    { shape: 'leaf', size: 120, color: 'brandGreen', style: { right: 10, top: 140 } },
  ],
};

const AuthShell = ({ variant = 'login', onBack, topLeft, topRight, minHeight, children }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const shapes = SHAPES[variant] || SHAPES.login;

  // Real keyboard height — iOS uses the "will" events for a smoother lift,
  // Android only reliably fires the "did" events.
  const [kbHeight, setKbHeight] = useState(0);
  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvt, (e) => setKbHeight(e.endCoordinates?.height ?? 0));
    const hide = Keyboard.addListener(hideEvt, () => setKbHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // Detect whether the OS already resized the window for the keyboard
  // (classic adjustResize). If it did, bottom:0 is already above the keyboard
  // and we must NOT lift again. If it didn't (Android 15 edge-to-edge, or iOS),
  // we lift the sheet ourselves by the keyboard height.
  const { height: windowH } = useWindowDimensions();
  const maxWindowH = useRef(windowH);
  if (windowH > maxWindowH.current) maxWindowH.current = windowH;
  const windowResized = maxWindowH.current - windowH > 120;

  const keyboardOpen = kbHeight > 0;
  const effectiveLift = windowResized ? 0 : kbHeight;
  const sheetBottom = keyboardOpen ? effectiveLift : 0;
  // Clear the system bar only when the sheet is at the bottom (keyboard closed).
  const sheetPadBottom = (keyboardOpen ? 0 : insets.bottom) + spacing.xl;
  // Prevent the sheet from colliding with the top bar on small screens / tall keyboards.
  const sheetMaxHeight = keyboardOpen
    ? windowH - effectiveLift - insets.top - spacing.lg
    : undefined;

  return (
    <TouchableWithoutFeedback accessible={false} onPress={() => Keyboard.dismiss()}>
      <View style={[styles.root, { backgroundColor: theme.sky200 }]}>
        {/* hero decoration */}
        {shapes.map((s, i) => (
          <BrandShape key={i} shape={s.shape} size={s.size} color={theme[s.color]} style={s.style} />
        ))}

        {/* top bar */}
        <View style={[styles.topBar, { paddingTop: insets.top + spacing.md }]}>
          <View style={styles.topLeft}>
            {onBack ? (
              <TouchableOpacity onPress={onBack} style={[styles.backCircle, { backgroundColor: theme.surfaceCard }]}>
                <Ionicons name="chevron-back" size={20} color={theme.ink} />
              </TouchableOpacity>
            ) : (
              topLeft
            )}
          </View>
          {topRight ? <View>{topRight}</View> : null}
        </View>

        {/* bottom sheet (wraps content; lifts above the keyboard) */}
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.surfaceCard,
              bottom: sheetBottom,
              maxHeight: sheetMaxHeight,
              minHeight,
            },
            floatShadow,
          ]}
        >
          <ScrollView
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.sheetContent, { paddingBottom: sheetPadBottom }]}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AuthShell;

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topLeft: { flex: 1 },
  backCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 2,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    overflow: 'hidden',
  },
  sheetContent: {
    paddingTop: 32,
    paddingHorizontal: spacing.xl,
    gap: spacing.xl - 4,
  },
});
