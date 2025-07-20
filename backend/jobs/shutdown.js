import express from "express";
import { execAsync } from "../utils/execAsync.js";

const router = express.Router();

// POST /api/jobs/shutdown
router.post("/", async (req, res) => {
  const { ip, action } = req.body;

  if (!ip || !["shutdown", "restart"].includes(action)) {
    return res.status(400).json({ error: "Invalid IP or action" });
  }

  // Construct command
  const command =
    action === "restart"
      ? `shutdown /r /f /m \\\\${ip} /t 0`
      : `shutdown /s /f /m \\\\${ip} /t 0`;

  try {
    const { stdout, stderr } = await execAsync(command);
    return res.json({
      success: true,
      output: stdout.trim(),
      errorOutput: stderr?.trim(),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Command execution failed",
      details: err.message,
    });
  }
});

export default router;
