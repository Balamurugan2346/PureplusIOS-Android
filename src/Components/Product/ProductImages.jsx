import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

const ProductImages = ({ imageUrls }) => {
    if (imageUrls && imageUrls.length > 0) {
        return (
            <View style={styles.imageContainer}>
                {imageUrls.map((img, index) => (
                    <Image
                        key={index}
                        source={{ uri: img }}
                        style={styles.productImage}
                        resizeMode="contain"
                    />
                ))}
            </View>
        );
    }

    // Fallback: show placeholder with first letter avatar
    return (
        <View style={styles.placeholderContainer}>
            <Image
                source={require('../../../assets/images/no_image.png')}
                style={styles.image}
                resizeMode="cover"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    productImage: {
        width: 350,
        height: 300,
        marginHorizontal: 10,
    },
    image: {
        width: 350,
        height: 300,
    },
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default ProductImages;
