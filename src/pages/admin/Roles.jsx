import Pagination from "../../components/ui/Pagination";
import Modal from "../../components/ui/Modal";
import { useEffect, useState } from "react";
import useAdminStore from "../../store/AdminStore";
import Button from "../../components/ui/Button";
import Swal from "sweetalert2";

export default function Roles() {
  const { roles, fetchRoles, createRole, updateRole, deleteRole, loading } = useAdminStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const openModal = (role = null) => {
    if (role) {
      setSelectedRole(role);
      setFormData({
        name: role.name,
        description: role.description || "",
      });
    } else {
      setSelectedRole(null);
      setFormData({ name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRole) {
        await updateRole(selectedRole.id, formData);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Role updated successfully.',
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await createRole(formData);
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'New role created successfully.',
          timer: 2000,
          showConfirmButton: false,
        });
      }
      await fetchRoles();
      setIsModalOpen(false);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: err.response?.data?.message || 'Error saving role',
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteRole(id);
        Swal.fire(
          'Deleted!',
          'Role has been deleted.',
          'success'
        );
        fetchRoles();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: err.response?.data?.message || 'Failed to delete role.',
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Manage Roles</h3>
        <Button onClick={() => openModal()}>+ Add New Role</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 uppercase font-bold text-gray-500 text-xs">
            <tr>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {roles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((role) => (
              <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 font-medium text-gray-900">{role.name}</td>
                <td className="py-4 px-6 space-x-2">
                  <button onClick={() => openModal(role)} className="text-blue-600 hover:text-blue-800 font-semibold">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(role.id)} className="text-red-600 hover:text-red-800 font-semibold">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalItems={roles.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRole ? "Edit Role" : "Add New Role"}
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Role Name</label>
            <input
              required
              placeholder="e.g. Admin, User, Manager"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="gray" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {selectedRole ? "Save Changes" : "Create Role"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
