import { useState, useRef } from "react";
import Button from "../ui/Button";
import CameraCapture from "./CameraCapture";

export default function UploadModal({ isOpen, onClose, onConfirm, mode, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [useCamera, setUseCamera] = useState(true);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const MAX_WIDTH = 600; 
        const MAX_HEIGHT = 600; 
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7); 
        setPreview(compressedBase64);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (!preview) {
      alert("Pilih atau ambil foto terlebih dahulu.");
      return;
    }
    onConfirm(preview); 
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setUseCamera(true);
    onClose();
  };

  const handleCapture = (base64Image) => {
    setPreview(base64Image);
    setUseCamera(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in transition-all">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b flex justify-between items-center bg-gray-50/30">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Self-Attendance</span>
            <h3 className="font-extrabold text-xl text-gray-900 capitalize">
              {mode === 'check-in' ? 'Check In' : 'Check Out'}
            </h3>
          </div>
          <button 
            onClick={handleClose} 
            className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:scale-105 active:scale-95 transition-all"
          >
            ✕
          </button>
        </div>

        <div className="p-8">
          {useCamera && !preview ? (
            <div className="space-y-6">
              <CameraCapture 
                onCapture={handleCapture}
                onCancel={() => setUseCamera(false)}
                loading={loading}
              />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                  <span className="bg-white px-3 text-gray-300 font-bold">Atau</span>
                </div>
              </div>
              <button 
                onClick={() => setUseCamera(false)}
                className="w-full py-4 text-sm font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-2xl border-2 border-dashed border-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <span>Upload File dari Galeri</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div 
                onClick={() => !loading && !preview && fileInputRef.current.click()}
                className={`
                  relative aspect-video rounded-2xl border-2 border-dashed 
                  flex flex-col items-center justify-center cursor-pointer overflow-hidden
                  transition-all group
                  ${preview ? 'border-blue-50/50 shadow-inner' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/30'}
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {preview ? (
                  <>
                    <img 
                      src={preview} 
                      alt="Captured Preview" 
                      className="w-full h-full object-cover" 
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreview(null);
                        setUseCamera(true);
                      }}
                      className="absolute top-4 right-4 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white font-bold text-xs px-3 py-1.5 rounded-full border border-white/30 transition-all flex items-center gap-1.5"
                    >
                      <span>Foto Ulang</span>
                    </button>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <p className="text-base font-bold text-gray-800">Pilih Foto</p>
                    <p className="text-xs text-gray-500 mt-1 max-w-[200px]">Klik untuk mengambil foto dari galeri atau seret file ke sini</p>
                  </div>
                )}
                
                {loading && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
                  </div>
                )}
              </div>

              {!preview && (
                 <button 
                  onClick={() => setUseCamera(true)}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2 group transform active:scale-[0.98]"
                >
                   <span>Buka Kamera</span>
                </button>
              )}

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
              />

              <div className="flex gap-4">
                <Button 
                  variant="danger"
                  className="flex-1 py-4 font-bold border-2 border-red-50 text-red-500 hover:bg-red-50 transition-all"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button 
                  className="flex-1 py-4 font-extrabold shadow-xl transition-all transform active:scale-[0.98]"
                  onClick={handleConfirm}
                  disabled={loading || !preview}
                  variant={mode === 'check-out' ? 'success' : 'primary'}
                >
                  {loading ? "Selesai..." : `Konfirmasi ${mode === 'check-in' ? 'Check In' : 'Check Out'}`}
                </Button>
              </div>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-50">
             <div className="flex items-start gap-3 p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50">
                <span className="text-lg">📍</span>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  <strong>Penting:</strong> Lokasi GPS dan foto wajah akan diperiksa oleh sistem keamanan untuk memastikan autentisitas absensi. Pastikan Anda berada di area kerja.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

