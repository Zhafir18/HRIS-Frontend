import { useEffect, useState } from "react";
import useSalaryStore from "../../store/SalaryStore";
import useAdminStore from "../../store/AdminStore";
import Wrapper from "../../components/layouts/Wrapper";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Pagination from "../../components/ui/Pagination";
import Swal from "sweetalert2";

export default function ManageSalary() {
  const { salaries, fetchSalaries, createSalary, updateSalaryStatus, deleteSalary, loading } = useSalaryStore();
  const { users, fetchUsers } = useAdminStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    user_id: "",
    amount: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    status: "PENDING",
  });

  useEffect(() => {
    fetchSalaries(currentPage, itemsPerPage);
    fetchUsers({ limit: 100 }); // Fetch users for dropdown
  }, [currentPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSalary({
        ...formData,
        amount: parseFloat(formData.amount),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
      });
      Swal.fire("Success", "Salary record created", "success");
      setIsModalOpen(false);
      fetchSalaries(currentPage, itemsPerPage);
      setFormData({
        user_id: "",
        amount: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        status: "PENDING",
      });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to create record", "error");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateSalaryStatus(id, status);
      Swal.fire("Updated", `Salary marked as ${status.toLowerCase()}`, "success");
      fetchSalaries(currentPage, itemsPerPage);
    } catch (err) {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: "Delete record?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
    });

    if (res.isConfirmed) {
      try {
        await deleteSalary(id);
        Swal.fire("Deleted", "Record removed", "success");
        fetchSalaries(currentPage, itemsPerPage);
      } catch (err) {
        Swal.fire("Error", "Failed to delete record", "error");
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const getMonthName = (month) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[month - 1];
  };

  return (
    <Wrapper>
      <div className="space-y-6 text-left">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Manage Salaries</h1>
          <Button onClick={() => setIsModalOpen(true)}>+ Create Salary Slip</Button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 uppercase font-bold text-slate-500 text-xs">
              <tr>
                <th className="py-4 px-6 font-bold">Employee</th>
                <th className="py-4 px-6 font-bold">Period</th>
                <th className="py-4 px-6 font-bold text-right">Amount</th>
                <th className="py-4 px-6 font-bold text-center">Status</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {salaries.items.length > 0 ? (
                salaries.items.map((salary) => (
                  <tr key={salary.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{salary.user?.username}</div>
                      <div className="text-[10px] text-slate-400">{salary.user?.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-slate-700">{getMonthName(salary.month)} {salary.year}</span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-slate-900">
                      {formatCurrency(salary.amount)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        salary.status === "PAID" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                      }`}>
                        {salary.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        {salary.status === "PENDING" && (
                          <button 
                            onClick={() => handleUpdateStatus(salary.id, "PAID")}
                            className="text-emerald-600 hover:text-emerald-800 font-bold"
                          >
                            Mark Paid
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(salary.id)}
                          className="text-rose-500 hover:text-rose-800 font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400 italic">
                    {loading ? "Loading..." : "No salary records found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination 
            currentPage={currentPage}
            totalItems={salaries.total}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create Salary Slip"
        >
          <form onSubmit={handleSubmit} className="space-y-5 pt-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">Employee</label>
              <select
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
                required
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              >
                <option value="">Select Employee</option>
                {users.items.map((u) => (
                  <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">Amount (IDR)</label>
              <Input 
                type="number"
                placeholder="e.g. 5000000"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">Month</label>
                <select
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i+1} value={i+1}>{getMonthName(i+1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">Year</label>
                <Input 
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" loading={loading} className="w-full py-3">Create Record</Button>
            </div>
          </form>
        </Modal>
      </div>
    </Wrapper>
  );
}
