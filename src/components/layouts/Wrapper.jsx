import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

export default function Wrapper({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onLogout={handleLogout} />

      <div className="p-6">{children}</div>

      <Footer />
    </div>
  );
}
