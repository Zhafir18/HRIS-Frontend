import { create } from "zustand";
import api from "../api/axios";

const useAdminStore = create((set) => ({
  users: {
    items: [],
    total: 0,
    totalPages: 1,
  },
  roles: [],
  allAttendance: {
    items: [],
    total: 0,
    totalPages: 1,
  },
  departments: [],
  offices: [],
  loading: false,

  fetchUsers: async (params = {}) => {
    set({ loading: true });
    try {
      const res = await api.get("/users", { params });
      set({ 
        users: {
            items: res.data.data || [],
            total: res.data.total || 0,
            totalPages: res.data.totalPages || 1
        }
      });
    } finally {
      set({ loading: false });
    }
  },

  createUser: async (userData) => {
    const res = await api.post("/users", userData);
    const result = res.data.data || res.data;
    return result;
  },

  updateUser: async (id, userData) => {
    const res = await api.put(`/users/${id}`, userData);
    const result = res.data.data || res.data;
    return result;
  },

  deleteUser: async (id) => {
    await api.delete(`/users/${id}`);
  },

  fetchRoles: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/roles");
      set({ roles: res.data.data || res.data });
    } finally {
      set({ loading: false });
    }
  },

  createRole: async (roleData) => {
    const res = await api.post("/roles", roleData);
    const result = res.data.data || res.data;
    return result;
  },

  updateRole: async (id, roleData) => {
    const res = await api.put(`/roles/${id}`, roleData);
    const result = res.data.data || res.data;
    return result;
  },

  deleteRole: async (id) => {
    await api.delete(`/roles/${id}`);
  },

  fetchDepartments: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/department");
      set({ departments: res.data.data || res.data });
    } finally {
      set({ loading: false });
    }
  },

  createDepartment: async (data) => {
    const res = await api.post("/department", data);
    return res.data;
  },

  updateDepartment: async (id, data) => {
    const res = await api.put(`/department/${id}`, data);
    return res.data;
  },

  deleteDepartment: async (id) => {
    await api.delete(`/department/${id}`);
  },

  fetchOffices: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/office");
      set({ offices: res.data.data || res.data });
    } finally {
      set({ loading: false });
    }
  },

  createOffice: async (data) => {
    const res = await api.post("/office", data);
    return res.data;
  },

  updateOffice: async (id, data) => {
    const res = await api.put(`/office/${id}`, data);
    return res.data;
  },

  deleteOffice: async (id) => {
    await api.delete(`/office/${id}`);
  },

  fetchAllAttendance: async (params = {}) => {
    set({ loading: true });
    try {
      const res = await api.get("/attendance/all", { params });
      set({ 
        allAttendance: {
            items: res.data.data || [],
            total: res.data.total || 0,
            totalPages: res.data.totalPages || 1
        }
      });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAdminStore;
