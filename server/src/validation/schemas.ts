import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const habitCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().max(500).optional().default(""),
  cadence: z.enum(["daily", "weekly", "monthly"]).default("daily"),
  target_count: z.number().int().min(1).max(100).default(1),
});

export const habitUpdateSchema = habitCreateSchema.partial();

export const logCreateSchema = z.object({
  occurs_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  count: z.number().int().min(1).max(100).default(1),
  note: z.string().max(500).optional(),
});
