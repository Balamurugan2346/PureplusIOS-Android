// src/data/local/queries.js

// Create User table
export const CREATE_USER_TABLE = `
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    name TEXT,
    email TEXT,
    token TEXT,
    imgID INTEGER,
    mobileNumber TEXT
  );
`;

// Insert User
export const INSERT_USER = `
  INSERT INTO user (userId, name, email, token, imgID, mobileNumber) 
  VALUES (?, ?, ?, ?, ?, ?);
`;

// Get User (fetch first row)
export const GET_USER = `
  SELECT * FROM user LIMIT 1;
`;

// Update User (in case user logs in again or profile changes)
export const UPDATE_USER = `
  UPDATE user 
  SET userId = ?, name = ?, email = ?, token = ?, imgID = ?, mobileNumber = ?
  WHERE id = ?;
`;

// Clear User (logout)
export const CLEAR_USER = `
  DELETE FROM user;
`;
