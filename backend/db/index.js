// db/index.js
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

let db;

export function getDb() {
  if (!db) {
    const dbPath = path.resolve('./db/devices.sqlite');
    const isNew = !fs.existsSync(dbPath);
    db = new Database(dbPath);

    db.pragma('journal_mode = WAL');

    if (isNew) {
      console.log('🆕 Creating new SQLite database...');
    }

    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        ip TEXT NOT NULL UNIQUE,
        type TEXT,
        status BOOLEAN NOT NULL DEFAULT 0,
        description TEXT,
        last_seen TEXT NOT NULL,
        place TEXT,
        uptime_seconds INTEGER DEFAULT 0,
        user_id INTEGER NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
    `);

    console.log('✅ SQLite ready with WAL mode.');
  }

  return db;
}
