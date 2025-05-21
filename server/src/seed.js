const bcrypt = require("bcryptjs");
const prisma = require("./lib/prisma");

async function seed() {
  try {
    // Check if admin exists
    const adminExists = await prisma.user.findFirst({
      where: {
        email: "admin@daust.edu",
        role: "ADMIN",
      },
    });

    if (!adminExists) {
      // Create admin user
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await prisma.user.create({
        data: {
          name: "Admin User",
          email: "admin@daust.edu",
          password: hashedPassword,
          role: "ADMIN",
        },
      });

      console.log("✅ Admin user created successfully");
    } else {
      console.log("ℹ️ Admin user already exists");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run seed function
seed()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    // We don't disconnect here since this is imported in index.js
  });

module.exports = { seed };
