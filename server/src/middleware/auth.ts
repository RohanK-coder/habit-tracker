import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }
  const token = auth.slice("Bearer ".length);
  try {
    const payload = verifyJwt<{ id: string; email: string }>(token);
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
