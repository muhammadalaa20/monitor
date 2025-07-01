// controllers/deviceController.js

import {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice
} from '../models/deviceModel.js';
import { initDb } from '../db/index.js';

export async function fetchDevices(req, res) {
  try {
    const db = await initDb();
    const devices = await getAllDevices(db);
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch devices.' });
  }
}

export async function fetchDeviceById(req, res) {
  try {
    const db = await initDb();
    const device = await getDeviceById(db, req.params.id);
    if (!device) return res.status(404).json({ error: 'Device not found.' });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch device.' });
  }
}

export async function addDevice(req, res) {
  try {
    const db = await initDb();

    // Ensure user is attached (from auth middleware)
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

    // Basic validation
    if (!name || !ip || !last_seen) {
      return res.status(400).json({ error: "Missing required fields (name, ip, last_seen)" });
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

    const device = await createDevice(db, deviceData);
    res.status(201).json(device);

  } catch (err) {
    console.error("Add Device Error:", err); // 👈 Helps you debug real cause
    res.status(500).json({ error: "Internal Server Error: " + err.message });
  }
}


export async function editDevice(req, res) {
  try {
    const db = await initDb();
    const device = await updateDevice(db, req.params.id, req.body);
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update device.' });
  }
}

export async function removeDevice(req, res) {
  try {
    const db = await initDb();
    const result = await deleteDevice(db, req.params.id, req.user.id);
    if (result.changes === 0)
      return res.status(404).json({ error: 'Device not found.' });
    res.json({ message: 'Device deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete device.' });
  }
}
