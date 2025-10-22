import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";

import authRoutes from "./routes/authRoutes";
import habitRoutes from "./routes/habitRoutes";
import meRoutes from "./routes/meRoutes";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/me", meRoutes);

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

export default app;
