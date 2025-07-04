// Device model using better-sqlite3

// Get all devices
export function getAllDevices(db) {
  return db.prepare(`SELECT * FROM devices ORDER BY id DESC`).all();
}

// Get device by id
export function getDeviceById(db, id) {
  return db.prepare(`SELECT * FROM devices WHERE id = ?`).get(id);
}

// Get devices by place
export function getDevicesByPlace(db, place) {
  return db.prepare(`SELECT * FROM devices WHERE place = ? ORDER BY id DESC`).all(place);
}

// Add device
export function createDevice(db, device) {
  const {
    name,
    ip,
    type,
    status,
    description,
    last_seen,
    place,
    user_id,
    uptime_seconds = 0,
  } = device;

  const stmt = db.prepare(`
    INSERT INTO devices (name, ip, type, status, description, last_seen, place, uptime_seconds, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(name, ip, type, status, description, last_seen, place, uptime_seconds, user_id);
  return { id: result.lastInsertRowid, ...device };
}

// Update device
export function updateDevice(db, id, device) {
  const {
    name,
    ip,
    type,
    status,
    description,
    last_seen,
    place
  } = device;

  db.prepare(`
    UPDATE devices SET
      name = ?,
      ip = ?,
      type = ?,
      status = ?,
      description = ?,
      last_seen = ?,
      place = ?
    WHERE id = ?
  `).run(name, ip, type, status, description, last_seen, place, id);

  return { id, ...device };
}

// Delete device
export function deleteDevice(db, id, userId) {
  return db.prepare(`DELETE FROM devices WHERE id = ? AND user_id = ?`).run(id, userId);
}
