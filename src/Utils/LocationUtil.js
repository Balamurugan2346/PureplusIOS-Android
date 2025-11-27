import { Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  PERMISSIONS,
  RESULTS,
  request,
  check,
} from 'react-native-permissions';

export async function requestLocationPermission() {
  try {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const result = await check(permission);

    if (result === RESULTS.GRANTED) {
      return true;
    }

    const reqResult = await request(permission);

    return reqResult === RESULTS.GRANTED;
  } catch (err) {
    console.log('Permission check error:', err);
    return false;
  }
}

export async function getCurrentLocation() {
//   return new Promise(async (resolve, reject) => {
//     const hasPermission = await requestLocationPermission();

//     if (!hasPermission) {
//       reject({ message: 'Location permission denied' });
//       return;
//     }

//     Geolocation.getCurrentPosition(
//       (position) => {
//         resolve({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//           accuracy: position.coords.accuracy,
//         });
//       },
//       (error) => {
//         reject({
//           message: error.message,
//           code: error.code,
//         });
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 10000,
//         forceRequestLocation: true, // fixes many Android glitches
//       }
//     );
//   });
}
