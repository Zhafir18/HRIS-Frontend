import { create } from "zustand";
import api from "../api/axios";

const useAuthStore = create((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  },

  register: async (username, email, password, role_id, department_id) => {
    const res = await api.post("/auth/register", { 
      username, 
      email, 
      password, 
      role_id, 
      department_id 
    });
    return res.data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      set({ user: null });
    }
  },
}));

export default useAuthStore;
