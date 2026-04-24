import { create } from "zustand";
import api from "../api/axios";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

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
