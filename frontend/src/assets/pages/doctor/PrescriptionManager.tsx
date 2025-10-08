import React, { useEffect, useState } from "react";
import type { DoctorProfile } from "../../../types";
import {
  FiFileText,
  FiEdit3,
  FiTrash2,
  FiX,
  FiCheck,
  FiEye,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import {
  prescriptionService,
  type PrescriptionDto,
} from "../../../services/PrescriptionService";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

interface PrescriptionManagerProps {
  profile: DoctorProfile;
  formDataFromAppointment?: {
    open: boolean;
    appointmentId: number;
    patientName: string;
    dateIssued: string;
  } | null;
  onPrescriptionCreated?: () => void;
}

const PrescriptionManager: React.FC<PrescriptionManagerProps> = ({
  profile,
  formDataFromAppointment,
  onPrescriptionCreated,
}) => {
  const [prescriptions, setPrescriptions] = useState<PrescriptionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<PrescriptionDto>({
    id: undefined,
    appointmentId: undefined,
    notes: "",
    dateIssued: new Date().toISOString().slice(0, 10),
    patientName: "",
  });
  const [viewData, setViewData] = useState<PrescriptionDto | null>(null);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await prescriptionService.getAllPrescriptionsByDoctor(
        profile.email
      );
      setPrescriptions(data || []);
    } catch (err) {
      console.error("Error loading prescriptions", err);
      alert("Failed to load prescriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile.email) loadPrescriptions();
  }, [profile.email]);

  useEffect(() => {
    if (formDataFromAppointment?.open) {
      setFormData({
        id: undefined,
        appointmentId: formDataFromAppointment.appointmentId,
        notes: "",
        dateIssued: formDataFromAppointment.dateIssued,
        patientName: formDataFromAppointment.patientName,
      });
      setShowForm(true);
    }
  }, [formDataFromAppointment]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedData = {
        ...formData,
        dateIssued: new Date(formData.dateIssued!).toISOString(),
      };

      if (formData.id) {
        await prescriptionService.updatePrescription(formData.id, updatedData);
      } else if (formData.appointmentId) {
        await prescriptionService.createPrescription(
          formData.appointmentId!,
          updatedData
        );
      } else {
        throw new Error("Appointment ID is required to create a prescription.");
      }

      await loadPrescriptions();
      setShowForm(false);
      onPrescriptionCreated?.();
    } catch (err) {
      console.error("Error saving prescription", err);
      alert("Failed to save prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (p: PrescriptionDto) => {
    try {
      setLoading(true);
      const details = await prescriptionService.getPrescriptionDetails(p.id!);

      setFormData({
        ...p,
        patientName: details.patientName || "",
        notes: details.notes || "",
        dateIssued: p.dateIssued
          ? p.dateIssued.slice(0, 10)
          : new Date().toISOString().slice(0, 10),
      });

      setShowForm(true);
    } catch (err) {
      console.error("Error fetching prescription details", err);
      alert("Failed to load prescription details.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (p: PrescriptionDto) => {
    try {
      setLoading(true);
      const details = await prescriptionService.getPrescriptionDetails(p.id!);
      setViewData({
        id: details.id,
        appointmentId: details.appointmentId,
        notes: details.notes ?? "",
        dateIssued: details.dateIssued,
        patientName: details.patientName,
      });
    } catch (err) {
      console.error("Error fetching prescription details", err);
      alert("Failed to load prescription details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this prescription?"))
      return;
    try {
      setLoading(true);
      await prescriptionService.deletePrescription(id);
      await loadPrescriptions();
      alert("Prescription deleted successfully.");
    } catch (err) {
      console.error("Error deleting prescription", err);
      alert("Failed to delete prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FiFileText className="text-blue-600 text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Prescription Management
            </h2>
            <p className="text-gray-500 text-sm">
              Manage and review patient prescriptions
            </p>
          </div>
       </div>
       
      </div>

      {/* Prescriptions Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <FiFileText className="mx-auto text-4xl text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-600 mb-1">
            No prescriptions found
          </h3>
          <p className="text-gray-500 text-sm">
            Get started by creating your first prescription.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointment ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes Preview
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Issued
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prescriptions.map((p, i) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {i + 1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    #{p.appointmentId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {p.notes || (
                      <span className="text-gray-400 italic">No notes</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {p.dateIssued?.slice(0, 10) || "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(p)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        title="View Prescription"
                      >
                        <FiEye className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Edit Prescription"
                      >
                        <FiEdit3 className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id!)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete Prescription"
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Prescription Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                {formData.id ? "Edit Prescription" : "Create New Prescription"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FiX className="text-gray-500 text-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FiUser className="text-gray-400" />
                    Patient Name
                  </label>
                  <input
                    value={formData.patientName || ""}
                    disabled
                    className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FiCalendar className="text-gray-400" />
                    Date Issued
                  </label>
                  <input
                    type="date"
                    value={formData.dateIssued}
                    onChange={(e) =>
                      setFormData({ ...formData, dateIssued: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinical Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                  rows={6}
                  placeholder="Enter prescription details, medications, dosage instructions, and any relevant clinical notes..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium"
                >
                  <FiX />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors duration-200 font-medium shadow-sm"
                >
                  <FiCheck />
                  {formData.id ? "Update Prescription" : "Create Prescription"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription View Modal */}
      {viewData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                Prescription Details
              </h3>
              <button
                onClick={() => setViewData(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FiX className="text-gray-500 text-lg" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-600">Appointment ID</span>
                <span className="text-gray-800">#{viewData.appointmentId}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-600">Patient Name</span>
                <span className="text-gray-800">{viewData.patientName}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-600">Date Issued</span>
                <span className="text-gray-800">
                  {viewData.dateIssued?.slice(0, 10)}
                </span>
              </div>
              <div className="pt-2">
                <span className="font-medium text-gray-600 block mb-2">
                  Clinical Notes
                </span>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {viewData.notes || (
                      <span className="text-gray-400 italic">No notes provided</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setViewData(null)}
                className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionManager;