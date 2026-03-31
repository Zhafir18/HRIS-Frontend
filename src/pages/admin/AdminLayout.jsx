import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import useUserStore from "../../store/UserStore";
import { useEffect, useState } from "react";
import Forbidden from "../Forbidden";

export default function AdminLayout() {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [user]);

  const isAdmin = user?.role?.name === "Admin";

  const navItems = [
    { label: "Attendance Reports", path: "/admin" },
    { label: "User Management", path: "/admin/users" },
    { label: "Role Management", path: "/admin/roles" },
  ];

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isAdmin && (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
          <div className="p-6">
            <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              HRIS Management
            </p>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:text-blue-600 font-bold transition-colors"
            >
              ← Back to App
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <main className="p-8">{isAdmin ? <Outlet /> : <Forbidden />}</main>
      </div>
    </div>
  );
}
