// helpers/parseQueryUserOutput.js

export function parseQueryUserOutput(output) {
  const lines = output.trim().split('\n').slice(1); // Skip header line

  return lines.map(line => {
    const match = line.match(/(\S+)\s+(\S+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(.*)/);
    if (!match) return null;

    const [, username, sessionName, id, state, idleTime, logonTime] = match;

    return {
      username,
      session_name: sessionName,
      state,
      idle_time: idleTime,
      logon_time: logonTime.trim()
    };
  }).filter(Boolean);
}
