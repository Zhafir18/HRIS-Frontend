import { create } from "zustand";
import api from "../api/axios";

const userStore = create((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    const res = await api.get("/users");
    set({ user: res.data.data || res.data });
  },

  fetchUserById: async (id) => {
    const res = await api.get(`/users/me`);
    set({ user: res.data.data || res.data });
  },

  updateUser: async (userData) => {
    const res = await api.put("/users", userData);
    set({ user: res.data.data || res.data });
  },

  deleteUser: async (id) => {
    await api.delete(`/users/${id}`);
    set({ user: null });
  },
}));

export default userStore;
