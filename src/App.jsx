import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import Users from "./pages/admin/Users";
import Roles from "./pages/admin/Roles";
import AttendanceLogs from "./pages/admin/Attendance";
import Departments from "./pages/admin/Departments";
import Offices from "./pages/admin/Offices";

import { useEffect } from "react";
import useUserStore from "./store/UserStore";

import LeaveRequests from "./pages/LeaveRequests";
import ManageLeaves from "./pages/admin/ManageLeaves";
import Salary from "./pages/Salary";
import ManageSalary from "./pages/admin/ManageSalary";

function App() {
  const getMe = useUserStore((state) => state.getMe);

  useEffect(() => {
    getMe().catch(() => {
      console.log("No active session");
    });
  }, [getMe]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leave-requests" element={<LeaveRequests />} />
        <Route path="/admin/attendance" element={<AttendanceLogs />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/roles" element={<Roles />} />
        <Route path="/admin/departments" element={<Departments />} />
        <Route path="/admin/offices" element={<Offices />} />
        <Route path="/admin/leaves" element={<ManageLeaves />} />
        <Route path="/admin/salary" element={<ManageSalary />} />
        <Route path="/salary" element={<Salary />} />
        <Route path="/admin" element={<Navigate to="/admin/attendance" />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
