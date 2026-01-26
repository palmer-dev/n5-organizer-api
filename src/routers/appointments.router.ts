import express from "express";
import validate from "@middlewares/validate";
import { body, param } from "express-validator";
import { Types } from "mongoose";
import appointmentController from "../controllers/appointmentController";

const router = express.Router();
// GET /api/appointments
// POST /api/appointments
router
  .route("/")
  .get(appointmentController.browse)
  .post(appointmentController.add);

// POST /api/appointments/search
router.route("/search").post(
  validate([
    body("startDate")
      .isISO8601()
      .toDate()
      .withMessage("Invalid start date received"),
    body("endDate")
      .isISO8601()
      .toDate()
      .withMessage("Invalid end date received"),
    body("users")
      .isArray()
      .toArray()
      .withMessage("Invalid users list received"),
    body("users.*")
      .custom((value) => Types.ObjectId.isValid(value))
      .customSanitizer((value: string) => new Types.ObjectId(value))
      .withMessage("Invalid users received"),
  ]),
  appointmentController.search
);

// GET /api/appointments/:id
// PUT /api/appointments/:id
// DELETE /api/appointments/:id
router
  .route("/:id")
  .all(
    param("id")
      .custom((value: string) => Types.ObjectId.isValid(value))
      .customSanitizer((value: string) => new Types.ObjectId(value))
  )
  .get(appointmentController.read)
  .put(appointmentController.edit)
  .delete(appointmentController.destroy);

export default router;
