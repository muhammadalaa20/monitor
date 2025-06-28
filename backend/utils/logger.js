// utils/logger.js

export function logInfo(message) {
  console.log(`ℹ️  INFO: ${message}`);
}

export function logError(message, error) {
  console.error(`❌ ERROR: ${message}`);
  if (error) console.error(error);
}

export function logRequest(req) {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
}
