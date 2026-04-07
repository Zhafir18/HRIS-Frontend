import { useState, useRef, useEffect } from "react";
import Button from "../ui/Button";

export default function CameraCapture({ onCapture, onCancel, loading }) {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const constraints = {
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false,
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Gagal mengakses kamera. Pastikan izin kamera telah diberikan.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.save();

    context.translate(canvas.width, 0);
    context.scale(-1, 1);

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    context.restore();

    const base64Image = canvas.toDataURL("image/jpeg", 0.7);
    onCapture(base64Image);
    stopCamera();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-inner border border-gray-100">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-3">
              <span className="text-xl">⚠️</span>
            </div>
            <p className="text-sm font-medium text-gray-200">{error}</p>
            <button
              onClick={startCamera}
              className="mt-4 text-xs font-bold text-blue-400 hover:text-blue-300 underline"
            >
              Coba lagi
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain"
            />
            {!stream && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-3 w-full">
        <Button
          variant="danger"
          onClick={() => {
            stopCamera();
            onCancel();
          }}
          className="flex-1"
          disabled={loading}
        >
          Batal
        </Button>
        <Button
          onClick={handleCapture}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          disabled={!stream || loading}
        >
          Ambil Foto
        </Button>
      </div>
    </div>
  );
}
