import {
  FiCalendar,
  FiCheck,
  FiEdit3,
  FiFileText,
  FiInfo,
  FiMapPin,
  FiUser,
  FiX,
  FiPlus,
} from "react-icons/fi";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import {
  prescriptionService,
  type PrescriptionDto,
} from "../../../services/PrescriptionService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { DoctorProfile } from "../../../types";
import { doctorService } from "../../../services/DoctorService";
import { LabRequestModal } from "./DoctorLabRequests";

interface EditCreateProps {
  show: boolean;
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

const Prescription: React.FC<EditCreateProps> = ({ show }) => {
  const { id } = useParams();
  const appointmentId = Number(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<DoctorProfile>();
  const [formData, setFormData] = useState<PrescriptionDto>({
    id: undefined,
    appointmentId: undefined,
    notes: "",
    dateIssued: new Date().toISOString().slice(0, 10),
    patientName: "",
  });

  const [currentPrescription, setCurrentPrescription] =
    useState<PrescriptionDetails | null>(null);

  const [patientInfo, setPatientInfo] = useState<{
    name?: string;
    address?: string;
    gender?: string;
    age?: number;
  }>({});

  const [isLabRequestModalOpen, setIsLabRequestModalOpen] = useState(false);

  // ✅ Fetch Doctor Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await doctorService.getProfile();
        setProfile(profileData);
      } catch (err: any) {
        console.error("⚠️ Could not fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Fetch data based on mode (create or edit)
  useEffect(() => {
    const loadPatientInfo = async () => {
      try {
        setLoading(true);
        const details = await prescriptionService.getPatientDetailsByAppointment(
          appointmentId
        );

        setPatientInfo({
          name: details.name,
          address: details.address,
          gender: details.gender,
          age: details.age,
        });

        setFormData({
          id: undefined,
          appointmentId: appointmentId,
          notes: "",
          dateIssued: new Date().toISOString().slice(0, 10),
          patientName: details.name,
        });
      } catch (err) {
        console.error("⚠️ Could not fetch patient info", err);
      } finally {
        setLoading(false);
      }
    };

    const editPrescription = async () => {
      try {
        setLoading(true);
        const details = await prescriptionService.getPrescriptionDetails(
          appointmentId
        );

        setCurrentPrescription(details);

        setFormData({
          id: details.prescriptionId,
          appointmentId: details.appointmentId,
          notes: details.notes || "",
          dateIssued:
            details.dateIssued?.slice(0, 10) ||
            new Date().toISOString().slice(0, 10),
          patientName: details.patientName || "",
        });

        setPatientInfo({
          name: details.patientName,
          address: details.patientAddress,
          gender: details.patientGender,
          age: details.patientAge,
        });
      } catch (err) {
        console.error("❌ Error fetching prescription details", err);
        alert("Failed to load prescription details.");
      } finally {
        setLoading(false);
      }
    };

    if (show) {
      loadPatientInfo();
    } else {
      editPrescription();
    }
  }, [appointmentId, show]);

  // ✅ Handle form submit
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

      navigate("/doctor/dashboard");
      alert("Prescription saved successfully!");
    } catch (err) {
      console.error("❌ Error saving prescription", err);
      alert("Failed to save prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestTest = () => {
    setIsLabRequestModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
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
              {formData.id
                ? "Update existing prescription details"
                : "Fill in the prescription details below"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="flex-1 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Info */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <FiUser className="text-blue-600" />
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
                        {patientInfo.name ||
                          formData.patientName ||
                          currentPrescription?.patientName ||
                          "Not specified"}
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
                        {patientInfo.address ||
                          currentPrescription?.patientAddress ||
                          "Not specified"}
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
                          {patientInfo.gender ||
                            currentPrescription?.patientGender ||
                            "Not specified"}
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
                          {patientInfo.age
                            ? `${patientInfo.age} years`
                            : currentPrescription?.patientAge
                            ? `${currentPrescription.patientAge} years`
                            : "Not specified"}
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
                          #{formData.appointmentId ||
                            currentPrescription?.appointmentId}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Request A Test Button - Only show in create mode */}
                  {!formData.id && (
                    <button
                      type="button"
                      onClick={handleRequestTest}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 mt-4"
                    >
                      <FiPlus className="text-lg" />
                      Request A Test
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Prescription Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 border border-gray-200 h-full">
                <div className="flex items-center gap-2 mb-6">
                  <FiEdit3 className="text-blue-600" />
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
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.dateIssued}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateIssued: e.target.value,
                          })
                        }
                        required
                        className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                      />
                      <FiCalendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  {/* Notes */}
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
                      Include: Medications, Dosage, Frequency, Duration, Special
                      Instructions, Follow-up
                    </div>
                  </div>

                  {/* Doctor Signature */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Doctor's Signature
                        </p>
                        <p className="text-sm text-gray-500">
                          Dr. {profile?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-500">
          {formData.id
            ? "Editing existing prescription"
            : "Creating new prescription"}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/doctor/dashboard")}
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
            {loading ? <LoadingSpinner /> : <FiCheck className="text-lg" />}
            {formData.id ? "Update Prescription" : "Create Prescription"}
          </button>
        </div>
      </div>

      {/* Lab Request Modal - Only show in create mode */}
      {!formData.id && (
        <LabRequestModal
          isOpen={isLabRequestModalOpen}
          onClose={() => setIsLabRequestModalOpen(false)}
          appointmentId={appointmentId}
          patientName={patientInfo.name || formData.patientName || currentPrescription?.patientName || "Not specified"}
        />
      )}
    </div>
  );
};

export default Prescription;