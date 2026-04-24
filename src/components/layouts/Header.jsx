import { useState, useEffect, useRef } from "react";
import useUserStore from "../../store/UserStore";
import useNotificationStore from "../../store/NotificationStore";
import { Link } from "react-router-dom";

export default function Header({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);
  
  const user = useUserStore((state) => state.user);
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, initializeSocket, disconnectSocket } = useNotificationStore();

  useEffect(() => {
    initializeSocket();
    if (user) {
      fetchNotifications();
    }
    return () => disconnectSocket();
  }, [user, fetchNotifications, initializeSocket, disconnectSocket]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Search Bar - Corporate Look */}
      <div className="hidden md:flex items-center flex-1 max-w-md bg-slate-100 rounded-xl px-4 py-2 border border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-all shadow-sm group">
        <svg
          className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search records, employees..."
          className="bg-transparent border-none outline-none ml-3 text-sm text-slate-700 w-full placeholder-slate-400 font-medium"
        />
      </div>

      <div className="flex items-center space-x-6 ml-auto">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative text-slate-500 hover:text-slate-700 transition-colors p-1.5 hover:bg-slate-50 rounded-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <p className="text-sm font-bold text-slate-900">Notifications</p>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-600 font-medium hover:text-indigo-800"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {(!notifications || notifications.length === 0) ? (
                  <div className="px-4 py-8 text-center text-slate-500 text-sm">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => !notif.is_read && markAsRead(notif.id)}
                      className={`px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors ${!notif.is_read ? 'bg-indigo-50/30' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-sm ${!notif.is_read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {notif.title}
                        </p>
                        {!notif.is_read && (
                          <span className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-snug">{notif.message}</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        {new Date(notif.created_at).toLocaleDateString()} at {new Date(notif.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 bg-white hover:bg-slate-50 p-1.5 pr-3 rounded-full border border-slate-200 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs ring-2 ring-white overflow-hidden shadow-inner">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="hidden sm:block text-left mr-1">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {user?.username || "Account"}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {user?.role?.name || "Member"}
              </p>
            </div>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-50 mb-1 bg-slate-50/50">
                  <p className="text-xs text-slate-500 font-medium">
                    Logged in as
                  </p>
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {user?.email}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors group"
                >
                  <svg
                    className="w-4 h-4 mr-3 text-rose-400 group-hover:text-rose-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
