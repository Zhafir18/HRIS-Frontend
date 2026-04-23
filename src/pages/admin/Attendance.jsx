import Pagination from "../../components/ui/Pagination";
import Modal from "../../components/ui/Modal";
import { useEffect, useState } from "react";
import useAdminStore from "../../store/AdminStore";
import Wrapper from "../../components/layouts/Wrapper";

export default function Attendance() {
  const { allAttendance, fetchAllAttendance, users, fetchUsers, loading } =
    useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      user_id: selectedUserId || undefined,
      date: selectedDate || undefined,
      status: selectedStatus || undefined,
      search: searchTerm || undefined,
    };
    fetchAllAttendance(params);
  }, [currentPage, searchTerm, selectedUserId, selectedDate, selectedStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedUserId, selectedDate, selectedStatus]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedUserId("");
    setSelectedDate("");
    setSelectedStatus("");
    setCurrentPage(1);
  };

  const formatImageSrc = (src) => {
    if (!src) return "";

    if (src.startsWith("http")) return src;

    if (src.startsWith("/")) {
      return `${import.meta.env.VITE_API_URL || "http://localhost:7000"}${src}`;
    }

    if (src.startsWith("data:image")) return src;

    return `data:image/jpeg;base64,${src}`;
  };

  const handleViewPhoto = (photo) => {
    setSelectedPhoto(formatImageSrc(photo));
    setIsPhotoModalOpen(true);
  };

  return (
    <Wrapper>
      <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-xl font-bold">Attendance Logs</h3>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            className="flex-1 md:w-40 px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium text-gray-700"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">All Users</option>
            {users.items.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>

          <select
            className="flex-1 md:w-40 px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium text-gray-700"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Normal">Normal</option>
            <option value="Late">Late</option>
          </select>

          <input
            type="date"
            className="flex-1 md:w-40 px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium text-gray-700"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          {(searchTerm || selectedUserId || selectedDate || selectedStatus) && (
            <button
              onClick={handleClearFilters}
              className="text-sm font-bold text-red-500 hover:text-red-700 px-2 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 uppercase font-bold text-gray-500 text-xs">
            <tr>
              <th className="py-4 px-6 font-bold text-center">Photo</th>
              <th className="py-4 px-6 font-bold">User</th>
              <th className="py-4 px-6 font-bold">Date</th>
              <th className="py-4 px-6 font-bold">Check In</th>
              <th className="py-4 px-6 font-bold">Check Out</th>
              <th className="py-4 px-6 font-bold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {allAttendance.items.length > 0 ? (
              allAttendance.items.map((att) => (
                <tr key={att.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 flex justify-center">
                    {att.face_recognition ? (
                      <button
                        onClick={() => handleViewPhoto(att.face_recognition)}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all"
                      >
                        <img
                          src={formatImageSrc(att.face_recognition)}
                          alt="Recognition"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-300">
                        <span className="text-xs">No img</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">
                      {att.user?.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      {att.user?.email}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {new Date(att.log_in_time).toLocaleDateString("id-ID")}
                  </td>
                  <td className="py-4 px-6 tabular-nums text-xs">
                    {new Date(att.log_in_time).toLocaleTimeString("id-ID")}
                  </td>
                  <td className="py-4 px-6 tabular-nums text-xs">
                    {att.log_out_time
                      ? new Date(att.log_out_time).toLocaleTimeString()
                      : "-"}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        att.status === "Late"
                          ? "bg-red-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {att.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="py-12 text-center text-gray-400 italic"
                >
                  {loading ? "Loading logs..." : "No attendance logs found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalItems={allAttendance.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        title="Attendance Evidence Photo"
      >
        <div className="flex flex-col items-center">
          {selectedPhoto && (
            <img
              src={selectedPhoto}
              className="w-full h-auto rounded-xl shadow-lg border border-gray-100"
              alt="Attendance Evidence"
            />
          )}
          <p className="mt-4 text-xs text-gray-400 italic">
            This image is captured during check-in using the user's camera.
          </p>
        </div>
      </Modal>
      </div>
    </Wrapper>
  );
}
