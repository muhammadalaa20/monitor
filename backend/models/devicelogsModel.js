// models/devicelogsModel.js

export function saveDeviceLogs(db, deviceId, logsArray) {
  const stmt = db.prepare(`
    INSERT INTO devicelogs (device_id, username, session_name, state, idle_time, logon_time)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const log of logsArray) {
    stmt.run(
      deviceId,
      log.username,
      log.session_name,
      log.state,
      log.idle_time,
      log.logon_time
    );
  }
}

export function getDeviceLogs(db, deviceId) {
  return db.prepare(`
    SELECT logs.*, specs.hostname FROM devicelogs logs
    LEFT JOIN specs ON logs.device_id = specs.device_id
    WHERE logs.device_id = ?
    ORDER BY logs.collected_at DESC
  `).all(deviceId);
}

export function deleteDeviceLog(db, logId) {
  return db.prepare(`DELETE FROM devicelogs WHERE id = ?`).run(logId);
}
