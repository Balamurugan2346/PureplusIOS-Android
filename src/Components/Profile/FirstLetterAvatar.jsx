import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FirstLetterAvatar = ({ input, width = 70, height = 70,fontSize = 28 }) => {
    if (!input || typeof input !== 'string') {
        return null;
    }

    // Extract first character and ensure uppercase
    const firstLetter = input.charAt(0).toUpperCase();

    return (
        <View style={[styles.container,{width:width,height:height}]}>
            <Text style={[styles.text,{fontSize:fontSize}]}>{firstLetter}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 50,   // makes it circular
        backgroundColor: '#3274CC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default FirstLetterAvatar;
