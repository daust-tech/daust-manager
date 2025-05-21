const prisma = require("../lib/prisma");

async function getClasses(req, res) {
  try {
    const classes = await prisma.class.findMany({
      include: {
        course: true,
        teacher: true,
      },
    });
    res.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Failed to fetch classes" });
  }
}

async function createClass(req, res) {
  try {
    const { name, courseId, teacherId, capacity, semester } = req.body;

    const newClass = await prisma.class.create({
      data: {
        name,
        capacity: parseInt(capacity),
        semester,
        course: { connect: { id: courseId } },
        teacher: { connect: { id: teacherId } },
      },
      include: {
        course: true,
        teacher: true,
      },
    });

    res.status(201).json(newClass);
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ message: "Failed to create class" });
  }
}

async function updateClass(req, res) {
  try {
    const { id } = req.params;
    const { name, courseId, teacherId, capacity, semester } = req.body;

    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        name,
        capacity: parseInt(capacity),
        semester,
        course: courseId ? { connect: { id: courseId } } : undefined,
        teacher: teacherId ? { connect: { id: teacherId } } : undefined,
      },
      include: {
        course: true,
        teacher: true,
      },
    });

    res.json(updatedClass);
  } catch (error) {
    console.error("Error updating class:", error);
    res.status(500).json({ message: "Failed to update class" });
  }
}

async function deleteClass(req, res) {
  try {
    const { id } = req.params;

    await prisma.class.delete({
      where: { id },
    });

    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({ message: "Failed to delete class" });
  }
}

async function addStudentToClass(req, res) {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    const enrollment = await prisma.enrollment.create({
      data: {
        class: { connect: { id } },
        student: { connect: { id: studentId } },
      },
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error("Error adding student to class:", error);
    res.status(500).json({ message: "Failed to add student to class" });
  }
}

async function removeStudentFromClass(req, res) {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    await prisma.enrollment.deleteMany({
      where: {
        classId: id,
        studentId,
      },
    });

    res.json({ message: "Student removed from class successfully" });
  } catch (error) {
    console.error("Error removing student from class:", error);
    res.status(500).json({ message: "Failed to remove student from class" });
  }
}

module.exports = {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass,
};
