import { useAppContext } from '../../Context/AppContext';
import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import { Image, InteractionManager, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddressWithChangeButton from '../../Components/AddressWithChangeButton';
import TopAppBar from '../../Components/TopAppBar';
import { spacing } from '../../Themes/Themes';
import AddressInputForm from '../../Screens/Address/AddressInputForms';
import { useRoute } from '@react-navigation/native';
const DetailedAddressInputScreen = ({ navigation }) => {


    const insets = useSafeAreaInsets();
    const { theme } = useTheme()
    const route = useRoute();
    const { pickedAddress, isEdit = false } = route.params || {};
    console.log("Got address:", pickedAddress, "isEdit:", isEdit);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.container, { backgroundColor: theme.surface, marginBottom: insets.bottom }]}>
            <TopAppBar title={isEdit ? 'Edit Address' : 'Add Address'} navigation={navigation} />
            <ScrollView>
                <View style={[styles.content]}>
                    <AddressInputForm navigation={navigation} pickedAddress={pickedAddress} isEdit={isEdit} onNavigate={() => {
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
        padding: spacing.md,
    },
})