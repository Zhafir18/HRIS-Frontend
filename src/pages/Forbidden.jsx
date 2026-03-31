import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="relative mb-8">
        <div className="text-9xl font-black text-gray-100 select-none">403</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-red-50 p-4 rounded-full border-4 border-white shadow-xl">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-16 h-16 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-10">Access Denied</h1>

      <div className="flex gap-4">
        <Button 
            variant="secondary" 
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white"
        >
          Go Back
        </Button>
        <Button 
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700"
        >
          Dashboard Home
        </Button>
      </div>
    </div>
  );
}
