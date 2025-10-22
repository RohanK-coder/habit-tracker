
# Habit Tracker — Fullstack (MySQL)

A complete habit-tracking app with **React + TypeScript + Tailwind (shadcn-style UI)** on the frontend and **Node.js + Express + TypeScript** on the backend. The backend uses **MySQL** (great with **MySQL Workbench**). New users automatically get a starter set of habits. The API supports habit CRUD and daily/weekly/monthly logging.

---

## Features

- 🔐 **JWT auth** (register/login) with bcrypt
- 🧩 **Starter habits**: default templates copied to each new account
- ✅ **Habits**: create, list, update, delete
- 📝 **Logs**: add/check-in, list, delete
- 🛡️ **Zod validation**, Helmet, CORS, Morgan
- 🧪 **TypeScript-first** backend & frontend
- 🧰 Simple **SQL migrations & seed** via TS scripts
- 🎨 Clean UI with Tailwind + shadcn-style components (vendored)

---

## Tech Stack

**Frontend**
- React (Vite) + TypeScript
- Tailwind CSS
- shadcn-style components (local)
- Axios + JWT interceptor
- React Router

**Backend (MySQL)**
- Node.js + Express + TypeScript
- `mysql2/promise`
- Zod, bcryptjs, jsonwebtoken
- Simple migration runner (no ORM)
- UUIDs generated with `crypto.randomUUID()` (CHAR(36) in schema)

---

## Folders

```
client/                  # React app
server/                  # Backend (MySQL)
```

> This README assumes you’re using **MySQL only**.

---

## Prerequisites

- Node.js 18+ and npm
- MySQL 8+ (Workbench optional but recommended)

---

## Backend Setup (MySQL)

**Path:** `habit-tracker-backend-mysql/`

1) **Create the database & user** (CLI or MySQL Workbench):
```sql
CREATE DATABASE habits CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- optional: dedicated app user
CREATE USER 'habit'@'localhost' IDENTIFIED BY 'supersecret';
GRANT ALL PRIVILEGES ON habits.* TO 'habit'@'localhost';
FLUSH PRIVILEGES;
```

2) **Environment**
Copy `.env.example` → `.env`, then set:
```env
DATABASE_URL=mysql://habit:supersecret@localhost:3306/habits
JWT_SECRET=<long_random_string>
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

3) **Install & run**
```bash
npm i
npm run migrate   # applies SQL files in /migrations (multiple statements enabled)
npm run seed      # inserts default habit templates
npm run dev
```
Server: `http://localhost:4000`

**Notes**
- Placeholders are `?` (MySQL style).
- IDs are created as UUIDs in Node; seed SQL uses `UUID()` too.
- Tables use `TIMESTAMP`, `ENUM('daily','weekly','monthly')`, and `TINYINT(1)`.

---

## Frontend Setup

**Path:** `habit-tracker-frontend/`

1) **Environment**
Copy `.env.example` → `.env`:
```env
VITE_API_BASE_URL=http://localhost:4000
```

2) **Install & run**
```bash
npm i
npm run dev
```
App: `http://localhost:5173`

> If you see an error about `@radix-ui/react-slot`, install:
> ```bash
> npm i @radix-ui/react-slot clsx
> ```


---

## API Overview

**Base URL:** `http://localhost:4000`

### Auth
- **POST** `/api/auth/register`  
  Body: `{ "email": string, "password": string }`  
  Creates user and **copies default habit templates**.  
  Returns: `{ user, token }`

- **POST** `/api/auth/login`  
  Body: `{ "email": string, "password": string }`  
  Returns: `{ user, token }`

### Me (auth required)
- **GET** `/api/me` → current user profile

### Habits (auth required)
- **GET** `/api/habits` — list habits  
- **POST** `/api/habits` — create
  ```json
  { "name": "string", "description": "string?", "cadence": "daily|weekly|monthly", "target_count": 1 }
  ```
- **PATCH** `/api/habits/:id` — update any subset of the above
- **DELETE** `/api/habits/:id` — delete habit

### Habit Logs (auth required)
- **GET** `/api/habits/:id/logs` — list logs  
- **POST** `/api/habits/:id/logs`
  ```json
  { "occurs_on": "YYYY-MM-DD", "count": 1, "note": "string?" }
  ```
- **DELETE** `/api/habits/:id/logs/:logId` — delete one log

**Auth header for protected routes**
```
Authorization: Bearer <JWT>
```

**Quick test**
```bash
# Register
curl -X POST http://localhost:4000/api/auth/register   -H "Content-Type: application/json"   -d '{"email":"me@example.com","password":"password123"}'

# Use token from response:
curl http://localhost:4000/api/habits   -H "Authorization: Bearer <TOKEN>"
```

---

## Data Model (conceptual)

```
users
  id (char(36)), email (unique), password_hash, created_at

habit_templates
  id, name, description, cadence('daily'|'weekly'|'monthly'), target_count, created_at

habits
  id, user_id -> users.id, name, description, cadence, target_count, archived, created_at

habit_logs
  id, habit_id -> habits.id, occurs_on(date), count, note, created_at
```

**On registration:** each template from `habit_templates` is copied to the new user’s `habits`.

---

## Scripts (backend)

- `npm run dev` — start dev server (ts-node-dev)
- `npm run migrate` — apply SQL migrations in `/migrations`
- `npm run seed` — insert default habit templates
- `npm run build && npm start` — production build

## Scripts (frontend)

- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build

---

## Production Notes

- Set a strong `JWT_SECRET` and **never** commit `.env`.
- Set `CORS_ORIGIN` to your real frontend origin.
- Serve the frontend and reverse-proxy `/api/*` to the backend (NGINX/Caddy).
- Consider a dedicated DB user with limited privileges.

---

## Troubleshooting (MySQL)

- **Auth plugin error** (`ER_NOT_SUPPORTED_AUTH_MODE`)  
  Either upgrade MySQL client/Server or switch the user to native:
  ```sql
  ALTER USER 'habit'@'localhost' IDENTIFIED WITH mysql_native_password BY 'supersecret';
  FLUSH PRIVILEGES;
  ```

- **Cannot connect**  
  Verify `DATABASE_URL`, DB running, port `3306`, and credentials. Check firewall.

- **Foreign key errors on delete**  
  Logs and habits use `ON DELETE CASCADE`. Ensure tables were created by migrations.

- **CORS blocked**  
  Make sure backend `CORS_ORIGIN` matches the frontend URL.

---

## Next Steps / Ideas

- Streaks & progress indicators
- Weekly/monthly charts
- Editable templates per user
- Password reset & email verification
- Docker Compose for one-command spin-up

---

**License:** Add your preferred license (e.g., MIT).
