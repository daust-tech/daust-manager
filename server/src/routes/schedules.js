const express = require("express");
const scheduleController = require("../controllers/scheduleController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Admin and teachers can manage schedules
router.get("/", authenticate, scheduleController.getSchedules);
router.post("/", authenticate, scheduleController.createSchedule);
router.put("/:id", authenticate, scheduleController.updateSchedule);
router.delete("/:id", authenticate, scheduleController.deleteSchedule);

// Get schedules by room or teacher
router.get("/room/:roomId", authenticate, scheduleController.getSchedules);
router.get(
  "/teacher/:teacherId",
  authenticate,
  scheduleController.getSchedules
);

module.exports = router;
