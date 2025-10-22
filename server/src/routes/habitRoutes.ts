import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  listHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  listHabitLogs,
  addHabitLog,
  deleteHabitLog,
} from "../controllers/habitsController";

const router = Router();

router.use(requireAuth);

router.get("/", listHabits);
router.post("/", createHabit);
router.patch("/:id", updateHabit);
router.delete("/:id", deleteHabit);

router.get("/:id/logs", listHabitLogs);
router.post("/:id/logs", addHabitLog);
router.delete("/:id/logs/:logId", deleteHabitLog);

export default router;
