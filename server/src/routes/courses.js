const express = require("express");
const courseController = require("../controllers/courseController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Admin and teachers can manage courses
router.get("/", authenticate, courseController.getCourses);
router.post("/", authenticate, courseController.createCourse);
router.put("/:id", authenticate, courseController.updateCourse);
router.delete("/:id", authenticate, courseController.deleteCourse);

module.exports = router;
