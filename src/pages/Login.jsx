import useAuthStore from "../store/AuthStore";
import useUserStore from "../store/UserStore";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      Swal.fire({
        icon: 'success',
        title: 'Login Success',
        text: 'Welcome back!',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMsg);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMsg,
        confirmButtonColor: '#3b82f6',
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
               Secure and seamless access to your professional ecosystem. Elevating workforce management with precision and clarity.
             </p>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center space-x-4">
              <div className="h-px w-12 bg-slate-600"></div>
              <p className="text-slate-400 text-sm tracking-widest uppercase font-medium">Internal System Use Only</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
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
              <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Welcome back</h2>
              <p className="text-slate-500 mt-2 text-sm">Please enter your credentials to access your account.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Work Email</label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border-slate-300 focus:border-slate-500 focus:ring-slate-500 transition-colors bg-slate-50/50 block px-4 py-2.5"
                  />
                </div>
              </div>

              <div className="space-y-1.5 relative">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <Link to="/forgot-password" title="Lupa password?" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border-slate-300 focus:border-slate-500 focus:ring-slate-500 transition-colors bg-slate-50/50 block px-4 py-2.5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.011 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                    type="submit" 
                    className="w-full py-2.5 text-sm font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-slate-900" 
                    loading={isLoading}
                >
                  Sign In to Portal
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account? <Link to="/register" className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">Register here</Link>
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
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
