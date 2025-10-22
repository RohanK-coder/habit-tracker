# Habit Tracker Backend — MySQL Variant

This version uses **MySQL** (works great alongside **MySQL Workbench**) instead of PostgreSQL.

## What changed vs Postgres
- Driver: `mysql2/promise`
- SQL placeholders use `?` instead of `$1, $2, ...`
- IDs are generated in Node with `crypto.randomUUID()`
- Schema uses MySQL types (`TIMESTAMP`, `ENUM`, `TINYINT(1)`), and `UUID()` in seed SQL.
- Migrations use `multipleStatements` to run multi-SQL files.

## Quickstart
1. Create a database (via CLI or MySQL Workbench), e.g. `habits`.
2. Copy `.env.example` → `.env`. Example:
   ```env
   DATABASE_URL=mysql://root:password@localhost:3306/habits
   JWT_SECRET=some_long_random_string
   CORS_ORIGIN=http://localhost:5173
   ```
3. Install and run migrations/seed:
   ```bash
   npm i
   npm run migrate
   npm run seed
   npm run dev
   ```
Server runs at `http://localhost:4000`.

Use the same frontend and API as the Postgres version.
