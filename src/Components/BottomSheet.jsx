import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../Context/ThemeContext";
import { radius, spacing, floatShadow } from "../Themes/Themes";

/**
 * BottomSheet (00-foundation): scrim backdrop (tap closes); white sheet, top
 * radius 32, floatShadow, 40×4 grab handle at the top. Props preserved:
 * `visible`, `onClose`, `children`.
 */
const BottomSheet = ({ visible, onClose, children }) => {
  const { theme } = useTheme();

  return (
    <View pointerEvents={visible ? "auto" : "none"} style={StyleSheet.absoluteFill}>
      {visible && (
        <>
          <Pressable onPress={onClose} style={[StyleSheet.absoluteFill, { backgroundColor: theme.scrim }]} />

          <View style={[styles.sheet, { backgroundColor: theme.surfaceCard }, floatShadow]}>
            <View style={[styles.handle, { backgroundColor: theme.borderSubtle }]} />
            {children}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "60%",
    minHeight: 200,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    zIndex: 99,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
});

export default BottomSheet;
