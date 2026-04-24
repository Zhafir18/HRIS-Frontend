import { create } from "zustand";
import api from "../api/axios";
import { io } from "socket.io-client";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  socket: null,

  initializeSocket: () => {
    if (get().socket) return;

    // Extract base URL from VITE_API_URL or fallback (removing /api)
    const apiUrl = import.meta.env.VITE_API_URL || "http://103.197.191.97:5000/api";
    const socketUrl = apiUrl.replace(/\/api$/, "");

    const socket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    socket.on("notification", (newNotification) => {
      set((state) => ({
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }));
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/notification");
      const payload = res.data?.data?.data || res.data?.data || {};
      const notifications = payload.notifications || [];
      const unreadCount = payload.unreadCount || 0;
      set({ notifications, unreadCount, loading: false });
    } catch (error) {
      console.log("Error fetching notifications:", error);
      set({ loading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await api.patch(`/notification/${id}/read`);
      
      // Update local state instead of refetching to be snappier
      const currentNotifications = get().notifications;
      const updatedNotifications = currentNotifications.map(notification => 
        notification.id === id ? { ...notification, is_read: true } : notification
      );
      
      const unreadCount = updatedNotifications.filter(n => !n.is_read).length;
      set({ notifications: updatedNotifications, unreadCount });
      
    } catch (error) {
      console.log("Error marking notification as read:", error);
    }
  },

  markAllAsRead: async () => {
    try {
      await api.patch('/notification/read-all');
      
      const updatedNotifications = get().notifications.map(notification => 
        ({ ...notification, is_read: true })
      );
      
      set({ notifications: updatedNotifications, unreadCount: 0 });
    } catch (error) {
      console.log("Error marking all notifications as read:", error);
    }
  }
}));

export default useNotificationStore;
