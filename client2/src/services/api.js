import axios from "axios";

const API_URL = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", response.data.token);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
  },
};

// Users API
export const usersAPI = {
  getUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },
  createUser: async (userData) => {
    const response = await api.post("/users", userData);
    return response.data;
  },
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id) => {
    await api.delete(`/users/${id}`);
  },
};

// Teachers API
export const teachersAPI = {
  getTeachers: async () => {
    // Teachers are users with TEACHER role
    const response = await api.get("/users?role=TEACHER");
    return response.data;
  },
  createTeacher: async (teacherData) => {
    // Ensure the role is set to TEACHER
    const data = { ...teacherData, role: "TEACHER" };
    const response = await api.post("/users", data);
    return response.data;
  },
  updateTeacher: async (id, teacherData) => {
    const response = await api.put(`/users/${id}`, teacherData);
    return response.data;
  },
  deleteTeacher: async (id) => {
    await api.delete(`/users/${id}`);
  },
};

// Courses API
export const coursesAPI = {
  getCourses: async () => {
    const response = await api.get("/courses");
    return response.data;
  },
  createCourse: async (courseData) => {
    const response = await api.post("/courses", courseData);
    return response.data;
  },
  updateCourse: async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },
  deleteCourse: async (id) => {
    await api.delete(`/courses/${id}`);
  },
};

// Classes API
export const classesAPI = {
  getClasses: async () => {
    const response = await api.get("/classes");
    return response.data;
  },
  createClass: async (classData) => {
    const response = await api.post("/classes", classData);
    return response.data;
  },
  updateClass: async (id, classData) => {
    const response = await api.put(`/classes/${id}`, classData);
    return response.data;
  },
  deleteClass: async (id) => {
    await api.delete(`/classes/${id}`);
  },
  addStudentToClass: async (classId, studentId) => {
    const response = await api.post(`/classes/${classId}/students`, {
      studentId,
    });
    return response.data;
  },
  removeStudentFromClass: async (classId, studentId) => {
    await api.delete(`/classes/${classId}/students`, { data: { studentId } });
  },
};

// Schedules API
export const schedulesAPI = {
  getSchedules: async () => {
    const response = await api.get("/schedules");
    return response.data;
  },
  createSchedule: async (scheduleData) => {
    const response = await api.post("/schedules", scheduleData);
    return response.data;
  },
  updateSchedule: async (id, scheduleData) => {
    const response = await api.put(`/schedules/${id}`, scheduleData);
    return response.data;
  },
  deleteSchedule: async (id) => {
    await api.delete(`/schedules/${id}`);
  },
  getSchedulesByRoom: async (roomId) => {
    const response = await api.get(`/schedules/room/${roomId}`);
    return response.data;
  },
  getSchedulesByTeacher: async (teacherId) => {
    const response = await api.get(`/schedules/teacher/${teacherId}`);
    return response.data;
  },
};

// Rooms API
export const roomsAPI = {
  getRooms: async () => {
    const response = await api.get("/rooms");
    return response.data;
  },
  createRoom: async (roomData) => {
    const response = await api.post("/rooms", roomData);
    return response.data;
  },
  updateRoom: async (id, roomData) => {
    const response = await api.put(`/rooms/${id}`, roomData);
    return response.data;
  },
  deleteRoom: async (id) => {
    await api.delete(`/rooms/${id}`);
  },
};
