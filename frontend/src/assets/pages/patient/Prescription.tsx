import React, { useEffect, useState } from "react";
import type { Prescription } from "../../../types";
import { prescriptionService } from "../../../services/PrescriptionService";
import {
  FiDownload,
  FiFileText,
  FiCalendar,
  FiUser,
  FiClock,
} from "react-icons/fi";

const PrescriptionList: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setError(null);
        setLoading(true);
        const data = await prescriptionService.getPatientPrescriptions();
        setPrescriptions(data);
      } catch (err: any) {
        setError(err.message || "Failed to load prescriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const downloadPrescription = async (prescription: Prescription) => {
    try {
      setDownloading(prescription.id);

      // Create a formatted prescription document
      const prescriptionContent = `
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

      // Create and download the file
      const blob = new Blob([prescriptionContent], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `prescription-${prescription.id}-${prescription.appointment.date}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download prescription");
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-500 mb-2">
          <FiFileText className="h-8 w-8 mx-auto mb-2" />
        </div>
        <p className="text-red-700 font-medium">Error loading prescriptions</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <FiFileText className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          No Prescriptions Found
        </h3>
        <p className="text-gray-500">
          You don't have any prescriptions yet. Prescriptions will appear here
          after your appointments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FiFileText className="mr-3 text-blue-500" />
            My Prescriptions
          </h2>
          <p className="text-gray-600 mt-1">
            View and download your medical prescriptions
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {prescriptions.length} prescription
          {prescriptions.length !== 1 ? "s" : ""} found
        </div>
      </div>

      {prescriptions.map((prescription) => (
        <div
          key={prescription.id}
          className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <FiFileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Prescription #{prescription.id}
                  </h3>
                  <p className="text-sm text-gray-600">
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
                onClick={() => downloadPrescription(prescription)}
                disabled={downloading === prescription.id}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200"
              >
                {downloading === prescription.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <FiDownload className="mr-2" />
                    Download
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Doctor Information */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-3 mt-1">
                    <FiUser className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Doctor Information
                    </h4>
                    <p className="text-gray-700 font-medium">
                      Dr. {prescription.appointment.doctor.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {prescription.appointment.doctor.specialization}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3 mt-1">
                    <FiCalendar className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Appointment Details
                    </h4>
                    <p className="text-gray-700">
                      {prescription.appointment.date}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <FiClock className="mr-1" />
                      {prescription.appointment.time}
                    </p>
                  </div>
                </div>
              </div>

              {/* Prescription Notes */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-orange-100 p-2 rounded-lg mr-3 mt-1">
                    <FiFileText className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-2">
                      Prescription Notes
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {prescription.notes}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Appointment ID: #{prescription.appointment.id}</span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrescriptionList;
