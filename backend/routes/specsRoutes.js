// routes/specsRoutes.js
import express from 'express';
import { getDb } from '../db/index.js';
import {
  getAllSpecs,
  getSpecsByDeviceId,
  insertSpecs,
  updateSpecs,
  deleteSpecs
} from '../models/specsModel.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const db = getDb();
    const specs = getAllSpecs(db);
    res.json(specs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch specs.' });
  }
});

router.get('/:deviceId', (req, res) => {
  try {
    const db = getDb();
    const specs = getSpecsByDeviceId(db, req.params.deviceId);
    if (!specs) return res.status(404).json({ error: 'Specs not found.' });
    res.json(specs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch specs.' });
  }
});

router.post('/', (req, res) => {
  try {
    const db = getDb();
    insertSpecs(db, req.body);
    res.status(201).json({ message: 'Specs added.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to insert specs.' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const db = getDb();
    const result = updateSpecs(db, req.params.id, req.body);
    res.json({ message: 'Specs updated.', changes: result.changes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update specs.' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const db = getDb();
    const result = deleteSpecs(db, req.params.id);
    res.json({ message: 'Specs deleted.', changes: result.changes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete specs.' });
  }
});

export default router;
