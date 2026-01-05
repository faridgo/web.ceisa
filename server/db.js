const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'frd_spedition.db'), { verbose: console.log });

// Initialize Tables
db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL, 
        customer TEXT,
        date TEXT,
        status TEXT,
        data JSON,
        user_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

console.log("Database initialized successfully.");

module.exports = db;
