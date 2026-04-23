import { useEffect, useState } from "react";
import useLeaveStore from "../store/LeaveStore";
import Wrapper from "../components/layouts/Wrapper";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import Pagination from "../components/ui/Pagination";
import Swal from "sweetalert2";

export default function LeaveRequests() {
  const { myLeaves, fetchMyLeaves, applyLeave, deleteLeave, loading } = useLeaveStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    type: "ANNUAL",
    reason: "",
  });

  useEffect(() => {
    fetchMyLeaves(currentPage, itemsPerPage);
  }, [currentPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await applyLeave(formData);
      Swal.fire("Success", "Request submitted", "success");
      setIsModalOpen(false);
      fetchMyLeaves(currentPage, itemsPerPage);
      setFormData({ start_date: "", end_date: "", type: "ANNUAL", reason: "" });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to submit", "error");
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: "Cancel Request?",
      text: "You can only cancel pending requests",
      icon: "warning",
      showCancelButton: true,
    });

    if (res.isConfirmed) {
      try {
        await deleteLeave(id);
        Swal.fire("Deleted", "Request cancelled", "success");
        fetchMyLeaves(currentPage, itemsPerPage);
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || "Failed to delete", "error");
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED": return "bg-emerald-500 text-white";
      case "REJECTED": return "bg-rose-500 text-white";
      default: return "bg-amber-500 text-white";
    }
  };

  return (
    <Wrapper>
      <div className="space-y-6 text-left">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">My Leave Requests</h1>
          <Button onClick={() => setIsModalOpen(true)}>+ Apply for Leave</Button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 uppercase font-bold text-slate-500 text-xs">
              <tr>
                <th className="py-4 px-6 font-bold">Type</th>
                <th className="py-4 px-6 font-bold">Dates</th>
                <th className="py-4 px-6 font-bold">Reason</th>
                <th className="py-4 px-6 font-bold text-center">Status</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {myLeaves.items.length > 0 ? (
                myLeaves.items.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-700">{leave.type}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-slate-900 font-medium">
                        {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 truncate max-w-[200px]">
                      {leave.reason}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusStyle(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {leave.status === "PENDING" && (
                        <button 
                            onClick={() => handleDelete(leave.id)}
                            className="text-rose-500 hover:text-rose-700 font-bold"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400 italic">
                    {loading ? "Loading..." : "No leave requests found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination 
            currentPage={currentPage}
            totalItems={myLeaves.total}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Apply for Leave"
        >
          <form onSubmit={handleSubmit} className="space-y-5 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">Start Date</label>
                <Input 
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">End Date</label>
                <Input 
                  type="date"
                  required
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">Leave Type</label>
              <select
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="ANNUAL">Annual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="UNPAID">Unpaid Leave</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">Reason</label>
              <textarea
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm h-24"
                placeholder="Brief reason for your leave..."
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              ></textarea>
            </div>

            <div className="pt-2">
              <Button type="submit" loading={loading} className="w-full py-3">Submit Request</Button>
            </div>
          </form>
        </Modal>
      </div>
    </Wrapper>
  );
}
