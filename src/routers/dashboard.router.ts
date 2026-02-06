// GET /api/appointments/stats
import express from "express";

import dashboardController from "@controllers/dashboardController";

const router = express.Router();

router.route("/stats").get(dashboardController.stats);
router.route("/upcoming").get(dashboardController.upcoming);

export default router;
