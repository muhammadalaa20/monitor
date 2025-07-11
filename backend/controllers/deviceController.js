// controllers/deviceController.js

import {
  getAllDevices,
  getDeviceById,
  getDevicesByPlace,
  createDevice,
  updateDevice,
  deleteDevice,
} from "../models/deviceModel.js";
import { execSync } from "child_process";
import { execAsync } from "../utils/execAsync.js";
import { parseSystemInfo } from "../helpers/parseSystemInfo.js";
import { saveSpecs } from "../models/specsModel.js";
import { getDb } from "../db/index.js";

export function fetchDevices(req, res) {
  try {
    const db = getDb();
    const devices = getAllDevices(db);
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch devices." });
  }
}

export function fetchDeviceById(req, res) {
  try {
    const db = getDb();
    const device = getDeviceById(db, req.params.id);
    if (!device) return res.status(404).json({ error: "Device not found." });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch device." });
  }
}

export function fetchDevicesByPlace(req, res) {
  try {
    const db = getDb();
    const devices = getDevicesByPlace(db, req.params.place);
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch devices by place." });
  }
}

export async function addDevice(req, res) {
  try {
    const db = getDb();

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: missing user" });
    }

    const {
      name,
      ip,
      type,
      status = 0,
      description = "",
      last_seen,
      place = "",
      uptime_seconds = 0,
    } = req.body;

    if (!name || !ip || !last_seen) {
      return res
        .status(400)
        .json({ error: "Missing required fields (name, ip, last_seen)" });
    }

    const deviceData = {
      name,
      ip,
      type,
      status,
      description,
      last_seen,
      place,
      uptime_seconds,
      user_id: req.user.id,
    };

    const device = createDevice(db, deviceData);    
    res.status(201).json(device);
    // Start system info collection
    try {
      const { stdout } = await execAsync(`systeminfo /s ${ip}`);
      const parsedSpecs = parseSystemInfo(stdout);
      saveSpecs(db, device.id, parsedSpecs);
    } catch (err) {
      console.warn(
        `System info collection failed for device ${ip}:`,
        err.message
      );

      db.prepare(
        `
    INSERT INTO specs_retry_queue (device_id, attempts, next_retry_time, last_error)
    VALUES (?, ?, DATETIME('now', '+5 minutes'), ?)
  `
      ).run(device.id, 1, err.message);
    }

  } catch (err) {
    console.error("Add Device Error:", err);
    res.status(500).json({ error: "Internal Server Error: " + err.message });
  }
}

export function editDevice(req, res) {
  try {
    const db = getDb();
    const device = updateDevice(db, req.params.id, req.body);
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: "Failed to update device." });
  }
}

export function removeDevice(req, res) {
  try {
    const db = getDb();

    const deviceId = Number(req.params.id);
    const userId = req.user?.id;

    console.log("Attempting to delete device:", deviceId, "for user:", userId);

    if (!deviceId || !userId) {
      console.warn("Missing deviceId or userId.");
      return res.status(400).json({ error: "Missing device ID or user ID." });
    }

    const result = deleteDevice(db, deviceId, userId);

    console.log("Delete result:", result);

    if (!result || result.changes === 0) {
      return res.status(404).json({ error: "Device not found or not owned by user." });
    }

    res.json({ message: "Device deleted." });

  } catch (err) {
    console.error("❌ Error deleting device:", err.message, err.stack);
    res.status(500).json({ error: "Failed to delete device." });
  }
}

