import { useTheme } from '../Context/ThemeContext';
import Fonts from '../../assets/fonts/Fonts';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AddressWithChangeButton = ({navigation}) => {
    const { theme } = useTheme();

    const headerConfig = {
        color:  theme.greyText,
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.base
    }

    const paratextConfig = {
        color: theme.secondaryText,
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs
    }

    const address = "123, Gandhi Nagar,\nCoimbatore - 641001,\nTamil Nadu";

    return (
        <View style={[styles.container]}>
            <View style={styles.row}>
                <Text style={[headerConfig]}>Delivery Address</Text>
                <TouchableOpacity style={{borderRadius:10,borderWidth:1,borderColor:theme.background,paddingHorizontal:10,paddingVertical:5}} onPress={()=>navigation.goBack()}>
                    <Text style={[styles.changeBtn, { color: theme.greyText }]}>Change</Text>
                </TouchableOpacity>
            </View>

            <Text style={[paratextConfig, { color: theme.secondaryText }]}>
                {address}
            </Text>
        </View>
    );
};

export default AddressWithChangeButton;

const styles = StyleSheet.create({
    container: {
        margin: 12,
        borderRadius: 20,  
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.base,
    },
    changeBtn: {
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.sm,
    },
    addressText: {
        marginTop: 10,
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm,
        lineHeight: 20,
    },
});
