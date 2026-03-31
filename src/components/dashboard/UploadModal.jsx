import { useState, useRef } from "react";
import Button from "../ui/Button";

export default function UploadModal({ isOpen, onClose, onConfirm, mode, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
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

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.5); 
        setPreview(compressedBase64);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (!preview) {
      alert("Pilih foto terlebih dahulu.");
      return;
    }
    onConfirm(preview); 
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 animate-in fade-in transition-all">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-lg text-gray-800 capitalize">
            {mode === 'check-in' ? 'Check In' : 'Check Out'} - Upload Photo
          </h3>
          <button 
            onClick={handleClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div 
            onClick={() => !loading && fileInputRef.current.click()}
            className={`
              relative aspect-video rounded-xl border-2 border-dashed border-gray-300 
              flex flex-col items-center justify-center cursor-pointer overflow-hidden
              transition-all hover:border-blue-400 hover:bg-blue-50/30 group
              ${preview ? 'border-solid border-blue-100' : ''}
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {preview ? (
              <img 
                src={preview} 
                alt="Upload Preview" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="text-center p-4">
                <p className="text-sm font-medium text-gray-700">Pilih atau ambil foto</p>
                <p className="text-xs text-gray-400 mt-1">Hanya file gambar (JPG, PNG)</p>
              </div>
            )}
            
            {loading && (
              <div className="absolute inset-0 bg-white/40 flex items-center justify-center backdrop-blur-[2px]">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
          />

          <div className="mt-6 flex gap-3">
             <Button 
              variant="danger"
              className="flex-1"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1"
              onClick={handleConfirm}
              disabled={loading || !preview}
              variant={mode === 'check-out' ? 'success' : 'primary'}
            >
              {loading ? "Processing..." : `Confirm ${mode === 'check-in' ? 'Check In' : 'Check Out'}`}
            </Button>
          </div>
          
          <p className="text-[10px] text-gray-400 text-center mt-4">
             Dengan melakukan konfirmasi, foto dan lokasi Anda akan tercatat di sistem perusahaan.
          </p>
        </div>
      </div>
    </div>
  );
}
