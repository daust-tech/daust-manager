import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";

// Use relative URL for API - this will use the Vite proxy configuration
const API_BASE_URL = "/api";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`Adding token to ${config.url} request`, {
        url: config.url,
        method: config.method,
        headers: { Authorization: `Bearer ${token.substring(0, 10)}...` },
      });
    } else {
      console.warn(`No token available for ${config.url} request`);
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response: any) => response,
  (error: AxiosError) => {
    // Handle session expiry or unauthorized access
    console.error("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Type definitions
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Base API service with HTTP methods
export const apiService = {
  // Generic HTTP methods
  get: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.get<T>(url, config);
  },

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.post<T>(url, data, config);
  },

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.put<T>(url, data, config);
  },

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.patch<T>(url, data, config);
  },

  delete: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.delete<T>(url, config);
  },
};

// Specific API endpoints
export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiService.post<{ token: string; user: User }>("/auth/login", credentials),

  register: (userData: RegisterData) =>
    apiService.post<{ token: string; user: User }>("/auth/register", userData),

  getCurrentUser: () => apiService.get<User>("/auth/me"),
};

export const usersApi = {
  getAll: () => apiService.get<User[]>("/users"),

  getById: (id: string) => apiService.get<User>(`/users/${id}`),

  create: (userData: Omit<User, "id">) =>
    apiService.post<User>("/users", userData),

  update: (id: string, userData: Partial<User>) =>
    apiService.put<User>(`/users/${id}`, userData),

  delete: (id: string) => apiService.delete(`/users/${id}`),
};

export const coursesApi = {
  getAll: () => apiService.get("/courses"),

  getById: (id: string) => apiService.get(`/courses/${id}`),

  create: (courseData: any) => apiService.post("/courses", courseData),

  update: (id: string, courseData: any) =>
    apiService.put(`/courses/${id}`, courseData),

  delete: (id: string) => apiService.delete(`/courses/${id}`),
};

export const classesApi = {
  getAll: () => apiService.get("/classes"),

  getById: (id: string) => apiService.get(`/classes/${id}`),

  create: (classData: any) => apiService.post("/classes", classData),

  update: (id: string, classData: any) =>
    apiService.put(`/classes/${id}`, classData),

  delete: (id: string) => apiService.delete(`/classes/${id}`),
};

export const schedulesApi = {
  getAll: () => apiService.get("/schedules"),

  getById: (id: string) => apiService.get(`/schedules/${id}`),

  create: (scheduleData: any) => apiService.post("/schedules", scheduleData),

  update: (id: string, scheduleData: any) =>
    apiService.put(`/schedules/${id}`, scheduleData),

  delete: (id: string) => apiService.delete(`/schedules/${id}`),
};

export const roomsApi = {
  getAll: () => apiService.get("/rooms"),

  getById: (id: string) => apiService.get(`/rooms/${id}`),

  create: (roomData: any) => apiService.post("/rooms", roomData),

  update: (id: string, roomData: any) =>
    apiService.put(`/rooms/${id}`, roomData),

  delete: (id: string) => apiService.delete(`/rooms/${id}`),
};

export const dashboardApi = {
  getSummary: () => apiService.get("/dashboard"),
};
