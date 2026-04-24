import AttendanceCard from "../components/dashboard/AttendanceCard";
import AttendanceCalendar from "../components/dashboard/AttendanceCalendar";
import { useEffect, useState } from "react";
import api from "../api/axios";
import Wrapper from "../components/layouts/Wrapper";
import useAttendanceStore from "../store/AttendanceStore";
import useUserStore from "../store/UserStore";

export default function Dashboard() {
  const attendanceData = useAttendanceStore((state) => state.attendance);
  const historyData = useAttendanceStore((state) => state.history);
  const user = useUserStore((state) => state.user);
  const fetchDashboard = useAttendanceStore((state) => state.fetchDashboard);
  const getMe = useUserStore((state) => state.getMe);

  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    lateArrival: 0,
  });

  const fetchToday = async () => {
    try {
      await Promise.all([fetchDashboard(), getMe()]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  useEffect(() => {
    if (user?.role?.name === "Admin") {
      const fetchAdminStats = async () => {
        try {
          const res = await api.get("/dashboard");
          if (res.data && res.data.data) {
            setDashboardStats(res.data.data);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchAdminStats();
    }
  }, [user?.role?.name]);

  const stats = [
    { name: "Total Employees", value: dashboardStats.totalEmployees || 0, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", color: "bg-indigo-500" },
    { name: "Present Today", value: dashboardStats.presentToday || 0, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-emerald-500" },
    { name: "On Leave", value: dashboardStats.onLeave || 0, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "bg-amber-500" },
    { name: "Late Arrival", value: dashboardStats.lateArrival || 0, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-rose-500" },
  ];

  return (
    <Wrapper>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.username || "Colleague"}!
          </h1>
          <p className="text-slate-500 mt-1 font-medium flex items-center">
            <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {user?.role?.name === "Admin" && (
          <div className="flex items-center space-x-3">
             <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">Download Report</button>
             <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Quick Action
             </button>
          </div>
        )}
      </div>

      {/* Stats Cards - Admin Only */}
      {user?.role?.name === "Admin" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{stat.name}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg shadow-current/10`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full w-fit">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                +12% <span className="ml-1 text-slate-400 font-medium">from last month</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden h-full">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
               <h3 className="font-bold text-slate-800 text-lg">Daily Attendance Monitor</h3>
               <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">Live Tracking</span>
            </div>
            <div className="p-8">
              <AttendanceCard
                data={{
                  attendance: attendanceData,
                  user,
                }}
              />
            </div>
          </div>
        </div>
        <div className="xl:col-span-1">
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden h-full">
              <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30">
                 <h3 className="font-bold text-slate-800 text-lg">History Calendar</h3>
              </div>
              <div className="p-6">
                <AttendanceCalendar
                  attendance={historyData}
                />
              </div>
           </div>
        </div>
      </div>
    </Wrapper>
  );
}
