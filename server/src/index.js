// Import required modules
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Validate essential environment variables
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not defined in environment variables");
  console.log("Setting a temporary JWT_SECRET for development");
  process.env.JWT_SECRET = "temporary_secret_for_development_only";
}

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const courseRoutes = require("./routes/courses");
const classRoutes = require("./routes/classes");
const scheduleRoutes = require("./routes/schedules");
const roomRoutes = require("./routes/rooms");
const dashboardRoutes = require("./routes/dashboard");

// Import prisma client
const prisma = require("./lib/prisma");

// Create Express app
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log("Database connection successful");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

// Import and run seed script
require("./seed");

// Start server
async function startServer() {
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error("Failed to connect to database. Exiting...");
    process.exit(1);
  }

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/classes", classRoutes);
  app.use("/api/schedules", scheduleRoutes);
  app.use("/api/rooms", roomRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  // Error handling
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

// Start the server
startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
