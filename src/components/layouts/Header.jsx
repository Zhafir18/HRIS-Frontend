import { useState } from "react";
import useUserStore from "../../store/UserStore";
import { Link } from "react-router-dom";

export default function Header({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const user = useUserStore((state) => state.user);

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center relative z-40">
      <h1 className="font-bold text-xl text-blue-600 tracking-tight">HRIS</h1>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-xl border border-gray-200 transition-all font-medium text-gray-700"
        >
          <span>{user?.username || "Account"}</span>
          <span
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              {user?.role?.name === "Admin" && (
                <Link
                  to="/admin"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full text-left px-4 py-2 bg-red-500 text-sm text-white hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
