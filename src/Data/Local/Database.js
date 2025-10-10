// import * as SQLite from "expo-sqlite/legacy";



// let db;

// export const getDb = () => {
//   if (!db) {
//     db = SQLite.openDatabase('app.db');
//   }
//   return db;
// };

// // Run initial setup
// export const initDb = () => {
//   const database = getDb();
//   database.transaction(tx => {
//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS user (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           userId TEXT,
//           name TEXT,
//           email TEXT,
//           token TEXT,
//           imgID INTEGER,
//           mobileNumber TEXT
//       );`
//     );
//   });
// };
