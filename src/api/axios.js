import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://103.197.191.97:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on the login page to avoid infinite loops
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
