const prisma = require("../lib/prisma");

async function getRooms(req, res) {
  try {
    const rooms = await prisma.room.findMany();
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
}

async function createRoom(req, res) {
  try {
    const { name, building, floor, type, capacity } = req.body;

    const newRoom = await prisma.room.create({
      data: {
        name,
        building,
        floor,
        type,
        capacity: parseInt(capacity),
      },
    });

    res.status(201).json(newRoom);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Failed to create room" });
  }
}

async function updateRoom(req, res) {
  try {
    const { id } = req.params;
    const { name, building, floor, type, capacity } = req.body;

    const updatedRoom = await prisma.room.update({
      where: { id },
      data: {
        name,
        building,
        floor,
        type,
        capacity: parseInt(capacity),
      },
    });

    res.json(updatedRoom);
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ message: "Failed to update room" });
  }
}

async function deleteRoom(req, res) {
  try {
    const { id } = req.params;

    await prisma.room.delete({
      where: { id },
    });

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ message: "Failed to delete room" });
  }
}

module.exports = {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
};
