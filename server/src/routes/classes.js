const express = require("express");
const classController = require("../controllers/classController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Admin and teachers can manage classes
router.get("/", authenticate, classController.getClasses);
router.post("/", authenticate, classController.createClass);
router.put("/:id", authenticate, classController.updateClass);
router.delete("/:id", authenticate, classController.deleteClass);

// Student management in classes
router.post("/:id/students", authenticate, classController.addStudentToClass);
router.delete(
  "/:id/students",
  authenticate,
  classController.removeStudentFromClass
);

module.exports = router;
