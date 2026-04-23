import { useState, useEffect } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import useAuthStore from "../store/AuthStore";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, departmentsRes] = await Promise.all([
          api.get("/roles/dropdown"),
          api.get("/departments")
        ]);
        
        // Handle both wrapped response and direct array
        const rolesData = rolesRes.data.data || rolesRes.data;
        const departmentsData = departmentsRes.data.data || departmentsRes.data;
        
        setRoles(rolesData || []);
        setDepartments(departmentsData || []);
      } catch (err) {
        console.error("Failed to fetch roles or departments", err);
      }
    };
    fetchData();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setError("Username, email, and password are required.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await register(username, email, password, roleId || null, departmentId || null);
      Swal.fire({
        icon: 'success',
        title: 'Registration Success',
        text: 'Your account has been created. Please log in.',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed. Please try again later.";
      setError(errorMsg);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: errorMsg,
        confirmButtonColor: '#0f172a',
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Left side - Branding/Image (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 border-r border-slate-200/20 items-center justify-center overflow-hidden">
        {/* Background Image overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/login_bg.png" 
            alt="Corporate Architecture" 
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-800/90 mix-blend-multiply"></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative z-10 p-12 lg:p-24 flex flex-col justify-center h-full max-w-2xl">
          <div className="mb-12">
             <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg mb-6">
               <span className="text-white text-2xl font-bold tracking-wider">H</span>
             </div>
             <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
               Enterprise <br/>
               Resource Portal
             </h1>
             <p className="text-slate-300 text-lg max-w-md font-light leading-relaxed">
               Create your account to connect seamlessly with your professional ecosystem. Elevate your workflow today.
             </p>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center space-x-4">
              <div className="h-px w-12 bg-slate-600"></div>
              <p className="text-slate-400 text-sm tracking-widest uppercase font-medium">Internal System Registration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 rounded-xl shadow-md mb-4">
               <span className="text-white text-2xl font-bold">H</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">HRIS Portal</h1>
          </div>

          <div className="bg-white sm:bg-transparent sm:shadow-none shadow-xl rounded-2xl p-8 sm:p-0 border sm:border-none border-slate-100">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Create an account</h2>
              <p className="text-slate-500 mt-2 text-sm">Please fill in the details below to register.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Username</label>
                <Input
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full rounded-lg border-slate-300 focus:border-slate-500 focus:ring-slate-500 transition-colors bg-slate-50/50 block px-4 py-2.5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Work Email</label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border-slate-300 focus:border-slate-500 focus:ring-slate-500 transition-colors bg-slate-50/50 block pl-10 px-4 py-2.5"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Role</label>
                  <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    className="w-full rounded-lg border-slate-300 focus:border-slate-500 focus:ring-slate-500 transition-colors bg-slate-50/50 block px-4 py-2.5 text-sm appearance-none cursor-pointer outline-none border"
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Department</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full rounded-lg border-slate-300 focus:border-slate-500 focus:ring-slate-500 transition-colors bg-slate-50/50 block px-4 py-2.5 text-sm appearance-none cursor-pointer outline-none border"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="space-y-1.5 relative w-1/2">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border-slate-300 focus:border-slate-500 focus:ring-slate-500 transition-colors bg-slate-50/50 block px-4 py-2.5"
                  />
                </div>
                
                <div className="space-y-1.5 relative w-1/2">
                  <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border-slate-300 focus:border-slate-500 focus:ring-slate-500 transition-colors bg-slate-50/50 block px-4 py-2.5"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input 
                  id="show-password" 
                  type="checkbox" 
                  checked={showPassword} 
                  onChange={() => setShowPassword(!showPassword)}
                  className="h-4 w-4 text-slate-900 focus:ring-slate-900 border-slate-300 rounded"
                />
                <label htmlFor="show-password" className="ml-2 block text-sm text-slate-700">
                  Show passwords
                </label>
              </div>

              <div className="pt-3">
                <Button 
                    type="submit" 
                    className="w-full py-2.5 text-sm font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-slate-900" 
                    loading={isLoading}
                >
                  Register Account
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account? <Link to="/" className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">Log in here</Link>
              </p>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.<br/>
                Secure Corporate Portal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
