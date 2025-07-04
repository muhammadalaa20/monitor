import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getDb } from './db/index.js'; // use the new getter
import authRoutes from './routes/authRoutes.js';
import deviceRoutes from './routes/deviceRoutes.js';
import { startPingScheduler } from './utils/pingScheduler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);

// Trigger DB initialization by calling the getter
getDb(); // ensure the DB connection and tables are initialized

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Start device ping loop
startPingScheduler(1000);
