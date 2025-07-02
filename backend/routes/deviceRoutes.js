// routes/deviceRoutes.js

import express from 'express';
import {
  fetchDevices,
  fetchDeviceById,
  fetchDevicesByPlace,
  addDevice,
  editDevice,
  removeDevice
} from '../controllers/deviceController.js';

import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken); // Protect all device routes

router.get('/', fetchDevices);             // GET /api/devices
router.get('/:id', fetchDeviceById);      // GET /api/devices/:id
router.get('/place/:place', fetchDevicesByPlace); // GET /api/devices/place/:place
router.post('/', addDevice);              // POST /api/devices
router.put('/:id', editDevice);           // PUT /api/devices/:id
router.delete('/:id', removeDevice);      // DELETE /api/devices/:id

export default router;
