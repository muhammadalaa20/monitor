import express from "express";
import { getTaskList } from "../jobs/tasklist.js";
import { killTask } from "../jobs/taskkill.js";

const router = express.Router();

router.get("/tasklist", async (req, res) => {
  try {
    const { ip } = req.query;
    if (!ip) return res.status(400).json({ error: "Missing IP address" });

    const tasks = await getTaskList(ip);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/taskkill", async (req, res) => {
  try {
    const { ip, pid } = req.body;
    if (!ip || !pid)
      return res.status(400).json({ error: "Missing IP or PID" });

    const result = await killTask(ip, pid);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
