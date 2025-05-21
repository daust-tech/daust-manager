const express = require("express");
const roomController = require("../controllers/roomController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Only admin can manage rooms
router.get("/", authenticate, roomController.getRooms);
router.post("/", authenticate, roomController.createRoom);
router.put("/:id", authenticate, roomController.updateRoom);
router.delete("/:id", authenticate, roomController.deleteRoom);

module.exports = router;
