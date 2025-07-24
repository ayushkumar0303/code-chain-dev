import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
 
// Setup __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
// Connect to SQLite database
const db = new sqlite3.Database(path.resolve(__dirname, 'surveyDatabase.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});
 
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    firstName TEXT NOT NULL,
    lastName TEXT,
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL
  )`);
 
  db.run(`CREATE TABLE IF NOT EXISTS survey (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    name TEXT,
    gender TEXT,
    age INTEGER,
    occupation TEXT,
    anualIncome INTEGER,
    educationLevel TEXT,
    currentSkills TEXT,
    skillsToLearn TEXT,
    preferredLanguage TEXT,
    contactNumber TEXT,
    FOREIGN KEY (username) REFERENCES users(username)
  )`);
  // db.run(`INSERT OR IGNORE INTO users (firstName, lastName,username, password) VALUES ('admin','admin','superadmin', 'superadmin')`);
 
});
 
export default db;
 
 