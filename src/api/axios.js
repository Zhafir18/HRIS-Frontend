import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://103.197.191.97:5000/api",
  withCredentials: true,
});

export default api;
