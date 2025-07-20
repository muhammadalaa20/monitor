import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function killTask(ip, pid) {
  const { stdout } = await execAsync(`taskkill /s ${ip} /pid ${pid} /f`);
  return { success: true, output: stdout };
}
