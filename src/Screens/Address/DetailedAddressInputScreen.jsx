import { useAppContext } from '../../Context/AppContext';
import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import { Image, InteractionManager, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddressWithChangeButton from '../../Components/AddressWithChangeButton';
import TopAppBar from '../../Components/TopAppBar';
import AddressInputForm from '../../Screens/Address/AddressInputForms';
import { useRoute } from '@react-navigation/native';
const DetailedAddressInputScreen = ({ navigation }) => {


    const insets = useSafeAreaInsets();
    const { theme } = useTheme()
    const route = useRoute();
    const { pickedAddress } = route.params || {};
    console.log("Got address:", pickedAddress);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.container, { backgroundColor: theme.secondaryBackground, marginBottom: insets.bottom }]}>
            <TopAppBar title='Add Address' navigation={navigation} />
            <ScrollView>
                <View style={[styles.content]}>
                    <AddressInputForm navigation={navigation} pickedAddress={pickedAddress} onNavigate={() => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: "DashBoard" }],
                        });
                    }} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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