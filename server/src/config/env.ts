import dotenv from "dotenv";
dotenv.config();

const required = (key: string, fallback?: string) => {
  const v = process.env[key] ?? fallback;
  if (!v) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return v;
};

export const env = {
  DATABASE_URL: required("DATABASE_URL"),
  JWT_SECRET: required("JWT_SECRET"),
  PORT: parseInt(process.env.PORT || "4000", 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
};
