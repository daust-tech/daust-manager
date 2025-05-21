const prisma = require("../lib/prisma");

async function getSchedules(req, res) {
  try {
    // Filter by room or teacher if specified
    const { roomId, teacherId } = req.params;

    const where = {};
    if (roomId) {
      where.roomId = roomId;
    }
    if (teacherId) {
      where.class = {
        teacherId,
      };
    }

    const schedules = await prisma.schedule.findMany({
      where,
      include: {
        class: {
          include: {
            course: true,
            teacher: true,
          },
        },
        room: true,
      },
    });
    res.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ message: "Failed to fetch schedules" });
  }
}

async function createSchedule(req, res) {
  try {
    const { classId, roomId, dayOfWeek, startTime, endTime } = req.body;

    const newSchedule = await prisma.schedule.create({
      data: {
        dayOfWeek,
        startTime,
        endTime,
        class: { connect: { id: classId } },
        room: { connect: { id: roomId } },
      },
      include: {
        class: {
          include: {
            course: true,
            teacher: true,
          },
        },
        room: true,
      },
    });

    res.status(201).json(newSchedule);
  } catch (error) {
    console.error("Error creating schedule:", error);
    res.status(500).json({ message: "Failed to create schedule" });
  }
}

async function updateSchedule(req, res) {
  try {
    const { id } = req.params;
    const { classId, roomId, dayOfWeek, startTime, endTime } = req.body;

    const updatedSchedule = await prisma.schedule.update({
      where: { id },
      data: {
        dayOfWeek,
        startTime,
        endTime,
        class: classId ? { connect: { id: classId } } : undefined,
        room: roomId ? { connect: { id: roomId } } : undefined,
      },
      include: {
        class: {
          include: {
            course: true,
            teacher: true,
          },
        },
        room: true,
      },
    });

    res.json(updatedSchedule);
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({ message: "Failed to update schedule" });
  }
}

async function deleteSchedule(req, res) {
  try {
    const { id } = req.params;

    await prisma.schedule.delete({
      where: { id },
    });

    res.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    res.status(500).json({ message: "Failed to delete schedule" });
  }
}

module.exports = {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
