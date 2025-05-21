# School Management System (DAUST Manager) - MVP Development Prompt

## Project Overview

Create a minimal viable product (MVP) for a school management system focused on essential features for class planning and scheduling.

## Technical Stack

- **Frontend**: React (Vite)
- **Backend**: Express.js
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **Authentication**: Simple JWT authentication

## Simplified Database Schema (Prisma)

```prisma
// MVP data models (Prisma schema)

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  password     String
  name         String
  role         Role     @default(ADMIN)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  // Relations
  teacher      Teacher?
}

enum Role {
  ADMIN
  TEACHER
}

model Course {
  id            String   @id @default(uuid())
  code          String   @unique
  name          String
  description   String?
  creditHours   Int
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  // Relations
  classes       Class[]
}

model Class {
  id            String   @id @default(uuid())
  name          String
  section       String
  capacity      Int
  courseId      String
  course        Course   @relation(fields: [courseId], references: [id])
  teacherId     String?
  teacher       Teacher? @relation(fields: [teacherId], references: [id])
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  // Relations
  schedules     Schedule[]
}

model Teacher {
  id            String   @id @default(uuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id])
  department    String?
  // Relations
  classes       Class[]
}

model Room {
  id            String   @id @default(uuid())
  name          String   @unique
  building      String
  capacity      Int
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  // Relations
  schedules     Schedule[]
}

model Schedule {
  id            String   @id @default(uuid())
  classId       String
  class         Class    @relation(fields: [classId], references: [id])
  roomId        String
  room          Room     @relation(fields: [roomId], references: [id])
  dayOfWeek     DayOfWeek
  startTime     String   // Store as HH:MM format
  endTime       String   // Store as HH:MM format
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@unique([roomId, dayOfWeek, startTime, endTime])
  @@unique([classId, dayOfWeek, startTime])
}

enum DayOfWeek {
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
}
```

## MVP Features

### 1. Basic Authentication

- Simple login system with JWT
- roles: Admin, Teacher, Student
- Protected routes based on roles

### 2. Course Management

- Create, view, edit, and delete courses
- Basic details: code, name, description, credit hours

### 3. Class Management

- Create classes for courses (sections)
- Assign teachers to classes
- Set basic class details (capacity, name)

### 4. Room Management

- Create, view, edit, and delete rooms
- Basic details: name, building, capacity

### 5. Simple Scheduling

- Manually create class schedules
- Assign rooms and time slots to classes
- Basic conflict detection (same room, same time)
- View schedules by room or teacher

### 6. Minimal UI Requirements

- Clean, functional interface
- Mobile-responsive design
- Simple navigation between features

## API Endpoints (Simplified)

### Authentication

```
POST /api/auth/login
GET /api/auth/me
```

### Courses

```
GET /api/courses
POST /api/courses
GET /api/courses/:id
PUT /api/courses/:id
DELETE /api/courses/:id
```

### Classes

```
GET /api/classes
POST /api/classes
GET /api/classes/:id
PUT /api/classes/:id
DELETE /api/classes/:id
```

### Rooms

```
GET /api/rooms
POST /api/rooms
GET /api/rooms/:id
PUT /api/rooms/:id
DELETE /api/rooms/:id
```

### Schedules

```
GET /api/schedules
POST /api/schedules
GET /api/schedules/:id
PUT /api/schedules/:id
DELETE /api/schedules/:id
GET /api/schedules/room/:roomId
GET /api/schedules/teacher/:teacherId
GET /api/schedules/conflicts
```

### Users/Teachers

```
GET /api/users
POST /api/users
GET /api/users/:id
PUT /api/users/:id
DELETE /api/users/:id
```

## Frontend Structure (Simplified)

```
src/
├── components/       # Reusable UI components
│   ├── layout/       # Layout components
│   ├── forms/        # Form components
│   └── ui/           # UI elements
├── pages/            # Main application pages
│   ├── auth/         # Login page
│   ├── courses/      # Course management
│   ├── classes/      # Class management
│   ├── rooms/        # Room management
│   ├── schedules/    # Schedule management
│   └── users/        # User management
├── services/         # API service functions
├── utils/            # Utility functions
├── App.jsx           # Main application component
└── main.jsx          # Application entry point
```

## Backend Structure (Simplified)

```
src/
├── controllers/      # Request handlers
├── middleware/       # Middleware functions
│   └── auth.js       # Authentication middleware
├── routes/           # API routes
├── utils/            # Utility functions
└── index.js          # Entry point
```

## Development Plan

### 1. Initial Setup

- Set up project structure (both frontend and backend)
- Configure database connection
- Create basic models

### 2. Authentication

- Implement basic JWT authentication
- Create login page
- Set up protected routes

### 3. Core Data Management

- Implement CRUD operations for courses
- Implement CRUD operations for classes
- Implement CRUD operations for rooms
- Implement CRUD operations for users/teachers

### 4. Scheduling

- Create manual scheduling interface
- Implement basic conflict detection
- Create schedule views (by room, by teacher)

### 5. UI Refinements

- Improve UI/UX
- Ensure mobile responsiveness
- Add simple validations and error handling

## Future Enhancements (Post-MVP)

- Academic year and term management
- Student enrollment system
- Automatic schedule generation
- Advanced reporting and analytics
- Calendar integrations
- More sophisticated conflict management
- Multi-language support
- Dark mode

This MVP-focused prompt provides a simplified but fully functional school management system. It addresses the core requirements while keeping the development effort manageable.
