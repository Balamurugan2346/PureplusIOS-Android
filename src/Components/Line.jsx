import { StyleSheet, View } from 'react-native'

const Line = ({style}) => {
  return (
     <View style={[{ backgroundColor: "grey", opacity:0.12, width: "100%", height: 1 },style]} />
  )
}

export default Line

const styles = StyleSheet.create({})