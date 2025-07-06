// helpers/pingHost.js
import { execSync } from "child_process";

export function isHostOnline(ip) {
  try {
    execSync(`ping -n 1 -w 1000 ${ip}`, { stdio: 'ignore' }); // Windows-style ping
    return true;
  } catch {
    return false;
  }
}
