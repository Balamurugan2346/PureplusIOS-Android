import { useAppContext } from '../../Context/AppContext';
import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';
import  LinearGradient  from 'react-native-linear-gradient';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddressWithChangeButton from '../../Components/AddressWithChangeButton';
import TopAppBar from '../../Components/TopAppBar';
import AddressInputForm from '../../Screens/Address/AddressInputForms';
const DetailedAddressInputScreen = ({ navigation }) => {


    const insets = useSafeAreaInsets();
    const { addToCart, cart, reduceQuantity, removeFromCart, usersAddress } = useAppContext()
    const { theme } = useTheme()

    const headerConfig = {
        color: theme.greyText,
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.lg
    }

    const paratextConfig = {
        color: theme.secondaryText,
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs
    }


    return (
        <View style={[styles.container, { backgroundColor: theme.secondaryBackground,marginBottom:insets.bottom }]}>

            <TopAppBar title='Add Address' navigation={navigation} />
            <ScrollView>
                <View style={[styles.content]}>
                    <LinearGradient style={styles.cardContainer} colors={[theme.cardContainer, theme.cardContainer]}>
                        <Image source={require('../../../assets/images/StaticMapView.jpeg')} style={{ width: "100%", borderRadius: 20, height: 200 }} />

                        <AddressWithChangeButton navigation={navigation} />

                    </LinearGradient>

                    {/* <HighLightedText text={"Add Address"} style={{ color: theme.greyText }} /> */}

                    <AddressInputForm />
                </View>


                <TouchableOpacity  style={[{
                    backgroundColor: theme.primary,
                    paddingVertical: 10,
                    marginHorizontal:10,
                    marginVertical: 10,
                    borderRadius: 14,
                    alignItems: "center"
                }]}
                >
                    <Text style={[headerConfig,{color:theme.buttonText}]}>Save Address</Text>
                </TouchableOpacity>

            </ScrollView>


        </View>
    )
}

export default DetailedAddressInputScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    content: {
        padding: 10
    },
    mapCard: {
    },


    input: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },

    inputContainer: {

    },
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        flexDirection: "column",
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
})