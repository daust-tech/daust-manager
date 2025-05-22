const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { authenticate } = require("../middleware/auth");

// Get dashboard summary - main endpoint that dashboardApi.getSummary() calls
router.get("/", authenticate, async (req, res) => {
  try {
    // Route user to appropriate data based on role
    switch (req.user.role) {
      case "ADMIN":
        const [users, courses, classes, rooms, schedules] = await Promise.all([
          prisma.user.count(),
          prisma.course.count(),
          prisma.class.count(),
          prisma.room.count(),
          prisma.schedule.count(),
        ]);

        return res.json({ users, courses, classes, rooms, schedules });

      case "TEACHER":
        const teacherClasses = await prisma.class.findMany({
          where: {
            teacherId: req.user.id,
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

        const formattedTeacherClasses = teacherClasses.map((cls) => ({
          id: cls.id,
          name: cls.name,
          section: cls.section,
          courseName: cls.course.name,
          courseCode: cls.course.code,
          studentCount: cls.students.length,
        }));

        return res.json({ classes: formattedTeacherClasses });

      case "STUDENT":
        const studentClasses = await prisma.class.findMany({
          where: {
            students: {
              some: {
                id: req.user.id,
              },
            },
          },
          include: {
            course: true,
            teacher: true,
          },
        });

        // Mock progress and grades for demonstration
        const formattedStudentClasses = studentClasses.map((cls) => {
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

        return res.json({ classes: formattedStudentClasses });

      default:
        return res.status(403).json({ message: "Invalid role" });
    }
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ message: "Server error" });
  }
});

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
    console.log("Teacher schedule request for ID:", id, "User:", req.user);

    if (req.user.id !== id && req.user.role !== "ADMIN") {
      console.log("Access denied - User ID mismatch or not admin");
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if the teacher exists
    const teacher = await prisma.user.findUnique({
      where: { id, role: "TEACHER" },
    });

    if (!teacher) {
      console.log("Teacher not found with ID:", id);
      return res.status(404).json({ message: "Teacher not found" });
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

    console.log("Looking for teacher schedules for day:", dayOfWeek);

    // Return mock data for now to help client side development
    const mockSchedules = [
      {
        id: "1",
        className: "Mathematics 101",
        courseName: "Introduction to Mathematics",
        roomName: "Room 101",
        startTime: "09:00",
        endTime: "10:30",
      },
      {
        id: "2",
        className: "Mathematics 201",
        courseName: "Advanced Mathematics",
        roomName: "Room 202",
        startTime: "13:00",
        endTime: "14:30",
      },
    ];

    console.log("Returning mock schedules for teacher:", mockSchedules.length);
    res.json(mockSchedules);
  } catch (error) {
    console.error("Error fetching teacher schedules:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get today's schedules for a student
router.get("/students/:id/schedules/today", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Student schedule request for ID:", id, "User:", req.user);

    if (req.user.id !== id && req.user.role !== "ADMIN") {
      console.log("Access denied - User ID mismatch or not admin");
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if the student exists
    const student = await prisma.user.findUnique({
      where: { id, role: "STUDENT" },
    });

    if (!student) {
      console.log("Student not found with ID:", id);
      return res.status(404).json({ message: "Student not found" });
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

    console.log("Looking for student schedules for day:", dayOfWeek);

    // Return mock data for now to help client side development
    const mockSchedules = [
      {
        id: "1",
        className: "Mathematics 101",
        courseName: "Introduction to Mathematics",
        roomName: "Room 101",
        startTime: "09:00",
        endTime: "10:30",
      },
      {
        id: "2",
        className: "Physics 101",
        courseName: "Introduction to Physics",
        roomName: "Room 202",
        startTime: "13:00",
        endTime: "14:30",
      },
    ];

    console.log("Returning mock schedules for student:", mockSchedules.length);
    res.json(mockSchedules);
  } catch (error) {
    console.error("Error fetching student schedules:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
