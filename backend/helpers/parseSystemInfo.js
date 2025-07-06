// helpers/parseSystemInfo.js
export function parseSystemInfo(rawOutput) {
  const lines = rawOutput.split('\n').filter(Boolean);
  const data = {};

  for (const line of lines) {
    const [keyRaw, ...valueParts] = line.split(':');
    const key = keyRaw.trim().toLowerCase();
    const value = valueParts.join(':').trim();

    if (key.includes("os name")) data.os = value;
    if (key.includes("system manufacturer")) data.manufacturer = value;
    if (key.includes("system model")) data.model = value;
    if (key.includes("processor(s)")) data.cpu = value;
    if (key.includes("total physical memory")) data.ram = value;
    if (key.includes("host name")) data.hostname = value;
    if (key.includes("system serial number")) data.serial_number = value;
  }

  return data;
}
