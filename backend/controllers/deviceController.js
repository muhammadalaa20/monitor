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
    const devices = await getAllDevices(db, req.user.id);
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch devices.' });
  }
}

export async function fetchDeviceById(req, res) {
  try {
    const db = await initDb();
    const device = await getDeviceById(db, req.params.id, req.user.id);
    if (!device) return res.status(404).json({ error: 'Device not found.' });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch device.' });
  }
}

export async function addDevice(req, res) {
  try {
    const db = await initDb();
    const deviceData = {
      ...req.body,
      user_id: req.user.id
    };
    const device = await createDevice(db, deviceData);
    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
