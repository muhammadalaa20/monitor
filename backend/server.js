import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db/index.js';
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

initDb().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

startPingScheduler(1000);