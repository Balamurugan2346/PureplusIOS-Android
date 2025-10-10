import  Ionicons  from 'react-native-vector-icons/Ionicons';
import { ImageBackground, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

const CustomDialog = ({ visible, setVisible }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.dialogContainer}>
          {/* Background image with overlay */}
          <ImageBackground
            source={require('../../assets/images/FastDelivery.png')}
            style={StyleSheet.absoluteFillObject}
            imageStyle={styles.bgImage}
          >
            <View style={styles.innerOverlay} />
          </ImageBackground>

          {/* Close icon */}
          <TouchableOpacity style={styles.closeIcon} onPress={() => setVisible(false)}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>

          {/* Title */}
          {/* <Text style={styles.title}>Fast Delivery</Text> */}

          {/* Paragraph */}
          {/* <Text style={styles.paragraph}>
            We deliver your Pure Plus water cans within minutes. Sit back and relax while we bring fresh water to your doorstep!
          </Text> */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogContainer: {
    width: '90%',
    height:"60%",
    borderRadius: 20,
    overflow: 'hidden', // ensures image stays clipped in rounded container
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  bgImage: {
    resizeMode: 'cover',
  },
  innerOverlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(255,255,255,0.3)', // light white overlay for softening
  },
  closeIcon: {
    position: 'absolute',
    backgroundColor:"white",
    borderRadius:30,
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 10,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CustomDialog;
