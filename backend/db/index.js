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

      CREATE TABLE IF NOT EXISTS specs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id INTEGER,
  os TEXT,
  cpu TEXT,
  ram TEXT,
  hostname TEXT,
  manufacturer TEXT,
  model TEXT,
  serial_number TEXT,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS specs_retry_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id INTEGER NOT NULL,
  attempts INTEGER DEFAULT 0,
  next_retry_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_error TEXT,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS devicelogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id INTEGER,
  username TEXT,
  session_name TEXT,
  state TEXT,
  idle_time TEXT,
  logon_time TEXT,
  collected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id)
);

    `);

    console.log('✅ SQLite ready with WAL mode.');
  }

  return db;
}
