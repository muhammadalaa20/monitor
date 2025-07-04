// controllers/deviceController.js

import {
  getAllDevices,
  getDeviceById,
  getDevicesByPlace,
  createDevice,
  updateDevice,
  deleteDevice
} from '../models/deviceModel.js';

import { getDb } from '../db/index.js';

export function fetchDevices(req, res) {
  try {
    const db = getDb();
    const devices = getAllDevices(db);
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch devices.' });
  }
}

export function fetchDeviceById(req, res) {
  try {
    const db = getDb();
    const device = getDeviceById(db, req.params.id);
    if (!device) return res.status(404).json({ error: 'Device not found.' });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch device.' });
  }
}

export function fetchDevicesByPlace(req, res) {
  try {
    const db = getDb();
    const devices = getDevicesByPlace(db, req.params.place);
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch devices by place.' });
  }
}

export function addDevice(req, res) {
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

    const device = createDevice(db, deviceData);
    res.status(201).json(device);

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
    res.status(500).json({ error: 'Failed to update device.' });
  }
}

export function removeDevice(req, res) {
  try {
    const db = getDb();
    const result = deleteDevice(db, req.params.id, req.user.id);
    if (!result || result.changes === 0) {
      return res.status(404).json({ error: 'Device not found.' });
    }
    res.json({ message: 'Device deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete device.' });
  }
}
