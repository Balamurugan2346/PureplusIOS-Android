// // src/data/local/userDao.js
// import { getDb } from './Database';
// import { CLEAR_USER, GET_USER, INSERT_USER } from './Queries';

// export const saveUser = (user) => {
//   return new Promise((resolve, reject) => {
//     const db = getDb();
//     db.transaction(tx => {
//       tx.executeSql(
//         CLEAR_USER, [], // clear existing before insert (keep 1 user logged in)
//         () => {
//           tx.executeSql(
//             INSERT_USER,
//             [user.userId, user.name, user.email, user.token,user.number,user.imgID],
//             (_, result) => resolve(result),
//             (_, err) => reject(err)
//           );
//         }
//       );
//     });
//   });
// };

// export const getUser = () => {
//   return new Promise((resolve, reject) => {
//     const db = getDb();
//     db.transaction(tx => {
//       tx.executeSql(
//         GET_USER,
//         [],
//         (_, { rows }) => {
//           if (rows.length > 0) {
//             resolve(rows.item(0));
//           } else {
//             resolve(null);
//           }
//         },
//         (_, err) => reject(err)
//       );
//     });
//   });
// };

// export const clearUser = () => {
//   return new Promise((resolve, reject) => {
//     const db = getDb();
//     db.transaction(tx => {
//       tx.executeSql(
//         CLEAR_USER,
//         [],
//         () => resolve(true),
//         (_, err) => reject(err)
//       );
//     });
//   });
// };
