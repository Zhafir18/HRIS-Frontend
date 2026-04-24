import { create } from "zustand";
import api from "../api/axios";

const useSalaryStore = create((set) => ({
  salaries: { items: [], total: 0 },
  loading: false,

  fetchSalaries: async (page = 1, limit = 10, userId = "") => {
    set({ loading: true });
    try {
      const url = userId ? `/salary?page=${page}&limit=${limit}&userId=${userId}` : `/salary?page=${page}&limit=${limit}`;
      const res = await api.get(url);
      const data = res.data?.data?.data || res.data?.data || res.data;
      set({ 
        salaries: { 
          items: data.data || [], 
          total: data.total || 0 
        }, 
        loading: false 
      });
    } catch (error) {
      console.log(error);
      set({ loading: false });
    }
  },

  createSalary: async (data) => {
    set({ loading: true });
    try {
      await api.post("/salary", data);
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  updateSalaryStatus: async (id, status) => {
    set({ loading: true });
    try {
      await api.patch(`/salary/${id}/status`, { status });
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  deleteSalary: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`/salary/${id}`);
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));

export default useSalaryStore;
