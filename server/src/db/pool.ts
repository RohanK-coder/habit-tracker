import mysql from "mysql2/promise";
import { env } from "../config/env";

export const pool = mysql.createPool({
  uri: env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  multipleStatements: true
});

export async function withTransaction<T>(fn: (conn: mysql.PoolConnection) => Promise<T>) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
