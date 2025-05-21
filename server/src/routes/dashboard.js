const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { authenticate } = require("../middleware/auth");

// Get admin dashboard summary
router.get("/admin-summary", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const [users, courses, classes, rooms, schedules] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.class.count(),
      prisma.room.count(),
      prisma.schedule.count(),
    ]);

    res.json({ users, courses, classes, rooms, schedules });
  } catch (error) {
    console.error("Error fetching admin summary:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get classes for a teacher
router.get("/teachers/:id/classes", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const teacherClasses = await prisma.class.findMany({
      where: {
        teacherId: id,
      },
      include: {
        course: true,
        students: {
          select: {
            id: true,
          },
        },
      },
    });

    const formattedClasses = teacherClasses.map((cls) => ({
      id: cls.id,
      name: cls.name,
      section: cls.section,
      courseName: cls.course.name,
      courseCode: cls.course.code,
      studentCount: cls.students.length,
    }));

    res.json(formattedClasses);
  } catch (error) {
    console.error("Error fetching teacher classes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get today's schedules for a teacher
router.get("/teachers/:id/schedules/today", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const today = new Date();
    const dayOfWeek = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ][today.getDay()];

    const schedules = await prisma.schedule.findMany({
      where: {
        class: {
          teacherId: id,
        },
        dayOfWeek: dayOfWeek,
      },
      include: {
        class: {
          include: {
            course: true,
          },
        },
        room: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    const formattedSchedules = schedules.map((schedule) => ({
      id: schedule.id,
      className: schedule.class.name,
      courseName: schedule.class.course.name,
      roomName: schedule.room.name,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    }));

    res.json(formattedSchedules);
  } catch (error) {
    console.error("Error fetching teacher schedules:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get enrolled classes for a student
router.get("/students/:id/classes", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const studentClasses = await prisma.class.findMany({
      where: {
        students: {
          some: {
            id: id,
          },
        },
      },
      include: {
        course: true,
        teacher: true,
        // In a real application, we would include grades from a grades table here
      },
    });

    // Mock progress and grades for demonstration
    const formattedClasses = studentClasses.map((cls) => {
      const progress = Math.floor(Math.random() * 100) + 1;
      const grades = ["A", "B+", "B", "C+", "C", "D", "F"];
      const randomGrade =
        Math.random() > 0.3
          ? grades[Math.floor(Math.random() * grades.length)]
          : null;

      return {
        id: cls.id,
        name: cls.name,
        section: cls.section,
        courseName: cls.course.name,
        courseCode: cls.course.code,
        teacherName: cls.teacher.name,
        progress: progress,
        grade: randomGrade,
      };
    });

    res.json(formattedClasses);
  } catch (error) {
    console.error("Error fetching student classes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get today's schedules for a student
router.get("/students/:id/schedules/today", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const today = new Date();
    const dayOfWeek = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ][today.getDay()];

    const schedules = await prisma.schedule.findMany({
      where: {
        class: {
          students: {
            some: {
              id: id,
            },
          },
        },
        dayOfWeek: dayOfWeek,
      },
      include: {
        class: {
          include: {
            course: true,
          },
        },
        room: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    const formattedSchedules = schedules.map((schedule) => ({
      id: schedule.id,
      className: schedule.class.name,
      courseName: schedule.class.course.name,
      roomName: schedule.room.name,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    }));

    res.json(formattedSchedules);
  } catch (error) {
    console.error("Error fetching student schedules:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
