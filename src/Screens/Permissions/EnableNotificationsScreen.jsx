import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EnableNotificationsScreen() {
  return (
    <View style={styles.container}>
      {/* Top text */}
      <Text style={styles.title}>
        Enable notifications to get{'\n'}
        updates{'\n'}
        about offers, order status{'\n'}
        and more
      </Text>

      {/* Illustration */}
      <Image
        source={require('../../../assets/images/person.png')} // Add your image here
        style={styles.image}
        resizeMode="contain"
      />

      {/* Buttons */}
      <TouchableOpacity style={styles.enableButton}>
        <Text style={styles.enableText}>Enable Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.notNowButton}>
        <Text style={styles.notNowText}>Not now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
    marginBottom: 30,
    lineHeight: 26,
    fontWeight: '500',
  },
  image: {
    width: '100%',
    height: 250,
    marginBottom: 40,
  },
  enableButton: {
    backgroundColor: '#F05454',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  enableText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notNowButton: {
    borderColor: '#F05454',
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  notNowText: {
    color: '#F05454',
    fontSize: 16,
    fontWeight: '600',
  },
});
