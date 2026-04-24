import { create } from "zustand";
import api from "../api/axios";
import { io } from "socket.io-client";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  socket: null,

  initializeSocket: () => {
    console.log("[WS] initializeSocket called...");
    if (get().socket) return;

    // Extract base URL from VITE_API_URL or fallback (removing /api)
    // Force backend port 5000 if it accidentally points to frontend port 5001
    const apiUrl = import.meta.env.VITE_API_URL || "http://103.197.191.97:5000/api";
    const socketUrl = apiUrl.replace(/:5001/, ":5000").replace(/\/api$/, "");

    // Get token from localStorage
    const token = localStorage.getItem("access_token");

    const socket = io(socketUrl, {
      withCredentials: true,
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("[WS] Connected to server successfully!");
    });

    socket.on("connect_error", (err) => {
      console.log("[WS] Connection Error:", err.message);
    });

    socket.on("notification", (newNotification) => {
      console.log("[WS] New notification received:", newNotification);
      
      // Update state
      set((state) => ({
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }));

      // Add a visual toast for debugging
      import("sweetalert2").then((Swal) => {
        Swal.default.fire({
          title: newNotification.title,
          text: newNotification.message,
          icon: "info",
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
        });
      });
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
