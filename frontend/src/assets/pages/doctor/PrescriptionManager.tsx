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
  FiSearch,
  FiActivity, // New icon for lab tests
} from "react-icons/fi";
import {
  prescriptionService,
  type PrescriptionDto,
} from "../../../services/PrescriptionService";
import { doctorLabRequestService, type DoctorLabRequestDto } from "../../../services/DoctorLabRequestService"; // Import lab service
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const [prescriptions, setPrescriptions] = useState<PrescriptionDto[]>([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<PrescriptionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPrescription, setCurrentPrescription] = useState<PrescriptionDetails | null>(null);
  const [labRequests, setLabRequests] = useState<DoctorLabRequestDto[]>([]); // State for lab requests
  const [loadingLabRequests, setLoadingLabRequests] = useState(false); // Loading state for lab requests

  // Load all prescriptions for the doctor
  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await prescriptionService.getAllPrescriptionsByDoctor();
      setPrescriptions(data || []);
      setFilteredPrescriptions(data || []);
    } catch (err) {
      console.error("❌ Error loading prescriptions", err);
      alert("Failed to load prescriptions.");
    } finally {
      setLoading(false);
    }
  };

  // Load lab requests for a specific appointment
  const loadLabRequests = async (appointmentId: number) => {
    try {
      setLoadingLabRequests(true);
      const data = await doctorLabRequestService.getLabRequestsByAppointment(appointmentId);
      setLabRequests(data || []);
    } catch (err) {
      console.error("❌ Error loading lab requests", err);
      setLabRequests([]); // Set empty array on error
    } finally {
      setLoadingLabRequests(false);
    }
  };

  useEffect(() => {
    if (profile.email) loadPrescriptions();
  }, [profile.email]);

  // Filter prescriptions based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPrescriptions(prescriptions);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const filtered = prescriptions.filter(prescription => 
      prescription.patientName?.toLowerCase().includes(term) ||
      prescription.notes?.toLowerCase().includes(term) ||
      prescription.appointmentId?.toString().includes(term) ||
      prescription.dateIssued?.toLowerCase().includes(term)
    );
    
    setFilteredPrescriptions(filtered);
  }, [searchTerm, prescriptions]);

  const handleEdit = async (p: PrescriptionDto) => {
    navigate(`/doctor/edit-prescription/${p.id}`);
  };

  const handleView = async (p: PrescriptionDto) => {
    if (!p?.id) {
      alert("Prescription id is missing.");
      return;
    }

    setShowViewModal(true);
    setCurrentPrescription(null);
    setLabRequests([]); // Reset lab requests
    setLoading(true);

    try {
      const details = await prescriptionService.getPrescriptionDetails(p.id);
      setCurrentPrescription((details as PrescriptionDetails) || null);
      
      // Load lab requests for this appointment
      if (details?.appointmentId) {
        await loadLabRequests(details.appointmentId);
      }
    } catch (err) {
      console.error("❌ Error fetching prescription details", err);
      alert("Failed to load prescription details.");
      setCurrentPrescription(null);
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
      console.error("❌ Error deleting prescription", err);
      alert("Failed to delete prescription.");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Helper function to get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
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
              <h2 className="text-2xl font-bold text-gray-900">
                Prescription Management
              </h2>
              <p className="text-gray-600">
                Manage and create patient prescriptions
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by patient name, notes, appointment ID, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-colors duration-200"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <FiX className="text-lg" />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-600 mt-2">
              Showing {filteredPrescriptions.length} of {prescriptions.length} prescriptions
              {filteredPrescriptions.length === 0 && " - No matches found"}
            </p>
          )}
        </div>

        {/* Prescriptions Table */}
        {loading && !showViewModal ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <FiFileText className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {searchTerm ? "No Matching Prescriptions Found" : "No Prescriptions Found"}
            </h3>
            <p className="text-gray-500 text-sm">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Get started by creating your first prescription"
              }
            </p>
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
                      Patient Name
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
                  {filteredPrescriptions.map((p, i) => (
                    <tr
                      key={p.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {i + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          #{p.appointmentId}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {p.patientName || (
                          <span className="text-gray-400 italic">Unknown</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {p.notes || (
                          <span className="text-gray-400 italic">No notes</span>
                        )}
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

        {/* VIEW PRESCRIPTION MODAL */}
        {showViewModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
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
                    onClick={() => {
                      setShowViewModal(false);
                      setCurrentPrescription(null);
                      setLabRequests([]);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <FiX className="text-xl text-gray-600" />
                  </button>
                </div>
              </div>

              {/* View Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex items-center justify-center h-60">
                    <LoadingSpinner />
                  </div>
                ) : currentPrescription ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Patient Information */}
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                          <FiUser className="text-green-600" />
                          <h4 className="font-semibold text-gray-900">
                            Patient Information
                          </h4>
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

                      {/* Prescription Details & Lab Tests */}
                      <div className="lg:col-span-2 space-y-6">
                        {/* Prescription Details */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                          <div className="flex items-center gap-2 mb-6">
                            <FiFileText className="text-green-600" />
                            <h4 className="font-semibold text-gray-900">
                              Prescription Details
                            </h4>
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
                                  {currentPrescription.dateIssued
                                    ? new Date(currentPrescription.dateIssued).toLocaleDateString(
                                        "en-US",
                                        {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        }
                                      )
                                    : "-"}
                                </p>
                              </div>
                            </div>

                            {/* Prescription Notes */}
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Prescription Notes & Instructions
                              </label>
                              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 min-h-[120px]">
                                <p className="text-gray-900 whitespace-pre-wrap">
                                  {currentPrescription.notes || "No notes provided"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Lab Tests Section */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                          <div className="flex items-center gap-2 mb-6">
                            <FiActivity className="text-blue-600" />
                            <h4 className="font-semibold text-gray-900">
                              Requested Lab Tests
                            </h4>
                          </div>

                          {loadingLabRequests ? (
                            <div className="flex justify-center items-center py-12">
                              <LoadingSpinner />
                            </div>
                          ) : labRequests.length > 0 ? (
                            <div className="space-y-4">
                              {labRequests.map((labRequest) => (
                                <div
                                  key={labRequest.id}
                                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-150"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                      <FiActivity className="text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        {labRequest.testType}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        Test ID: {labRequest.id}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                                        labRequest.status
                                      )}`}
                                    >
                                      {labRequest.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                              <FiActivity className="text-3xl text-gray-400 mx-auto mb-3" />
                              <p className="text-gray-600 font-medium">No Lab Tests Requested</p>
                              <p className="text-gray-500 text-sm mt-1">
                                No laboratory tests have been requested for this appointment.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Signature Section */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            Doctor's Signature
                          </p>
                          <p className="text-sm text-gray-500">Dr. {profile.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-700">
                            Date Issued
                          </p>
                          <p className="text-sm text-gray-500">
                            {currentPrescription.dateIssued
                              ? new Date(currentPrescription.dateIssued).toLocaleDateString()
                              : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // If not loading & no details loaded -> show message
                  <div className="flex items-center justify-center h-48">
                    <p className="text-gray-600">No prescription details available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionManager;