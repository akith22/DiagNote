import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiUser,
  FiClock,
  FiDownload,
  FiAlertCircle,
  FiPlusSquare,
  FiActivity,
} from "react-icons/fi";
import type { Prescription } from "../../../types";
import { prescriptionService } from "../../../services/PrescriptionService";

const PrescriptionDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [prescription, setPrescription] = useState<Prescription | null>(
    location.state?.prescription || null
  );
  const [loading, setLoading] = useState(!prescription);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!prescription && id) {
      const fetchPrescription = async () => {
        try {
          setLoading(true);
          const data = await prescriptionService.getPatientPrescriptionById(
            Number(id)
          );
          setPrescription(data);
        } catch (err: any) {
          setError(err.message || "Failed to load prescription");
        } finally {
          setLoading(false);
        }
      };
      fetchPrescription();
    }
  }, [id, prescription]);

  const downloadPrescription = () => {
    if (!prescription) return;

    try {
      setDownloading(true);

      const content = `
PRESCRIPTION

Prescription ID: #${prescription.id}
Date Issued: ${new Date(prescription.dateIssued).toLocaleDateString()}

DOCTOR INFORMATION
Name: Dr. ${prescription.appointment.doctor.name}
Specialization: ${prescription.appointment.doctor.specialization}

APPOINTMENT DETAILS
Date: ${prescription.appointment.date}
Time: ${prescription.appointment.time}
Appointment ID: #${prescription.appointment.id}

PRESCRIPTION NOTES
${prescription.notes}

---
Generated on: ${new Date().toLocaleString()}
      `.trim();

      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `prescription-${prescription.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download prescription");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading prescription details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !prescription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Unable to Load Prescription
            </h3>
            <p className="text-gray-600 mb-6">
              {error || "Prescription not found"}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 px-4 py-3 bg-white text-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200 font-medium"
          >
            <FiArrowLeft className="text-lg" />
            Back to Prescriptions
          </button>

          <div className="text-right">
            <div className="text-sm text-gray-500 font-medium">
              Prescription ID
            </div>
            <div className="text-xl font-bold text-gray-800">
              #{prescription.id}
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FiActivity className="text-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Medical Prescription</h1>
                  <p className="text-blue-100 opacity-90">
                    Issued on{" "}
                    {new Date(prescription.dateIssued).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={downloadPrescription}
                disabled={downloading}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 disabled:opacity-50 border border-white/30 font-medium"
              >
                {downloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <FiDownload className="text-lg" />
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Doctor Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiUser className="text-blue-600 text-lg" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Doctor Information
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Doctor Name
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      Dr. {prescription.appointment.doctor.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Specialization
                    </p>
                    <p className="text-gray-700 font-medium">
                      {prescription.appointment.doctor.specialization}
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiCalendar className="text-green-600 text-lg" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Appointment Details
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Date</p>
                    <p className="text-gray-700 font-medium">
                      {prescription.appointment.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Time</p>
                      <p className="text-gray-700 font-medium flex items-center gap-2">
                        <FiClock className="text-green-600" />
                        {prescription.appointment.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Appointment ID
                      </p>
                      <p className="text-gray-700 font-medium">
                        #{prescription.appointment.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prescription Notes */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiPlusSquare className="text-purple-600 text-lg" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Prescription Notes & Instructions
                </h3>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg font-medium">
                    {prescription.notes}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Active
                </span>
              </div>
              <div className="flex items-center gap-6">
                <span>Appointment ID: #{prescription.appointment.id}</span>
                <span>Generated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            For any questions regarding this prescription, please contact your
            healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetail;
