import express from "express";
import validate from "@middlewares/validate";
import { body, param } from "express-validator";
import { Types } from "mongoose";
import AppointmentStatusType from "@/types/AppointmentStatusType";
import appointmentController from "../controllers/appointmentController";

const router = express.Router();
// GET /api/appointments
// POST /api/appointments
router
  .route("/")
  .get(appointmentController.browse)
  .post(
    validate([
      body("name")
        .isString()
        .isLength({ min: 5, max: 100 })
        .withMessage("Invalid name received"),
      body("notes").isString().withMessage("Invalid notes received"),
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
    appointmentController.add
  );

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
    body("ignoreId")
      .custom((value) => {
        return value !== undefined ? Types.ObjectId.isValid(value) : true;
      })
      .customSanitizer((value: string | undefined) =>
        value === undefined ? value : new Types.ObjectId(value)
      ),
  ]),
  appointmentController.search
);

// POST /api/appointments/:id/status
router.route("/:id/status").put(
  validate([
    body("status")
      .isIn(AppointmentStatusType.keys())
      .customSanitizer((value: string) => new AppointmentStatusType(value)),
    body("agendaId")
      .custom((value) => Types.ObjectId.isValid(value))
      .customSanitizer((value: string) => new Types.ObjectId(value))
      .withMessage("Invalid agenda received"),
    param("id")
      .custom((value) => {
        return value !== undefined ? Types.ObjectId.isValid(value) : true;
      })
      .customSanitizer((value: string | undefined) =>
        value === undefined ? value : new Types.ObjectId(value)
      ),
  ]),
  appointmentController.updateStatus
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
  .put(
    validate([
      body("startDate")
        .optional()
        .isISO8601()
        .toDate()
        .withMessage("Invalid start date received"),
      body("endDate")
        .optional()
        .isISO8601()
        .toDate()
        .withMessage("Invalid end date received"),
      body("users")
        .optional()
        .isArray()
        .toArray()
        .withMessage("Invalid users list received"),
      body("users.*")
        .optional()
        .custom((value) => Types.ObjectId.isValid(value))
        .customSanitizer((value: string) => new Types.ObjectId(value))
        .withMessage("Invalid users received"),
      body("status")
        .optional()
        .isIn(AppointmentStatusType.keys())
        .withMessage("Invalid status received"),
      param("id")
        .custom((value) => {
          return value !== undefined ? Types.ObjectId.isValid(value) : true;
        })
        .customSanitizer((value: string | undefined) =>
          value === undefined ? value : new Types.ObjectId(value)
        ),
    ]),
    appointmentController.edit
  )
  .delete(
    validate([
      param("id")
        .custom((value) => {
          return value !== undefined ? Types.ObjectId.isValid(value) : true;
        })
        .customSanitizer((value: string | undefined) =>
          value === undefined ? value : new Types.ObjectId(value)
        ),
    ]),
    appointmentController.destroy
  );

export default router;
