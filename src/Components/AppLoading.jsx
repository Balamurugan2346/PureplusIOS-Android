import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function AppLoading({ isVisible ,style }) {
    if (!isVisible) return null; // Don't render at all when not visible

    return (
        <View style={[styles.container,style]}>
            <LottieView
                source={require('../../assets/animations/WaterAnimation.json')}
                autoPlay
                loop
                style={{ width: 150, height: 150 }}
                paused={!isVisible} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 9999,
    },
});

