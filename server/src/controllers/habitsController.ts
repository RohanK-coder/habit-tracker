import { Request, Response } from "express";
import { pool } from "../db/pool";
import { habitCreateSchema, habitUpdateSchema, logCreateSchema } from "../validation/schemas";
import { randomUUID } from "crypto";

export async function listHabits(req: Request, res: Response) {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, description, cadence, target_count, archived, created_at FROM habits WHERE user_id = ? ORDER BY created_at ASC",
      [req.user!.id]
    );
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to list habits" });
  }
}

export async function createHabit(req: Request, res: Response) {
  const parsed = habitCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { name, description, cadence, target_count } = parsed.data;
  const id = randomUUID();
  try {
    await pool.query(
      `INSERT INTO habits (id, user_id, name, description, cadence, target_count)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, req.user!.id, name, description, cadence, target_count]
    );
    const [rows] = await pool.query<any[]>(
      "SELECT id, name, description, cadence, target_count, archived, created_at FROM habits WHERE id = ?",
      [id]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create habit" });
  }
}

export async function updateHabit(req: Request, res: Response) {
  const parsed = habitUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const habitId = req.params.id;
  const entries = Object.entries(parsed.data);
  if (entries.length === 0) return res.status(400).json({ error: "Nothing to update" });

  const setClauses = entries.map(([k]) => `${k} = ?`).join(", ");
  const values = entries.map(([_, v]) => v);

  try {
    const params = [...values, habitId, req.user!.id];
    await pool.query(
      `UPDATE habits SET ${setClauses} WHERE id = ? AND user_id = ?`,
      params
    );
    const [rows] = await pool.query<any[]>(
      "SELECT id, name, description, cadence, target_count, archived, created_at FROM habits WHERE id = ?",
      [habitId]
    );
    if ((rows as any[]).length === 0) return res.status(404).json({ error: "Habit not found" });
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update habit" });
  }
}

export async function deleteHabit(req: Request, res: Response) {
  const habitId = req.params.id;
  try {
    const [result]: any = await pool.query(
      "DELETE FROM habits WHERE id = ? AND user_id = ?",
      [habitId, req.user!.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Habit not found" });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete habit" });
  }
}

export async function listHabitLogs(req: Request, res: Response) {
  const habitId = req.params.id;
  try {
    const [h]: any[] = await pool.query("SELECT id FROM habits WHERE id = ? AND user_id = ?", [habitId, req.user!.id]);
    const has = Array.isArray(h) && h.length > 0;
    if (!has) return res.status(404).json({ error: "Habit not found" });

    const [rows] = await pool.query(
      `SELECT id, occurs_on, count, note, created_at
       FROM habit_logs WHERE habit_id = ?
       ORDER BY occurs_on DESC, created_at DESC`,
      [habitId]
    );
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to list logs" });
  }
}

export async function addHabitLog(req: Request, res: Response) {
  const habitId = req.params.id;
  const parsed = logCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  try {
    const [h]: any[] = await pool.query("SELECT id FROM habits WHERE id = ? AND user_id = ?", [habitId, req.user!.id]);
    const has = Array.isArray(h) && h.length > 0;
    if (!has) return res.status(404).json({ error: "Habit not found" });

    const { occurs_on, count, note } = parsed.data;
    const id = (await import("crypto")).randomUUID();
    await pool.query(
      `INSERT INTO habit_logs (id, habit_id, occurs_on, count, note)
       VALUES (?, ?, ?, ?, ?)`,
      [id, habitId, occurs_on, count, note ?? null]
    );
    const [rows] = await pool.query<any[]>(
      "SELECT id, occurs_on, count, note, created_at FROM habit_logs WHERE id = ?",
      [id]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to add log" });
  }
}

export async function deleteHabitLog(req: Request, res: Response) {
  const habitId = req.params.id;
  const logId = req.params.logId;
  try {
    const [h]: any[] = await pool.query("SELECT id FROM habits WHERE id = ? AND user_id = ?", [habitId, req.user!.id]);
    const has = Array.isArray(h) && h.length > 0;
    if (!has) return res.status(404).json({ error: "Habit not found" });

    const [result]: any = await pool.query(
      "DELETE FROM habit_logs WHERE id = ? AND habit_id = ?",
      [logId, habitId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Log not found" });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete log" });
  }
}
