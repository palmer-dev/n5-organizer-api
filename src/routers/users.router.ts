import express from "express";
import { param } from "express-validator";
import { Types } from "mongoose";
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
  .all(
    param("id")
      .custom((value: string) => Types.ObjectId.isValid(value))
      .customSanitizer((value: string) => new Types.ObjectId(value))
  )
  .get(userController.read)
  .put(userController.edit)
  .delete(userController.destroy);

export default router;
