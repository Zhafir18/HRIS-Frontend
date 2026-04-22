import { create } from "zustand";
import api from "../api/axios";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,

  setUser: (user) => set({ user }),

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const token = res.data.data?.access_token || res.data.access_token;
    
    if (token) {
      localStorage.setItem("token", token);
      set({ token });
    }
    
    return res.data;
  },

  register: async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
