import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getDb } from "./db/index.js"; // use the new getter
import authRoutes from "./routes/authRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import { startPingScheduler } from "./utils/pingScheduler.js";
import specsRoutes from "./routes/specsRoutes.js";
import { runSpecsRetryJob } from "./jobs/specsRetryJob.js";
import devicelogsRoutes from "./routes/devicelogsRoutes.js";
import shutdownJob from "./jobs/shutdown.js";
import jobsRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/specs", specsRoutes);
app.use("/api/devicelogs", devicelogsRoutes);
app.use("/api/jobs/shutdown", shutdownJob);
app.use("/api/jobs", jobsRoutes);

// Schedule the specs retry job to run every minute
setInterval(runSpecsRetryJob, 60 * 1000); // every minute

// Trigger DB initialization by calling the getter
getDb(); // ensure the DB connection and tables are initialized

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Start device ping loop
startPingScheduler(1000);
