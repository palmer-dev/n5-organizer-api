import express from "express";
import appointmentController from "../controllers/appointmentController";

const router = express.Router();
// GET /api/appointments
// POST /api/appointments
router
  .route("/")
  .get(appointmentController.browse)
  .post(appointmentController.add);

// GET /api/appointments/:id
// PUT /api/appointments/:id
// DELETE /api/appointments/:id
router
  .route("/:id")
  .get(appointmentController.read)
  .put(appointmentController.edit)
  .delete(appointmentController.destroy);

export default router;
