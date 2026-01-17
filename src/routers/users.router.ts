import express from "express";
import userController from "../controllers/userController";

const router = express.Router();

// GET /api/users
// POST /api/users
router.route("/").get(userController.browse).post(userController.add);

// GET /api/users/:id
// PUT /api/users/:id
// DELETE /api/users/:id
router
  .route("/:id")
  .get(userController.read)
  .put(userController.edit)
  .delete(userController.destroy);

export default router;
