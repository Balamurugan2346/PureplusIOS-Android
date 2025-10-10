import React, { useRef } from "react";
import { Animated, Dimensions, Pressable, StyleSheet, View } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const BottomSheet = ({ visible, onClose, children }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  return (
    <View pointerEvents={visible ? "auto" : "none"} style={StyleSheet.absoluteFill}>
      {visible && (
        <>
          {/* Dimmed background */}
          <Pressable
            onPress={onClose}
            style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.4)" }]}
          />

          {/* Bottom sheet (always above the dim) */}
          <View style={styles.sheet}>
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
    backgroundColor: "#fff",  // important: solid background so dim doesn’t bleed
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: 200,
    zIndex: 99,
  },
});

export default BottomSheet;
