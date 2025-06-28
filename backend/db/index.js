import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function initDb() {
  const db = await open({
    filename: './db/devices.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);

  await db.exec(`
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

  console.log('✅ SQLite initialized.');
  return db; 
}
