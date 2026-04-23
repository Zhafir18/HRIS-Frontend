import Pagination from "../../components/ui/Pagination";
import Modal from "../../components/ui/Modal";
import { useEffect, useState } from "react";
import useAdminStore from "../../store/AdminStore";
import Button from "../../components/ui/Button";
import Swal from "sweetalert2";
import Wrapper from "../../components/layouts/Wrapper";

export default function Users() {
  const { users, roles, fetchUsers, fetchRoles, createUser, updateUser, deleteUser, loading } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role_id: "",
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchUsers({
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm || undefined,
    });
  }, [currentPage, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const openModal = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        password: "",
      });
    } else {
      setSelectedUser(null);
      setFormData({ username: "", email: "", password: "", role_id: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'User data has been updated successfully.',
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await createUser(formData);
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'New user has been created successfully.',
          timer: 2000,
          showConfirmButton: false,
        });
      }
      await fetchUsers();
      setIsModalOpen(false);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: err.response?.data?.message || 'Failed to save user data.',
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
        await deleteUser(id);
        Swal.fire(
          'Deleted!',
          'User has been deleted.',
          'success'
        );
        fetchUsers();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: err.response?.data?.message || 'Failed to delete user.',
        });
      }
    }
  };

  return (
    <Wrapper>
      <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-xl font-bold">Manage Users</h3>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search username..."
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
                <button 
                    onClick={handleClearSearch}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                    ×
                </button>
            )}
          </div>
          <Button onClick={() => openModal()}>+ Add User</Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 uppercase font-bold text-gray-500 text-xs">
            <tr>
              <th className="py-4 px-6">Username</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {users.items.length > 0 ? (
              users.items.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 hover:bg-opacity-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">{user.username}</td>
                  <td className="py-4 px-6 text-gray-600">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-md">
                      {user.role?.name || "No Role"}
                    </span>
                  </td>
                  <td className="py-4 px-6 space-x-2">
                    <button onClick={() => openModal(user)} className="text-blue-600 hover:text-blue-800 font-semibold">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800 font-semibold">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-400 italic">
                        {loading ? "Loading users..." : "No users found."}
                    </td>
                </tr>
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalItems={users.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? "Edit User" : "Add New User"}
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Username</label>
            <input
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email</label>
            <input
              required
              type="email"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
              Password {selectedUser && "(optional)"}
            </label>
            <input
              required={!selectedUser}
              type="password"
              placeholder={selectedUser ? "Leave blank to keep current" : "Enter password"}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div className="space-y-1 pb-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Role</label>
            <select
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium text-gray-700"
              value={formData.role_id}
              onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {selectedUser ? "Save Changes" : "Create User"}
            </Button>
          </div>
        </form>
      </Modal>
      </div>
    </Wrapper>
  );
}
