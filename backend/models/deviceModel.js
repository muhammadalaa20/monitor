// Device model

// Get all devices
export async function getAllDevices(db, userId) {
  return await db.all(
    `SELECT * FROM devices WHERE user_id = ? ORDER BY id DESC`,
    [userId]
  );
}

// Get device by id
export async function getDeviceById(db, id, userId) {
  return await db.get(
    `SELECT * FROM devices WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
}

// Add device
export async function createDevice(db, device) {
  const {
    name,
    ip,
    type,
    status,
    description,
    last_seen,
    place,
    user_id,
    uptime_seconds = 0
  } = device;

  const result = await db.run(
    `INSERT INTO devices (name, ip, type, status, description, last_seen, place, uptime_seconds, user_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, ip, type, status, description, last_seen, place, uptime_seconds, user_id]
  );

  return { id: result.lastID, ...device };
}

// Update device
export async function updateDevice(db, id, device) {
  const {
    name,
    ip,
    type,
    status,
    description,
    last_seen,
    place
  } = device;

  await db.run(
    `UPDATE devices SET
      name = ?,
      ip = ?,
      type = ?,
      status = ?,
      description = ?,
      last_seen = ?,
      place = ?
     WHERE id = ?`,
    [name, ip, type, status, description, last_seen, place, id]
  );

  return { id, ...device };
}

// Delete device

export async function deleteDevice(db, id, userId) {
  return await db.run(
    `DELETE FROM devices WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
}