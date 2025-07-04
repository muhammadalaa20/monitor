import ping from 'ping';
import { getDb } from '../db/index.js';

export function startPingScheduler(intervalMs = 1000) {
  const db = getDb(); // ⬅️ Synchronous and reusable

  function pingAllDevices() {
    const devices = db.prepare(`SELECT id, ip, status, uptime_seconds FROM devices`).all();

    devices.forEach((device) => {
      ping.promise
        .probe(device.ip, { timeout: .5 })
        .then((result) => {
          const isOnline = result.alive;
          const now = new Date().toISOString();

          if (isOnline) {
            const newUptime = device.status ? device.uptime_seconds + intervalMs / 1000 : 0;
            db.prepare(`
              UPDATE devices
              SET status = 1, last_seen = ?, uptime_seconds = ?
              WHERE id = ?
            `).run(now, newUptime, device.id);
          } else {
            db.prepare(`
              UPDATE devices
              SET status = 0, uptime_seconds = 0
              WHERE id = ?
            `).run(device.id);
          }

          console.log(`${device.ip} → ${isOnline ? '🟢 Online' : '🔴 Offline'}`);
        })
        .catch((err) => {
          console.error(`❌ Failed to ping ${device.ip}`, err);
        });
    });
  }

  setInterval(pingAllDevices, intervalMs);
  console.log(`✅ Ping scheduler with uptime tracking started (every ${intervalMs / 1000}s)`);
}
