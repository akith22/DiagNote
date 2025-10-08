import React, { useEffect, useState } from "react";
import type { DoctorProfile } from "../../../types";
import {
  FiFileText,
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiX,
  FiCheck,
  FiEye,
  FiUser,
  FiCalendar,
  FiMapPin,
  FiInfo,
  FiPrinter,
  FiDownload,
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

// Add type for prescription details
interface PrescriptionDetails {
  prescriptionId: number;
  appointmentId: number;
  notes: string;
  dateIssued: string;
  patientName: string;
  patientGender: string;
  patientAge: number;
  patientAddress: string;
}

const PrescriptionManager: React.FC<PrescriptionManagerProps> = ({
  profile,
  formDataFromAppointment,
  onPrescriptionCreated,
}) => {
  const [prescriptions, setPrescriptions] = useState<PrescriptionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPrescription, setCurrentPrescription] = useState<PrescriptionDetails | null>(null);
  const [formData, setFormData] = useState<PrescriptionDto>({
    id: undefined,
    appointmentId: undefined,
    notes: "",
    dateIssued: new Date().toISOString().slice(0, 10),
    patientName: "",
  });

  const [patientInfo, setPatientInfo] = useState<{
    name?: string;
    address?: string;
    gender?: string;
    age?: number;
  }>({});

  // Load all prescriptions for the doctor
  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await prescriptionService.getAllPrescriptionsByDoctor(
        profile.email
      );
      setPrescriptions(data || []);
    } catch (err) {
      console.error("❌ Error loading prescriptions", err);
      alert("Failed to load prescriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile.email) loadPrescriptions();
  }, [profile.email]);

  // Load patient info when form is opened from Appointment Manager
  useEffect(() => {
    const loadPatientInfo = async () => {
      if (formDataFromAppointment?.open && formDataFromAppointment.appointmentId) {
        setLoading(true);
        try {
          const details = await prescriptionService.getPatientDetailsByAppointment(formDataFromAppointment.appointmentId);

          setPatientInfo({
            name: details.name,
            address: details.address,
            gender: details.gender,
            age: details.age,
          });

          setFormData({
            id: undefined,
            appointmentId: formDataFromAppointment.appointmentId,
            notes: "",
            dateIssued: formDataFromAppointment.dateIssued || new Date().toISOString().slice(0, 10),
            patientName: details.name,
          });

        } catch (err) {
          console.error("⚠️ Could not fetch patient info", err);
          const fallbackName = formDataFromAppointment.patientName || "";
          setPatientInfo({ name: fallbackName });
          setFormData({
            id: undefined,
            appointmentId: formDataFromAppointment.appointmentId,
            notes: "",
            dateIssued: formDataFromAppointment.dateIssued || new Date().toISOString().slice(0, 10),
            patientName: fallbackName,
          });
        } finally {
          setLoading(false);
        }
      }
    };

    if (formDataFromAppointment?.open) {
      setShowForm(true);
      loadPatientInfo();
    }
  }, [formDataFromAppointment]);

  const handleNewPrescription = () => {
    setFormData({
      id: undefined,
      appointmentId: undefined,
      notes: "",
      dateIssued: new Date().toISOString().slice(0, 10),
      patientName: "",
    });
    setPatientInfo({});
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload: PrescriptionDto = {
        notes: formData.notes,
        dateIssued: new Date(formData.dateIssued!).toISOString(),
      };

      if (formData.id) {
        await prescriptionService.updatePrescription(formData.id, payload);
      } else if (formData.appointmentId) {
        await prescriptionService.createPrescription(
          formData.appointmentId,
          payload
        );
      } else {
        throw new Error("Appointment ID is required to create a prescription.");
      }

      await loadPrescriptions();
      setShowForm(false);
      onPrescriptionCreated?.();
      alert("Prescription saved successfully!");
    } catch (err) {
      console.error("❌ Error saving prescription", err);
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
        notes: details.notes || p.notes,
        dateIssued: p.dateIssued
          ? p.dateIssued.slice(0, 10)
          : new Date().toISOString().slice(0, 10),
      });

      setPatientInfo({
        name: details.patientName,
        address: details.patientAddress,
        gender: details.patientGender,
        age: details.patientAge,
      });

      setShowForm(true);
    } catch (err) {
      console.error("❌ Error fetching prescription details", err);
      alert("Failed to load prescription details.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (p: PrescriptionDto) => {
    try {
      setLoading(true);
      const details = await prescriptionService.getPrescriptionDetails(p.id!);
      setCurrentPrescription(details);
      setShowViewModal(true);
    } catch (err) {
      console.error("❌ Error fetching prescription details", err);
      alert("Failed to load prescription details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this prescription?")) return;
    try {
      setLoading(true);
      await prescriptionService.deletePrescription(id);
      await loadPrescriptions();
      alert("Prescription deleted successfully.");
    } catch (err) {
      console.error("❌ Error deleting prescription", err);
      alert("Failed to delete prescription.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    alert("PDF download functionality would be implemented here");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FiFileText className="text-2xl text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Prescription Management</h2>
              <p className="text-gray-600">Manage and create patient prescriptions</p>
            </div>
          </div>
         
        </div>

        {/* Prescriptions Table */}
        {loading && !showForm && !showViewModal ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <FiFileText className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Prescriptions Found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first prescription</p>
            <button
              onClick={handleNewPrescription}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Create Prescription
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Appointment ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Notes Preview
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date Issued
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {prescriptions.map((p, i) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {i + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          #{p.appointmentId}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {p.notes || <span className="text-gray-400 italic">No notes</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {p.dateIssued?.slice(0, 10) || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(p)}
                            className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors duration-200"
                            title="View Prescription"
                          >
                            <FiEye className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleEdit(p)}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                            title="Edit Prescription"
                          >
                            <FiEdit3 className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id!)}
                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                            title="Delete Prescription"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ENHANCED FORM MODAL */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <FiFileText className="text-xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {formData.id ? "Edit Prescription" : "Create New Prescription"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {formData.id ? "Update existing prescription details" : "Fill in the prescription details below"}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiX className="text-xl text-gray-600" />
                </button>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Patient Information Card */}
                    <div className="lg:col-span-1">
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 h-full">
                        <div className="flex items-center gap-2 mb-4">
                          <FiUser className="text-blue-600" />
                          <h4 className="font-semibold text-gray-900">Patient Information</h4>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <FiUser className="text-blue-600 text-sm" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Patient Name</p>
                              <p className="font-medium text-gray-900">
                                {patientInfo.name || formData.patientName || "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <FiMapPin className="text-green-600 text-sm" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Address</p>
                              <p className="font-medium text-gray-900">
                                {patientInfo.address || "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <FiUser className="text-purple-600 text-sm" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Gender</p>
                                <p className="font-medium text-gray-900">
                                  {patientInfo.gender || "Not specified"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                <FiInfo className="text-orange-600 text-sm" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Age</p>
                                <p className="font-medium text-gray-900">
                                  {patientInfo.age ? `${patientInfo.age} years` : "Not specified"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {formData.appointmentId && (
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <FiCalendar className="text-blue-600 text-sm" />
                              </div>
                              <div>
                                <p className="text-xs text-blue-600">Appointment ID</p>
                                <p className="font-medium text-blue-700">
                                  #{formData.appointmentId}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Prescription Details Card */}
                    <div className="lg:col-span-2">
                      <div className="bg-white rounded-xl p-6 border border-gray-200 h-full">
                        <div className="flex items-center gap-2 mb-6">
                          <FiEdit3 className="text-blue-600" />
                          <h4 className="font-semibold text-gray-900">Prescription Details</h4>
                        </div>

                        <div className="space-y-6">
                          {/* Date Issued */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Date Issued
                            </label>
                            <div className="relative">
                              <input
                                type="date"
                                value={formData.dateIssued}
                                onChange={(e) =>
                                  setFormData({ ...formData, dateIssued: e.target.value })
                                }
                                required
                                className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                              />
                              <FiCalendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                          </div>

                          {/* Prescription Notes */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                Prescription Notes & Instructions
                              </label>
                              <span className="text-xs text-gray-500">
                                {formData.notes.length}/2000 characters
                              </span>
                            </div>
                            <textarea
                              value={formData.notes}
                              onChange={(e) =>
                                setFormData({ ...formData, notes: e.target.value })
                              }
                              required
                              className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 resize-none"
                              rows={12}
                              placeholder="Enter detailed prescription notes, medications, dosage instructions, frequency, duration, special instructions, follow-up advice..."
                              maxLength={2000}
                            />
                            <div className="mt-2 text-xs text-gray-500">
                              Include: Medications, Dosage, Frequency, Duration, Special Instructions, Follow-up
                            </div>
                          </div>

                          {/* Signature Section */}
                          <div className="border-t pt-4 mt-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-gray-700">Doctor's Signature</p>
                                <p className="text-sm text-gray-500">Dr. {profile.name}</p>
                              </div>
                             
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-500">
                  {formData.id ? "Editing existing prescription" : "Creating new prescription"}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium transition-all duration-200"
                  >
                    <FiX /> Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <LoadingSpinner />
                    ) : (
                      <FiCheck className="text-lg" />
                    )}
                    {formData.id ? "Update Prescription" : "Create Prescription"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW PRESCRIPTION MODAL */}
        {showViewModal && currentPrescription && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <FiEye className="text-xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Prescription Details
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Viewing prescription information
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  
                  <button 
                    onClick={() => setShowViewModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <FiX className="text-xl text-gray-600" />
                  </button>
                </div>
              </div>

              {/* View Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Patient Information */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center gap-2 mb-4">
                        <FiUser className="text-green-600" />
                        <h4 className="font-semibold text-gray-900">Patient Information</h4>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <FiUser className="text-blue-600 text-sm" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Patient Name</p>
                            <p className="font-medium text-gray-900">
                              {currentPrescription.patientName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <FiMapPin className="text-green-600 text-sm" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Address</p>
                            <p className="font-medium text-gray-900">
                              {currentPrescription.patientAddress}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <FiUser className="text-purple-600 text-sm" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Gender</p>
                              <p className="font-medium text-gray-900">
                                {currentPrescription.patientGender}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <FiInfo className="text-orange-600 text-sm" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Age</p>
                              <p className="font-medium text-gray-900">
                                {currentPrescription.patientAge} years
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <FiCalendar className="text-blue-600 text-sm" />
                          </div>
                          <div>
                            <p className="text-xs text-blue-600">Appointment ID</p>
                            <p className="font-medium text-blue-700">
                              #{currentPrescription.appointmentId}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Prescription Details */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center gap-2 mb-6">
                        <FiFileText className="text-green-600" />
                        <h4 className="font-semibold text-gray-900">Prescription Details</h4>
                      </div>

                      <div className="space-y-6">
                        {/* Date Issued */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Date Issued
                          </label>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <FiCalendar className="text-gray-400" />
                            <p className="font-medium text-gray-900">
                              {new Date(currentPrescription.dateIssued).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Prescription Notes */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Prescription Notes & Instructions
                          </label>
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 min-h-[200px]">
                            <p className="text-gray-900 whitespace-pre-wrap">
                              {currentPrescription.notes || "No notes provided"}
                            </p>
                          </div>
                        </div>

                        {/* Signature Section */}
                        <div className="border-t pt-4 mt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-gray-700">Doctor's Signature</p>
                              <p className="text-sm text-gray-500">Dr. {profile.name}</p>
                            </div>
                           
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-4 pt-6 border-t border-gray-200">
                   
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionManager;