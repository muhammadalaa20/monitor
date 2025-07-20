import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function getTaskList(ip) {
  const { stdout } = await execAsync(`tasklist /s ${ip}`, { encoding: "utf8" });

  const lines = stdout.split("\n").filter((line) => line.trim() !== "");
  const dataLines = lines.slice(3); // Skip header lines

  const tasks = dataLines.map((line) => {
    const parts = line.trim().split(/\s{2,}/); // split by 2+ spaces
    return {
      imageName: parts[0],
      pid: parts[1],
      sessionName: parts[2],
      sessionNum: parts[3],
      memUsage: parts[4],
    };
  });

  return tasks;
}
