import useAuthStore from "../store/AuthStore";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const forgotPassword = useAuthStore((state) => state.forgotPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email wajib diisi.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      Swal.fire({
        icon: 'success',
        title: 'Email Terkirim',
        text: 'Instruksi reset password telah dikirim ke email Anda.',
        confirmButtonColor: '#0f172a',
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.";
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
      {/* Left side - Branding/Image (Hidden on mobile) */}
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
               Pemulihan <br/>
               Kata Sandi
             </h1>
             <p className="text-slate-300 text-lg max-w-md font-light leading-relaxed">
               Jangan khawatir, kami akan membantu Anda kembali masuk ke akun Anda dengan aman dan cepat.
             </p>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center space-x-4">
              <div className="h-px w-12 bg-slate-600"></div>
              <p className="text-slate-400 text-sm tracking-widest uppercase font-medium">Sistem Keamanan Terpadu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 rounded-xl shadow-md mb-4">
               <span className="text-white text-2xl font-bold">H</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">HRIS Portal</h1>
          </div>

          <div className="bg-white sm:bg-transparent sm:shadow-none shadow-xl rounded-2xl p-8 sm:p-0 border sm:border-none border-slate-100">
            {!isSubmitted ? (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Lupa Password?</h2>
                  <p className="text-slate-500 mt-2 text-sm">Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang password.</p>
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

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Email Kerja</label>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="nama@perusahaan.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                      Kirim Tautan Reset
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
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">Cek Email Anda</h2>
                <p className="text-slate-500 text-sm mb-8">
                  Kami telah mengirimkan instruksi ke <strong>{email}</strong>. Silakan periksa kotak masuk dan folder spam Anda.
                </p>
                <Link to="/" className="inline-block w-full py-2.5 text-sm font-medium rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 transition-all">
                  Kembali ke Login
                </Link>
              </div>
            )}
            
            {!isSubmitted && (
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  Ingat password Anda? <Link to="/" className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">Login sekarang</Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
