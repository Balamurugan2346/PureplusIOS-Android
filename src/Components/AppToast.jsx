import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';

const AppToast = ({ visible, message, onHide, duration = 3000 }) => {
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
    <Animated.View style={[styles.toastContainer, { opacity }]}>
      <Image
        source={require('../../assets/images/lock.png')} // 🔁 Replace with your app logo path
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};


const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    zIndex: 9999,
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  message: {
    color: '#fff',
    fontSize: 14,
  },
});


export default AppToast;
