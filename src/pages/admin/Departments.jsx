import { useEffect, useState } from "react";
import useAdminStore from "../../store/AdminStore";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Swal from "sweetalert2";
import Wrapper from "../../components/layouts/Wrapper";

export default function Departments() {
  const { departments, fetchDepartments, createDepartment, updateDepartment, deleteDepartment, loading } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openModal = (dept = null) => {
    if (dept) {
      setSelectedDept(dept);
      setFormData({ name: dept.name, description: dept.description || "" });
    } else {
      setSelectedDept(null);
      setFormData({ name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedDept) {
        await updateDepartment(selectedDept.id, formData);
        Swal.fire("Success", "Department updated", "success");
      } else {
        await createDepartment(formData);
        Swal.fire("Success", "Department created", "success");
      }
      fetchDepartments();
      setIsModalOpen(false);
    } catch (err) {
      Swal.fire("Error", "Failed to save department", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Users in this department will lose their association!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteDepartment(id);
        Swal.fire("Deleted!", "Department has been deleted.", "success");
        fetchDepartments();
      } catch (err) {
        Swal.fire("Error", "Failed to delete department", "error");
      }
    }
  };

  return (
    <Wrapper>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Manage Departments</h3>
        <Button onClick={() => openModal()}>+ Add Department</Button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 uppercase font-bold text-slate-500 text-xs">
            <tr>
              <th className="py-5 px-8">Name</th>
              <th className="py-5 px-8">Description</th>
              <th className="py-5 px-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {departments.length > 0 ? (
              departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-8 font-bold text-slate-900">{dept.name}</td>
                  <td className="py-5 px-8 text-slate-500">{dept.description || "-"}</td>
                  <td className="py-5 px-8 text-right space-x-4">
                    <button onClick={() => openModal(dept)} className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors">Edit</button>
                    <button onClick={() => handleDelete(dept.id)} className="text-rose-600 hover:text-rose-800 font-bold transition-colors">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-12 text-center text-slate-400 italic">No departments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedDept ? "Edit Department" : "Add Department"}>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4 text-left">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Department Name</label>
            <Input
              required
              className="mt-1"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Description</label>
            <textarea
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 mt-1"
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {selectedDept ? "Update Department" : "Create Department"}
          </Button>
        </form>
      </Modal>
      </div>
    </Wrapper>
  );
}
