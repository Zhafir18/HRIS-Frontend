import { create } from "zustand";
import api from "../api/axios";

const useAttendanceStore = create((set) => ({
  attendance: null,
  history: [],

  loading: false,

  fetchDashboard: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/attendance");
      const data = res.data.data || res.data;
      set({ 
        attendance: data[0],
        history: data 
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchHistory: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/attendance");
      set({ history: res.data.data || res.data });
    } finally {
      set({ loading: false });
    }
  },

  checkIn: async (payload) => {
    set({ loading: true });
    try {
      await api.post("/attendance/check-in", payload);
      const res = await api.get("/attendance");
      const data = res.data.data || res.data;
      set({ 
        attendance: data[0],
        history: data 
      });
    } finally {
      set({ loading: false });
    }
  },

  checkOut: async (payload) => {
    set({ loading: true });
    try {
      await api.post("/attendance/check-out", payload);
      const res = await api.get("/attendance");
      const data = res.data.data || res.data;
      set({ 
        attendance: data[0],
        history: data 
      });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAttendanceStore;
