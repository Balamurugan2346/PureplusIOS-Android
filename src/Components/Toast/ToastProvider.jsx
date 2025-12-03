import React, { createContext, useContext, useState, useCallback } from 'react';
import { Animated, Text, StyleSheet, Dimensions, View } from 'react-native';
import Fonts from '../../../assets/fonts/Fonts';

const ToastContext = createContext();
const { width } = Dimensions.get('window');

export const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [alignTop, setAlignTop] = useState(false);
  const [isError,setIsError] = useState()

  const opacity = new Animated.Value(100);

  const showToast = useCallback((msg, isError = false, options = {}) => {
    setIsError(isError)
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
    <ToastContext.Provider value={{ showToast  , isError , setIsError}}>
      {children}

      {visible && (
        <View
          pointerEvents="none"
          style={[
            styles.container,
            alignTop ? { top: 60 } : { bottom: 60 }
          ]}
        >
          <Animated.View style={[styles.toast, { opacity,backgroundColor: isError ? '#FF4C4C' : '#6BA96E' }]}>
            <Text style={{fontFamily:Fonts.family.regular,fontSize:14,color:'white'}}>{message}</Text>
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
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    maxWidth: width * 0.9,
  },
  text: {
    color: '#fff',
    fontSize: 14,
  },
});
