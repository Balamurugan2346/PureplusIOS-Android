import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';


export async function getFcmToken() {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
}

export async function createNotificationChannel() {
    await notifee.createChannel({
        id: 'App_Notficiation',
        name: 'App Notifications',
        importance: AndroidImportance.HIGH,
        sound:'default'
    });
}

// export function listenForegroundNotifications() {
//     return messaging().onMessage(async remoteMessage => {
//         await notifee.displayNotification({
//             title: remoteMessage.notification?.title ?? 'New Message',
//             body: remoteMessage.notification?.body ?? '',
//             android: {
//                 channelId: 'default',
//                 pressAction: { id: 'default' },
//             },
//         });
//     });
// }


export function displayNotificationBGState() {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Background message:', remoteMessage);

        // SHOW notification manually
        // await notifee.displayNotification({
        //     // title: remoteMessage.data.title,
        //     // body: remoteMessage.data.body, later we have to change thi
        //     title: remoteMessage.notification?.title ?? 'New Message',
        //     body: remoteMessage.notification?.body ?? '',
        //     android: {
        //         sound:'default',
        //         color: 'red',
        //         channelId: 'App_Notficiation',
        //         pressAction: { id: 'default' },
        //     },
        // });
    });

}

export function setupNotificationTapHandlers() {
    // App opened from background
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Opened from background:', remoteMessage);
        // navigate based on remoteMessage.data
    });

    // App opened from killed state
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log('Opened from quit state:', remoteMessage);
                // navigate based on remoteMessage.data
            }
        });
}
