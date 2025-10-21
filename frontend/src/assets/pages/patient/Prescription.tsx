import React, { useEffect, useState } from "react";
import type { Prescription } from "../../../types";
import { prescriptionService } from "../../../services/PrescriptionService";
import { useNavigate } from "react-router-dom";
import {
  FiFileText,
  FiCalendar,
  FiUser,
  FiClock,
  FiDownload,
} from "react-icons/fi";

const PrescriptionList: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
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

  const goToPrescription = (prescription: Prescription) => {
    navigate(`/patient/prescriptions/${prescription.id}`, {
      state: { prescription },
    });
  };

  const downloadPrescription = async (prescription: Prescription) => {
    try {
      setDownloading(prescription.id);

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prescriptions.map((prescription) => (
        <div
          key={prescription.id}
          className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden"
        >
          {/* Header */}
          <div
            className="px-6 py-4 cursor-pointer"
            onClick={() => goToPrescription(prescription)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiFileText className="mr-2 text-blue-500" />
                Prescription #{prescription.id}
              </h3>
              <p className="text-sm text-gray-500">
                {new Date(prescription.dateIssued).toLocaleDateString()}
              </p>
            </div>
            <p className="text-gray-600 text-sm line-clamp-3">
              {prescription.notes}
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex items-center space-x-4 text-gray-700 text-sm">
              <div className="flex items-center">
                <FiUser className="mr-1 text-green-600" />
                Dr. {prescription.appointment.doctor.name}
              </div>
              <div className="flex items-center">
                <FiCalendar className="mr-1 text-purple-600" />
                {prescription.appointment.date}
              </div>
              <div className="flex items-center">
                <FiClock className="mr-1 text-orange-600" />
                {prescription.appointment.time}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadPrescription(prescription);
              }}
              disabled={downloading === prescription.id}
              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200"
            >
              {downloading === prescription.id ? "Downloading..." : <FiDownload />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrescriptionList;
