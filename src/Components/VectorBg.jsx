import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native'

const VectorBg = ({bgColor = "black",iconTint="black",iconSize=25,icon}) => {
    return (
        <View style={{ backgroundColor: bgColor, borderRadius: 10, width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>

            <View style={{ backgroundColor: "white", width: iconSize, height: iconSize, borderRadius: 30, justifyContent: "center", alignItems: "center" }}>
                <Ionicons name={icon} color={iconTint} size={20} />
            </View>
        </View>
    )
}

export default VectorBg

const styles = StyleSheet.create({})