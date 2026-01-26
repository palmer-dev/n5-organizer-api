import express from "express";
import { param } from "express-validator";
import { Types } from "mongoose";
import externalAgendaController from "../controllers/externalAgendaController";

const router = express.Router();
// GET /api/externalAgendas
// POST /api/externalAgendas
router
  .route("/")
  .get(externalAgendaController.browse)
  .post(externalAgendaController.add);

// GET /api/externalAgendas/:id
// PUT /api/externalAgendas/:id
// DELETE /api/externalAgendas/:id
router
  .route("/:id")
  .all(
    param("id")
      .custom((value: string) => Types.ObjectId.isValid(value))
      .customSanitizer((value: string) => new Types.ObjectId(value))
  )
  .get(externalAgendaController.read)
  .put(externalAgendaController.edit)
  .delete(externalAgendaController.destroy);

export default router;
