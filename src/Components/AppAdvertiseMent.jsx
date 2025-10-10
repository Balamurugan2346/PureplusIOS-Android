import { StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Fonts from '../../assets/fonts/Fonts'
import { useTheme } from '../Context/ThemeContext'

const AppAdvertiseMent = () => {

    const {theme} = useTheme()


    const insets = useSafeAreaInsets()

    const headerConfig = {
        color: theme.text,
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.xxxl
    }

    const paratextConfig = {
        color: theme.text,
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.xs
    }


    return (
        <View style={[styles.container,{paddingBottom:insets.bottom}]}>
            <Text style={headerConfig}>ITHU NAMMA OORU APP</Text>

            <Text style={[paratextConfig,{textAlign:"justify"}]}>
                Simple, fast, and made just for you. Originated with ❤️  In chennai
            </Text>
        </View>
    )
}

export default AppAdvertiseMent

const styles = StyleSheet.create({
    container: {
        marginTop:100,
        flex: 1,
        padding:16
    }
})