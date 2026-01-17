import express from "express";
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
  .get(workScheduleController.read)
  .put(workScheduleController.edit)
  .delete(workScheduleController.destroy);

export default router;
