import { pool } from "../db/pool";

async function main() {
  const [rows]: any = await pool.query("SELECT COUNT(*) AS c FROM habit_templates");
  const count = Number(rows[0]?.c ?? 0);
  if (count > 0) {
    console.log("[seed] Templates already exist; skipping");
    process.exit(0);
  }

  console.log("[seed] Seeding habit templates...");
  await pool.query(`
    INSERT INTO habit_templates (id, name, description, cadence, target_count) VALUES
      (UUID(), 'Drink water', 'Have at least 8 cups of water', 'daily', 8),
      (UUID(), 'Read', 'Read for at least 15 minutes', 'daily', 1),
      (UUID(), 'Exercise', 'Move your body or work out', 'daily', 1),
      (UUID(), 'Meditate', 'Sit quietly and breathe', 'daily', 1),
      (UUID(), 'Sleep by 11pm', 'Lights out by 11:00 pm', 'daily', 1),
      (UUID(), 'Weekly Review', 'Reflect on the week and plan next', 'weekly', 1)
  `);
  console.log("[seed] Done.");
  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
