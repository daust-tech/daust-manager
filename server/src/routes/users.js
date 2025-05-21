const express = require("express");
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Only admin can manage users
router.get("/", authenticate, userController.getUsers);
router.post("/", authenticate, userController.createUser);
router.put("/:id", authenticate, userController.updateUser);
router.delete("/:id", authenticate, userController.deleteUser);

module.exports = router;
