import useAuthStore from "../store/AuthStore";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();
  const resetPassword = useAuthStore((state) => state.resetPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await resetPassword(token, password);
      setIsSuccess(true);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Password Anda telah berhasil diatur ulang. Silakan login dengan password baru.',
        confirmButtonColor: '#0f172a',
      }).then(() => {
        navigate("/");
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Token tidak valid atau sudah kedaluwarsa.";
      setError(errorMsg);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: errorMsg,
        confirmButtonColor: '#0f172a',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 border-r border-slate-200/20 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/login_bg.png" 
            alt="Corporate Architecture" 
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-800/90 mix-blend-multiply"></div>
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative z-10 p-12 lg:p-24 flex flex-col justify-center h-full max-w-2xl">
          <div className="mb-12">
             <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg mb-6">
               <span className="text-white text-2xl font-bold tracking-wider">H</span>
             </div>
             <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
               Atur Ulang <br/>
               Kata Sandi
             </h1>
             <p className="text-slate-300 text-lg max-w-md font-light leading-relaxed">
               Langkah terakhir untuk mengamankan kembali akses Anda. Pilih kata sandi yang kuat dan unik.
             </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="bg-white sm:bg-transparent sm:shadow-none shadow-xl rounded-2xl p-8 sm:p-0 border sm:border-none border-slate-100">
            {!isSuccess ? (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Buat Password Baru</h2>
                  <p className="text-slate-500 mt-2 text-sm">Silakan masukkan password baru Anda di bawah ini.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-1.5 relative">
                    <label className="block text-sm font-medium text-slate-700">Password Baru</label>
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
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
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

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Konfirmasi Password</label>
                    <div className="relative">
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

                  <div className="pt-2">
                    <Button 
                        type="submit" 
                        className="w-full py-2.5 text-sm font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-slate-900" 
                        loading={isLoading}
                    >
                      Update Password
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">Password Diperbarui</h2>
                <p className="text-slate-500 text-sm mb-8">
                  Password Anda telah berhasil diubah. Sekarang Anda dapat masuk dengan password baru Anda.
                </p>
                <Link to="/" className="inline-block w-full py-2.5 text-sm font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all text-center">
                  Kembali ke Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
