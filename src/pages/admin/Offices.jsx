import { useEffect, useState } from "react";
import useAdminStore from "../../store/AdminStore";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Swal from "sweetalert2";
import Wrapper from "../../components/layouts/Wrapper";

export default function Offices() {
  const { offices, fetchOffices, createOffice, updateOffice, deleteOffice, loading } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [formData, setFormData] = useState({ name: "", latitude: "", longitude: "", radius: 100 });

  useEffect(() => {
    fetchOffices();
  }, []);

  const openModal = (office = null) => {
    if (office) {
      setSelectedOffice(office);
      setFormData({ 
        name: office.name, 
        latitude: office.latitude, 
        longitude: office.longitude,
        radius: office.radius
      });
    } else {
      setSelectedOffice(null);
      setFormData({ name: "", latitude: "", longitude: "", radius: 100 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        radius: parseInt(formData.radius)
      };

      if (selectedOffice) {
        await updateOffice(selectedOffice.id, payload);
        Swal.fire("Success", "Office updated", "success");
      } else {
        await createOffice(payload);
        Swal.fire("Success", "Office created", "success");
      }
      fetchOffices();
      setIsModalOpen(false);
    } catch (err) {
      Swal.fire("Error", "Failed to save office", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This office location will be removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteOffice(id);
        Swal.fire("Deleted!", "Office has been deleted.", "success");
        fetchOffices();
      } catch (err) {
        Swal.fire("Error", "Failed to delete office", "error");
      }
    }
  };

  return (
    <Wrapper>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Manage Offices</h3>
        <Button onClick={() => openModal()}>+ Add Office</Button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 uppercase font-bold text-slate-500 text-xs">
            <tr>
              <th className="py-5 px-8">Name</th>
              <th className="py-5 px-8">Coordinates</th>
              <th className="py-5 px-8">Radius</th>
              <th className="py-5 px-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {offices.length > 0 ? (
              offices.map((office) => (
                <tr key={office.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-8 font-bold text-slate-900">{office.name}</td>
                  <td className="py-5 px-8 text-slate-500 font-mono text-xs">{office.latitude}, {office.longitude}</td>
                  <td className="py-5 px-8 text-slate-600 font-medium">{office.radius}m</td>
                  <td className="py-5 px-8 text-right space-x-4">
                    <button onClick={() => openModal(office)} className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors">Edit</button>
                    <button onClick={() => handleDelete(office.id)} className="text-rose-600 hover:text-rose-800 font-bold transition-colors">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-12 text-center text-slate-400 italic">No offices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedOffice ? "Edit Office" : "Add Office"}>
        <form onSubmit={handleSubmit} className="space-y-5 pt-4 text-left">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Office Name</label>
            <Input
              required
              className="mt-1"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Latitude</label>
              <Input
                required
                type="number"
                step="any"
                className="mt-1 font-mono text-xs"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Longitude</label>
              <Input
                required
                type="number"
                step="any"
                className="mt-1 font-mono text-xs"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Geofence Radius (meters)</label>
            <Input
              required
              type="number"
              className="mt-1"
              value={formData.radius}
              onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {selectedOffice ? "Update Office Location" : "Save Office Location"}
          </Button>
        </form>
      </Modal>
      </div>
    </Wrapper>
  );
}
