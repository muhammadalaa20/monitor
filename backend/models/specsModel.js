// models/specsModel.js

export function insertSpecs(db, specsData) {
  const {
    device_id,
    os,
    cpu,
    ram,
    hostname,
    manufacturer,
    model,
    serial_number
  } = specsData;

  const stmt = db.prepare(`
    INSERT INTO specs (
      device_id, os, cpu, ram, hostname,
      manufacturer, model, serial_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    device_id, os, cpu, ram, hostname,
    manufacturer, model, serial_number
  );
}

export function saveSpecs(db, deviceId, specs) {
  const stmt = db.prepare(`
    INSERT INTO specs (device_id, os, cpu, ram, hostname, manufacturer, model, serial_number)
    VALUES (@device_id, @os, @cpu, @ram, @hostname, @manufacturer, @model, @serial_number)
  `);

  stmt.run({
    device_id: deviceId,
    os: specs.os || null,
    cpu: specs.cpu || null,
    ram: specs.ram || null,
    hostname: specs.hostname || null,
    manufacturer: specs.manufacturer || null,
    model: specs.model || null,
    serial_number: specs.serial_number || null,
  });
}


export function getSpecsByDeviceId(db, device_id) {
  return db.prepare(`SELECT * FROM specs WHERE device_id = ?`).get(device_id);
}

export function getAllSpecs(db) {
  return db.prepare(`SELECT * FROM specs`).all();
}

export function deleteSpecs(db, id) {
  return db.prepare(`DELETE FROM specs WHERE id = ?`).run(id);
}

export function updateSpecs(db, id, updates) {
  const fields = [];
  const values = [];

  for (const key in updates) {
    fields.push(`${key} = ?`);
    values.push(updates[key]);
  }

  values.push(id);

  const stmt = db.prepare(`
    UPDATE specs SET ${fields.join(', ')}, last_updated = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  return stmt.run(...values);
}
