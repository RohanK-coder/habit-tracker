import { Request, Response } from "express";
import { pool, withTransaction } from "../db/pool";
import { hashPassword, verifyPassword } from "../utils/password";
import { signJwt } from "../utils/jwt";
import { registerSchema, loginSchema } from "../validation/schemas";
import { randomUUID } from "crypto";

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password } = parsed.data;
  try {
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    const exists = Array.isArray(existing) && existing.length > 0;
    if (exists) return res.status(409).json({ error: "Email already registered" });

    const password_hash = await hashPassword(password);
    const userId = randomUUID();

    const user = await withTransaction(async (conn) => {
      await conn.query(
        "INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)",
        [userId, email, password_hash]
      );

      const [templates] = await conn.query<any[]>(
        "SELECT name, description, cadence, target_count FROM habit_templates"
      );

      for (const t of (templates as any[])) {
        const habitId = randomUUID();
        await conn.query(
          `INSERT INTO habits (id, user_id, name, description, cadence, target_count)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [habitId, userId, t.name, t.description || "", t.cadence, t.target_count]
        );
      }

      const [rows] = await conn.query<any[]>(
        "SELECT id, email, created_at FROM users WHERE id = ?",
        [userId]
      );
      return rows[0];
    });

    const token = signJwt({ id: user.id, email: user.email });
    return res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Registration failed" });
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password } = parsed.data;
  try {
    const [rows] = await pool.query<any[]>(
      "SELECT id, email, password_hash FROM users WHERE email = ?",
      [email]
    );
    if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signJwt({ id: user.id, email: user.email });
    return res.json({ user: { id: user.id, email: user.email }, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Login failed" });
  }
}
