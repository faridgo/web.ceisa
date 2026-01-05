const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'frd_spedition.db'), { verbose: console.log });

console.log("Running Migration...");

try {
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
    console.log("Migration Success: 'users' table checked/created.");
} catch (error) {
    console.error("Migration Failed:", error);
}
