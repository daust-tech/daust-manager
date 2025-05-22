const bcrypt = require("bcryptjs");
const prisma = require("./lib/prisma");

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Create admin users
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.upsert({
      where: { email: "admin@daust.edu" },
      update: {},
      create: {
        name: "Admin User",
        email: "admin@daust.edu",
        password: adminPassword,
        role: "ADMIN",
      },
    });

    console.log(`✅ Created admin user: ${admin.name}`);

    // Create teachers
    const teacherPassword = await bcrypt.hash("teacher123", 10);
    const teachers = [
      {
        name: "Dr. John Smith",
        email: "john.smith@daust.edu",
        specialty: "Computer Science",
      },
      {
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@daust.edu",
        specialty: "Mathematics",
      },
      {
        name: "Prof. Michael Lee",
        email: "michael.lee@daust.edu",
        specialty: "Physics",
      },
      {
        name: "Dr. Emily Chen",
        email: "emily.chen@daust.edu",
        specialty: "Engineering",
      },
    ];

    const createdTeachers = [];
    for (const teacher of teachers) {
      const createdTeacher = await prisma.user.upsert({
        where: { email: teacher.email },
        update: {},
        create: {
          name: teacher.name,
          email: teacher.email,
          password: teacherPassword,
          role: "TEACHER",
        },
      });
      createdTeachers.push(createdTeacher);
      console.log(`✅ Created teacher: ${createdTeacher.name}`);
    }

    // Create students
    const studentPassword = await bcrypt.hash("student123", 10);
    const students = [
      { name: "Alex Johnson", email: "alex.j@daust.edu" },
      { name: "Maria Garcia", email: "maria.g@daust.edu" },
      { name: "James Wilson", email: "james.w@daust.edu" },
      { name: "Fatima Ahmed", email: "fatima.a@daust.edu" },
      { name: "Wei Zhang", email: "wei.z@daust.edu" },
      { name: "Olivia Brown", email: "olivia.b@daust.edu" },
      { name: "Omar Diallo", email: "omar.d@daust.edu" },
      { name: "Sophia Martinez", email: "sophia.m@daust.edu" },
    ];

    const createdStudents = [];
    for (const student of students) {
      const createdStudent = await prisma.user.upsert({
        where: { email: student.email },
        update: {},
        create: {
          name: student.name,
          email: student.email,
          password: studentPassword,
          role: "STUDENT",
        },
      });
      createdStudents.push(createdStudent);
    }
    console.log(`✅ Created ${createdStudents.length} students`);

    // Create courses
    const courses = [
      {
        code: "CS101",
        name: "Introduction to Computer Science",
        description: "Fundamentals of computer science and programming",
        creditHours: 3,
      },
      {
        code: "MATH202",
        name: "Calculus II",
        description: "Advanced calculus concepts including integration",
        creditHours: 4,
      },
      {
        code: "PHYS101",
        name: "Physics I",
        description: "Introduction to mechanics and thermodynamics",
        creditHours: 4,
      },
      {
        code: "ENG205",
        name: "Circuit Analysis",
        description: "Fundamentals of electrical circuit analysis",
        creditHours: 3,
      },
      {
        code: "CS301",
        name: "Database Systems",
        description: "Design and implementation of database systems",
        creditHours: 3,
      },
      {
        code: "MATH301",
        name: "Linear Algebra",
        description: "Matrices, vector spaces, and linear transformations",
        creditHours: 3,
      },
    ];

    const createdCourses = [];
    for (const course of courses) {
      const createdCourse = await prisma.course.upsert({
        where: { code: course.code },
        update: {},
        create: {
          code: course.code,
          name: course.name,
          description: course.description,
          creditHours: course.creditHours,
        },
      });
      createdCourses.push(createdCourse);
    }
    console.log(`✅ Created ${createdCourses.length} courses`);

    // Create rooms
    const rooms = [
      { name: "A101", building: "Main Building", capacity: 40 },
      { name: "A102", building: "Main Building", capacity: 30 },
      { name: "B201", building: "Science Building", capacity: 50 },
      { name: "B202", building: "Science Building", capacity: 25 },
      { name: "C101", building: "Engineering Building", capacity: 60 },
      { name: "C102", building: "Engineering Building", capacity: 45 },
      { name: "LAB1", building: "Science Building", capacity: 30 },
      { name: "LAB2", building: "Engineering Building", capacity: 35 },
    ];

    const createdRooms = [];
    for (const room of rooms) {
      const createdRoom = await prisma.room.upsert({
        where: { name: room.name },
        update: {},
        create: {
          name: room.name,
          building: room.building,
          capacity: room.capacity,
        },
      });
      createdRooms.push(createdRoom);
    }
    console.log(`✅ Created ${createdRooms.length} rooms`);

    // Create classes
    const classes = [
      {
        name: "CS101-A",
        section: "A",
        capacity: 30,
        courseCode: "CS101",
        teacherEmail: "john.smith@daust.edu",
      },
      {
        name: "CS101-B",
        section: "B",
        capacity: 30,
        courseCode: "CS101",
        teacherEmail: "john.smith@daust.edu",
      },
      {
        name: "MATH202-A",
        section: "A",
        capacity: 40,
        courseCode: "MATH202",
        teacherEmail: "sarah.johnson@daust.edu",
      },
      {
        name: "PHYS101-A",
        section: "A",
        capacity: 35,
        courseCode: "PHYS101",
        teacherEmail: "michael.lee@daust.edu",
      },
      {
        name: "ENG205-A",
        section: "A",
        capacity: 30,
        courseCode: "ENG205",
        teacherEmail: "emily.chen@daust.edu",
      },
      {
        name: "CS301-A",
        section: "A",
        capacity: 25,
        courseCode: "CS301",
        teacherEmail: "john.smith@daust.edu",
      },
    ];

    const createdClasses = [];
    for (const cls of classes) {
      const course = await prisma.course.findUnique({
        where: { code: cls.courseCode },
      });

      const teacher = await prisma.user.findUnique({
        where: { email: cls.teacherEmail },
      });

      if (course && teacher) {
        const createdClass = await prisma.class.upsert({
          where: {
            id: cls.name, // Using name as a unique identifier for upsert
          },
          update: {},
          create: {
            id: cls.name, // Use name as ID for simplicity in this seed
            name: cls.name,
            section: cls.section,
            capacity: cls.capacity,
            courseId: course.id,
            teacherId: teacher.id,
          },
        });

        // Add some students to each class
        const studentIds = createdStudents
          .sort(() => 0.5 - Math.random()) // Shuffle
          .slice(0, Math.floor(Math.random() * 5) + 3) // Take 3-7 random students
          .map((student) => ({ id: student.id }));

        await prisma.class.update({
          where: { id: createdClass.id },
          data: {
            students: {
              connect: studentIds,
            },
          },
        });

        createdClasses.push(createdClass);
      }
    }
    console.log(`✅ Created ${createdClasses.length} classes with students`);

    // Create schedules
    const schedules = [
      {
        classId: "CS101-A",
        roomName: "A101",
        dayOfWeek: "MONDAY",
        startTime: "09:00",
        endTime: "10:30",
      },
      {
        classId: "CS101-A",
        roomName: "A101",
        dayOfWeek: "WEDNESDAY",
        startTime: "09:00",
        endTime: "10:30",
      },
      {
        classId: "CS101-B",
        roomName: "A102",
        dayOfWeek: "TUESDAY",
        startTime: "11:00",
        endTime: "12:30",
      },
      {
        classId: "CS101-B",
        roomName: "A102",
        dayOfWeek: "THURSDAY",
        startTime: "11:00",
        endTime: "12:30",
      },
      {
        classId: "MATH202-A",
        roomName: "B201",
        dayOfWeek: "MONDAY",
        startTime: "13:00",
        endTime: "14:30",
      },
      {
        classId: "MATH202-A",
        roomName: "B201",
        dayOfWeek: "WEDNESDAY",
        startTime: "13:00",
        endTime: "14:30",
      },
      {
        classId: "PHYS101-A",
        roomName: "B202",
        dayOfWeek: "TUESDAY",
        startTime: "09:00",
        endTime: "10:30",
      },
      {
        classId: "PHYS101-A",
        roomName: "LAB1",
        dayOfWeek: "THURSDAY",
        startTime: "14:00",
        endTime: "16:00",
      },
      {
        classId: "ENG205-A",
        roomName: "C101",
        dayOfWeek: "MONDAY",
        startTime: "16:00",
        endTime: "17:30",
      },
      {
        classId: "ENG205-A",
        roomName: "LAB2",
        dayOfWeek: "FRIDAY",
        startTime: "13:00",
        endTime: "15:00",
      },
      {
        classId: "CS301-A",
        roomName: "C102",
        dayOfWeek: "WEDNESDAY",
        startTime: "16:00",
        endTime: "17:30",
      },
      {
        classId: "CS301-A",
        roomName: "C102",
        dayOfWeek: "FRIDAY",
        startTime: "16:00",
        endTime: "17:30",
      },
    ];

    const createdSchedules = [];
    for (const schedule of schedules) {
      const classEntity = await prisma.class.findUnique({
        where: { id: schedule.classId },
      });

      const room = await prisma.room.findUnique({
        where: { name: schedule.roomName },
      });

      if (classEntity && room) {
        try {
          const createdSchedule = await prisma.schedule.create({
            data: {
              classId: classEntity.id,
              roomId: room.id,
              dayOfWeek: schedule.dayOfWeek,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
            },
          });
          createdSchedules.push(createdSchedule);
        } catch (error) {
          console.log(
            `Failed to create schedule for ${schedule.classId} in ${schedule.roomName}: ${error.message}`
          );
        }
      }
    }
    console.log(`✅ Created ${createdSchedules.length} schedules`);

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed function
if (require.main === module) {
  seed()
    .catch((error) => {
      console.error("Error seeding database:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
} else {
  // When imported in other files
  module.exports = { seed };
}
