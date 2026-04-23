import { useEffect, useState } from "react";
import useLeaveStore from "../../store/LeaveStore";
import Wrapper from "../../components/layouts/Wrapper";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Pagination from "../../components/ui/Pagination";
import Swal from "sweetalert2";

export default function ManageLeaves() {
  const { adminLeaves, fetchAdminLeaves, updateLeaveStatus, loading } = useLeaveStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const itemsPerPage = 8;
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [targetLeave, setTargetLeave] = useState(null);
  const [actionType, setActionType] = useState(""); // APPROVED or REJECTED
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    fetchAdminLeaves(currentPage, itemsPerPage, selectedStatus || null);
  }, [currentPage, selectedStatus]);

  const handleAction = async (leave, type) => {
    setTargetLeave(leave);
    setActionType(type);
    setAdminNote("");
    setIsNoteModalOpen(true);
  };

  const confirmAction = async () => {
    try {
      await updateLeaveStatus(targetLeave.id, actionType, adminNote);
      Swal.fire("Success", `Request ${actionType.toLowerCase()}`, "success");
      setIsNoteModalOpen(false);
      fetchAdminLeaves(currentPage, itemsPerPage, selectedStatus || null);
    } catch (err) {
      Swal.fire("Error", "Failed to update status", "error");
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Manage Employee Leaves</h1>
          
          <select
            className="w-full md:w-48 px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
            value={selectedStatus}
            onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
            }}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-left">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 uppercase font-bold text-slate-500 text-xs">
              <tr>
                <th className="py-4 px-6 font-bold">Employee</th>
                <th className="py-4 px-6 font-bold">Type</th>
                <th className="py-4 px-6 font-bold">Dates</th>
                <th className="py-4 px-6 font-bold">Reason</th>
                <th className="py-4 px-6 font-bold text-center">Status</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {adminLeaves.items.length > 0 ? (
                adminLeaves.items.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{leave.user?.username}</div>
                      <div className="text-[10px] text-slate-400">{leave.user?.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-slate-700">{leave.type}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs text-slate-600">
                      {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 truncate max-w-[150px]" title={leave.reason}>
                      {leave.reason}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusStyle(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {leave.status === "PENDING" ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleAction(leave, "APPROVED")}
                            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1 rounded-lg font-bold transition-all"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleAction(leave, "REJECTED")}
                            className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1 rounded-lg font-bold transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 font-medium italic">
                          Processed
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 italic">
                    {loading ? "Loading..." : "No requests found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination 
            currentPage={currentPage}
            totalItems={adminLeaves.total}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>

        <Modal
          isOpen={isNoteModalOpen}
          onClose={() => setIsNoteModalOpen(false)}
          title={actionType === "APPROVED" ? "Approve Leave Request" : "Reject Leave Request"}
        >
          <div className="space-y-5 pt-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <p className="text-xs font-bold text-slate-500 uppercase mb-2">Request Details</p>
               <p className="text-sm text-slate-700"><strong>Employee:</strong> {targetLeave?.user?.username}</p>
               <p className="text-sm text-slate-700"><strong>Dates:</strong> {targetLeave && `${new Date(targetLeave.start_date).toLocaleDateString()} - ${new Date(targetLeave.end_date).toLocaleDateString()}`}</p>
               <p className="text-sm text-slate-700"><strong>Reason:</strong> {targetLeave?.reason}</p>
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">
                Admin Notes (Optional)
              </label>
              <textarea
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm h-24"
                placeholder={actionType === "APPROVED" ? "Enjoy your leave!" : "Reason for rejection..."}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              ></textarea>
            </div>

            <div className="flex gap-3">
               <Button 
                variant="secondary" 
                className="flex-1" 
                onClick={() => setIsNoteModalOpen(false)}
               >
                 Cancel
               </Button>
               <Button 
                 onClick={confirmAction} 
                 loading={loading}
                 className={`flex-1 ${actionType === "APPROVED" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"}`}
               >
                 Confirm {actionType.toLowerCase()}
               </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Wrapper>
  );
}
