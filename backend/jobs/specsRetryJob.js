import { getDb } from "../db/index.js";
import { execAsync } from "../utils/execAsync.js";
import { saveSpecs } from "../models/specsModel.js";
import { parseSystemInfo } from "../helpers/parseSystemInfo.js";

export async function runSpecsRetryJob() {
  const db = getDb();

  const now = new Date().toISOString();
  const retries = db.prepare(`
    SELECT * FROM specs_retry_queue
    WHERE next_retry_time <= ?
    ORDER BY next_retry_time ASC
    LIMIT 5
  `).all(now);

  for (const retry of retries) {
    const device = db.prepare(`SELECT * FROM devices WHERE id = ?`).get(retry.device_id);
    if (!device) continue;

    try {
      const { stdout } = await execAsync(`systeminfo /s ${device.ip}`);
      const parsed = parseSystemInfo(stdout);
      saveSpecs(db, retry.device_id, parsed);

      db.prepare(`DELETE FROM specs_retry_queue WHERE id = ?`).run(retry.id);
    } catch (err) {
      const nextRetry = `+${Math.min(60, 5 * (retry.attempts + 1))} minutes`;
      db.prepare(`
        UPDATE specs_retry_queue
        SET attempts = attempts + 1,
            next_retry_time = DATETIME('now', ?),
            last_error = ?
        WHERE id = ?
      `).run(nextRetry, err.message, retry.id);
    }
  }
}
