import express from "express";
import users from "./users.router";
import appointments from "./appointments.router";
import agendas from "./agendas.router";
import workSchedules from "./work-schedules.router";
import externalAgendas from "./external-agendas.router";
import dashboard from "./dashboard.router";

const router = express.Router();

router.use("/users", users);
router.use("/appointments", appointments);
router.use("/agendas", agendas);
router.use("/work-schedules", workSchedules);
router.use("/external-agendas", externalAgendas);
router.use("/dashboard", dashboard);

export default router;
