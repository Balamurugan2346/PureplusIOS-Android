import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import Fonts from '../../../assets/fonts/Fonts';
import { useTheme } from '../../Context/ThemeContext';
const FilterTag = ({ text, iconNeed = true }) => {

    const { theme } = useTheme()

    const textConfig = {
        color: theme.textForGlassEffext,
        fontFamily: Fonts.family.light,
        fontSize: Fonts.size.xs,
        paddingRight:10
    }

    return (
        <View style={[styles.container, { borderColor: theme.background, marginLeft:10 ,marginVertical:5 }]}>
            <Text style={textConfig}>{text}</Text>
            {iconNeed && <Ionicons name='chevron-down-sharp' />}
        </View>
    )
}

export default FilterTag

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent:"space-between",
        alignSelf: "flex-start",   // 👈 let the container size itself to content
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 30,
        borderWidth: 1,
    }

})