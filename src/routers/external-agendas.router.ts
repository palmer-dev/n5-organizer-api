import express from "express";
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
  .get(externalAgendaController.read)
  .put(externalAgendaController.edit)
  .delete(externalAgendaController.destroy);

export default router;
