import Fonts from '../../assets/fonts/Fonts';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../Context/ThemeContext';

const AddressBar = ({ address = "No Address found"  , onClick}) => {

    const {theme} = useTheme()

    const titleConfig = {
        color: theme.text,
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.xs
    }

    return (
        <TouchableOpacity onPress={()=>onClick()} style={styles.container}>
            <Ionicons name="location" size={20} color="#007aff" style={styles.icon} />
            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.addressText,titleConfig]}>
                {address}
            </Text>
        </TouchableOpacity>
    );
};

export default AddressBar;


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.15)',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginTop: 10,
    },
    icon: {
        marginRight: 10,
    },
    addressText: {
        fontSize: 14,
        color: '#222',
        flex: 1,
        fontWeight: '500',
    },
});
