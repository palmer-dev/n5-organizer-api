import express from "express";
import { param } from "express-validator";
import { Types } from "mongoose";
import agendaController from "../controllers/agendaController";

const router = express.Router();
// GET /api/agendas
// POST /api/agendas
router.route("/").get(agendaController.browse).post(agendaController.add);

// GET /api/agendas/:id
// PUT /api/agendas/:id
// DELETE /api/agendas/:id
router
  .route("/:id")
  .all(
    param("id")
      .custom((value: string) => Types.ObjectId.isValid(value))
      .customSanitizer((value: string) => new Types.ObjectId(value))
  )
  .get(agendaController.read)
  .put(agendaController.edit)
  .delete(agendaController.destroy);

// GET /api/agendas/:id/appointments
router.route("/:id/appointments").get(agendaController.getAppointments);

export default router;
