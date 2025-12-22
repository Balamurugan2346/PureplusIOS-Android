import { Platform, Alert, PermissionsAndroid } from 'react-native';
import { openSettings } from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';


export async function requestNotificationPermission() {

  /* ===================== ANDROID ===================== */
  if (Platform.OS === 'android') {
    const granted = await isAndroidNotificationGranted();

    if (granted) {
      return true;
    }

    const requested = await requestAndroidNotificationPermission();

    if (!requested) {
      Alert.alert(
        'Enable Notifications',
        'Please enable notifications in app settings to stay updated.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openSettings },
        ]
      );
    }

    return requested;
  }

  /* ======================= iOS ======================= */
  const authorizationStatus = await messaging().hasPermission();

  if (
    authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
  ) {
    return true;
  }

  if (authorizationStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
    const newStatus = await messaging().requestPermission({
      alert: true,
      badge: true,
      sound: true,
    });

    return (
      newStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      newStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  }

  // DENIED → settings only
  Alert.alert(
    'Enable Notifications',
    'Please enable notifications from Settings to receive updates.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: openSettings },
    ]
  );

  return false;
}





export async function isAndroidNotificationGranted() {
  if (Platform.Version < 33) {
    // Android 12 and below → auto granted
    return true;
  }

  const result = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  );

  return result === true;
}


export async function requestAndroidNotificationPermission(){
  if (Platform.Version < 33) {
    return true;
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  );

  return result === PermissionsAndroid.RESULTS.GRANTED;
}

