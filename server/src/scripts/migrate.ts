import fs from "fs";
import path from "path";
import { pool } from "../db/pool";

async function ensureTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL UNIQUE,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
}

async function appliedSet(): Promise<Set<string>> {
  const [rows]: any = await pool.query("SELECT filename FROM schema_migrations");
  return new Set(rows.map((r: any) => r.filename));
}

async function applyFile(filePath: string, filename: string) {
  const sql = fs.readFileSync(filePath, "utf8");
  console.log(`[migrate] applying ${filename} ...`);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(sql);
    await conn.query("INSERT INTO schema_migrations (filename) VALUES (?)", [filename]);
    await conn.commit();
    console.log(`[migrate] applied ${filename}`);
  } catch (err) {
    await conn.rollback();
    console.error(`[migrate] FAILED ${filename}`);
    throw err;
  } finally {
    conn.release();
  }
}

async function main() {
  await ensureTable();
  const migrationsDir = path.resolve(__dirname, "../../migrations");
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith(".sql"))
    .sort();

  const done = await appliedSet();
  for (const f of files) {
    if (!done.has(f)) {
      await applyFile(path.join(migrationsDir, f), f);
    } else {
      console.log(`[migrate] already applied: ${f}`);
    }
  }
  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
