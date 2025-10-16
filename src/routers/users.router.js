const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

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

module.exports = router;
