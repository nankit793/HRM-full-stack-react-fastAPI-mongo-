import axios from "axios";

const API_URL = "https://<your-backend-url>"; // Render or Fly.io URL

// Token-based auth
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (email, password) =>
  axiosInstance.post("/auth/login", { email, password });
export const getEmployees = () => axiosInstance.get("/employees");
export const addEmployee = (employee) =>
  axiosInstance.post("/employees", employee);
export const deleteEmployee = (employee_id) =>
  axiosInstance.delete(`/employees/${employee_id}`);

export const getAttendance = (employee_id) =>
  axiosInstance.get(`/attendance/${employee_id}`);
export const markAttendance = (attendance) =>
  axiosInstance.post("/attendance", attendance);

export default axiosInstance;
