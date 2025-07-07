// routes/devicelogsRoutes.js
import express from "express";
import { getDb } from "../db/index.js";
import {
  getDeviceLogs,
  saveDeviceLogs,
  deleteDeviceLog,
} from "../models/devicelogsModel.js";
import { parseQueryUserOutput } from "../helpers/parseQueryUserOutput.js";
import util from "util";
import { exec } from "child_process";

const execAsync = util.promisify(exec);
const router = express.Router();
const QUERY_PATH = "C:\\Windows\\System32\\query.exe";

router.get("/:deviceId", (req, res) => {
  try {
    const db = getDb();
    const logs = getDeviceLogs(db, req.params.deviceId);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to get logs" });
  }
});

router.post("/:deviceId", async (req, res) => {
  const db = getDb();
  const { deviceId } = req.params;
  const device = db
    .prepare("SELECT ip FROM devices WHERE id = ?")
    .get(deviceId);

  if (!device) return res.status(404).json({ error: "Device not found" });

  try {
    let stdout;
    try {
      ({ stdout } = await execAsync(
        `C:\\Windows\\System32\\query.exe user /server:${device.ip}`
      ));
    } catch (err) {
      // If there's useful stdout, treat it as a success
      if (err.stdout && err.stdout.includes("USERNAME")) {
        stdout = err.stdout;
      } else {
        console.error("Query command failed:", err.message);
        return res
          .status(500)
          .json({ error: "Failed to collect logs: " + err.message });
      }
    }
    const logs = parseQueryUserOutput(stdout);
    saveDeviceLogs(db, deviceId, logs);
    res.status(201).json({ message: "Logs collected successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to collect logs: " + err.message });
  }
});

router.delete("/:logId", (req, res) => {
  try {
    const db = getDb();
    deleteDeviceLog(db, req.params.logId);
    res.json({ message: "Log deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete log" });
  }
});

router.get("/", (req, res) => {
  try {
    const db = getDb();
    const logs = db.prepare("SELECT * FROM devicelogs").all();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to get all logs" });
  }
});

export default router;
