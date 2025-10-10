import { useTheme } from '../../Context/ThemeContext';
import  LinearGradient  from 'react-native-linear-gradient';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Fonts from '../../../assets/fonts/Fonts';

const BookProduct = ({ title, description, img }) => {


    const { theme, toggleTheme, isDark } = useTheme();

    const headerConfig = {
        color: theme.buttonText,
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.xxl
    }

    const paratextConfig = {
        color: theme.buttonText,
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.xs
    }


    return (
        <LinearGradient
            colors={[
                theme.background,            
                'rgba(29, 113, 215, 0)' ,
            ]}
            start={{ x: 0, y: 0 }}          // Left side
            end={{ x: 1, y: 0 }}            // Right side
            style={styles.container}>

            <ImageBackground
                source={img}
                blurRadius={4}
                style={[{ overflow: "hidden", borderRadius: 16, zIndex: -1, height: 150, width: 300, backgroundColor: theme.primary }, StyleSheet.absoluteFill]}
                resizeMode="cover"
            />


            <View style={styles.innerRow}>
                {/* Left Text Section */}
                <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={headerConfig}>{title}</Text>
                    <Text style={[paratextConfig, { marginTop: 5 }]}>{description}</Text>

                    <TouchableOpacity style={{borderRadius:20,padding:10,backgroundColor:theme.primary,alignItems:"center",marginTop:10}}>
                        <Text style={paratextConfig}>Book Now</Text>
                    </TouchableOpacity>

                </View>

                {/* Right Image Section */}
                <Image
                    source={img}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
        </LinearGradient >
    );
};

export default BookProduct;

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        overflow: 'hidden',
        height: 150,
        width: 300,
        padding: 16,
        marginHorizontal: 8,

    },
    innerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
    },
    title: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.lg,
        marginBottom: 6,
    },
    description: {
        fontFamily: Fonts.family.light,
        fontSize: Fonts.size.sm,
        marginBottom: 12,
        color: '#555',
    },
    button: {
        backgroundColor: '#e85c0d',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    buttonText: {
        color: '#fff',
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.sm,
    },
    image: {
        width: 110,
        height: 110,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "white"
    },
});
