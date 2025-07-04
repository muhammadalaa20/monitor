// controllers/authController.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "../db/index.js";
import { jwtSecret, jwtExpiry } from "../config/jwtConfig.js";

export function registerUser(req, res) {
  const { username, password } = req.body;

  try {
    const db = getDb();
    const hashed = bcrypt.hashSync(password, 10);

    const stmt = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`);
    stmt.run(username, hashed);

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("❌ Registration error:", err.message);

    if (err.message.includes("UNIQUE constraint")) {
      return res.status(400).json({ error: "Username already exists." });
    }

    res.status(500).json({ error: "Registration failed." });
  }
}

export function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    const db = getDb();

    const stmt = db.prepare(`SELECT * FROM users WHERE username = ?`);
    const user = stmt.get(username);

    if (!user) return res.status(400).json({ error: "Invalid credentials." });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid credentials." });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      jwtSecret,
      { expiresIn: jwtExpiry }
    );

    res.json({
      user: { id: user.id, username: user.username },
      token,
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ error: "Login failed." });
  }
}
