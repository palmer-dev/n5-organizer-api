import express from "express";
import { param } from "express-validator";
import { Types } from "mongoose";
import workScheduleController from "../controllers/workScheduleController";

const router = express.Router();
// GET /api/workSchedules
// POST /api/workSchedules
router
  .route("/")
  .get(workScheduleController.browse)
  .post(workScheduleController.add);

// GET /api/workSchedules/:id
// PUT /api/workSchedules/:id
// DELETE /api/workSchedules/:id
router
  .route("/:id")
  .all(
    param("id")
      .custom((value: string) => Types.ObjectId.isValid(value))
      .customSanitizer((value: string) => new Types.ObjectId(value))
  )
  .get(workScheduleController.read)
  .put(workScheduleController.edit)
  .delete(workScheduleController.destroy);

export default router;
