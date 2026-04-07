import AttendanceSummary from "./AttendanceSummary";
import Button from "../ui/Button";
import { useState, useEffect } from "react";
import UploadModal from "./UploadModal";
import useAttendanceStore from "../../store/AttendanceStore";
import Swal from "sweetalert2";

export default function AttendanceCard({ data }) {
  const { checkIn, checkOut, loading } = useAttendanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const openModal = (mode) => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleCheckOut = async () => {
    const result = await Swal.fire({
      title: 'Konfirmasi Check Out',
      text: "Apakah Anda yakin ingin melakukan check-out sekarang?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Check Out',
      cancelButtonText: 'Batal',
      background: '#ffffff',
    });

    if (result.isConfirmed) {
      await handleConfirm(null, "check-out");
    }
  };

  const handleConfirm = async (base64Image, overrideMode = null) => {
    const currentMode = overrideMode || modalMode;
    try {
      let currentPosition = "-6.2,106.8";

      const getBrowserLocation = () => {
        return new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            return reject(new Error("Geolocation not supported"));
          }
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(`${pos.coords.latitude},${pos.coords.longitude}`),
            (err) => reject(err),
            { timeout: 5000, enableHighAccuracy: true }
          );
        });
      };

      try {
        currentPosition = await getBrowserLocation();
      } catch (browserErr) {
        console.warn("Browser Geolocation failed, trying IP API:", browserErr.message);
        try {
          const res = await fetch("https://get.geojs.io/v1/ip/geo.json");
          const locData = await res.json();
          if (locData.latitude && locData.longitude) {
            currentPosition = `${locData.latitude},${locData.longitude}`;
          }
        } catch (apiErr) {
          console.warn("IP-based location also failed, using default:", apiErr.message);
        }
      }

      const payload = {
        location: currentPosition,
        face_recognition: base64Image,
      };

      if (currentMode === "check-in") {
        await checkIn(payload);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Berhasil melakukan check-in.',
          timer: 3000,
          showConfirmButton: false,
          background: '#ffffff',
          iconColor: '#3b82f6',
        });
      } else {
        await checkOut(payload);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Berhasil melakukan check-out.',
          timer: 3000,
          showConfirmButton: false,
          background: '#ffffff',
          iconColor: '#10b981',
        });
      }

      setIsModalOpen(false);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: err.response?.data?.message || err.message || "Gagal melakukan absensi.",
        confirmButtonColor: '#3b82f6',
      });
      console.error(err);
    }
  };

  const isToday = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const todayAttendance = isToday(data?.attendance?.log_in_time) ? data.attendance : null;
  const isCheckedIn = !!todayAttendance;
  const isCheckedOut = !!todayAttendance?.log_out_time;

  const dateTimeNow = now.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "medium",
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-md text-gray-700 font-bold tabular-nums">
          {dateTimeNow}
        </h3>
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          onClick={() => openModal("check-in")}
          disabled={loading || isCheckedIn}
        >
          Check In
        </Button>

        <Button
          variant="success"
          onClick={handleCheckOut}
          disabled={loading || !isCheckedIn || isCheckedOut}
        >
          Check Out
        </Button>
      </div>

      <AttendanceSummary data={todayAttendance} />

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        mode={modalMode}
        loading={loading}
      />
    </div>
  );
}
