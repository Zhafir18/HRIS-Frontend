import { create } from "zustand";
import api from "../api/axios";

const useLeaveStore = create((set) => ({
  myLeaves: {
    items: [],
    total: 0,
    totalPages: 1,
  },
  adminLeaves: {
    items: [],
    total: 0,
    totalPages: 1,
  },
  loading: false,

  fetchMyLeaves: async (page = 1, limit = 10) => {
    set({ loading: true });
    try {
      const res = await api.get("/leave-requests/my", { params: { page, limit } });
      set({ 
        myLeaves: {
          items: res.data.data || [],
          total: res.data.total || 0,
          totalPages: res.data.totalPages || 1
        }
      });
    } finally {
      set({ loading: false });
    }
  },

  applyLeave: async (data) => {
    const res = await api.post("/leave-requests", data);
    return res.data;
  },

  deleteLeave: async (id) => {
    await api.delete(`/leave-requests/${id}`);
  },

  fetchAdminLeaves: async (page = 1, limit = 10, status = null) => {
    set({ loading: true });
    try {
      const res = await api.get("/leave-requests/admin", { params: { page, limit, status } });
      set({ 
        adminLeaves: {
          items: res.data.data || [],
          total: res.data.total || 0,
          totalPages: res.data.totalPages || 1
        }
      });
    } finally {
      set({ loading: false });
    }
  },

  updateLeaveStatus: async (id, status, admin_notes = "") => {
    const res = await api.put(`/leave-requests/${id}/status`, { status, admin_notes });
    return res.data;
  },
}));

export default useLeaveStore;
