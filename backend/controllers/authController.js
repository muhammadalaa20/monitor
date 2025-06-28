// controllers/authController.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { initDb } from '../db/index.js';
import { jwtSecret, jwtExpiry } from '../config/jwtConfig.js';

export async function registerUser(req, res) {
  const { username, password } = req.body;

  try {
    const db = await initDb();
    const hashed = await bcrypt.hash(password, 10);

    await db.run(
      `INSERT INTO users (username, password) VALUES (?, ?)`,
      [username, hashed]
    );

    res.status(201).json({ message: 'User registered successfully.' });

  } catch (err) {
    console.error('❌ Registration error:', err.message);

    if (err.message.includes('UNIQUE constraint')) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    res.status(500).json({ error: 'Registration failed.' });
  }
}


export async function loginUser(req, res) {
  const { username, password } = req.body;
  try {
    const db = await initDb();

    const user = await db.get(
      `SELECT * FROM users WHERE username = ?`,
      [username]
    );
    if (!user) return res.status(400).json({ error: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials.' });

    const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret, {
      expiresIn: jwtExpiry
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.' });
  }
}
