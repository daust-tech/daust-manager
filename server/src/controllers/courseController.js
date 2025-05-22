const prisma = require("../lib/prisma");

async function getCourses(req, res) {
  try {
    const courses = await prisma.course.findMany();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
}

async function createCourse(req, res) {
  try {
    const { code, name, description, credits } = req.body;

    const newCourse = await prisma.course.create({
      data: {
        code,
        name,
        description,
        credits: parseInt(credits),
      },
    });

    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Failed to create course" });
  }
}

async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const { code, name, description, credits } = req.body;

    console.log("Updating course:", id, req.body);

    // Validate that the course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        code,
        name,
        description,
        credits: parseInt(credits),
      },
    });

    console.log("Course updated successfully:", updatedCourse);
    res.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Failed to update course" });
  }
}

async function deleteCourse(req, res) {
  try {
    const { id } = req.params;

    await prisma.course.delete({
      where: { id },
    });

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Failed to delete course" });
  }
}

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
