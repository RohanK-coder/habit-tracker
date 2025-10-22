import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { pool } from "../db/pool";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query<any[]>("SELECT id, email, created_at FROM users WHERE id = ?", [req.user!.id]);
    if ((rows as any[]).length === 0) return res.status(404).json({ error: "User not found" });
    res.json((rows as any[])[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

export default router;
