import express from "express";
import {body, param} from "express-validator";
import {Types} from "mongoose";
import agendaController from "../controllers/agendaController";
import validate from "@middlewares/validate";
import appointmentController from "@controllers/appointmentController";

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
router.route("/:id/appointments")
    .get(agendaController.getAppointments)
    .post(
        validate([
            param("id")
                .custom((value: string) => Types.ObjectId.isValid(value)),
            body("name")
                .isString()
                .isLength({min: 5, max: 100})
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

export default router;
