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
  FiEye,
} from "react-icons/fi";

const PrescriptionList: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<
    Prescription[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    doctor: "",
    dateFrom: "",
    dateTo: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const data = await prescriptionService.getPatientPrescriptions();
        // Sort by latest date first
        const sortedData = data.sort(
          (a, b) =>
            new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime()
        );
        setPrescriptions(sortedData);
        setFilteredPrescriptions(sortedData);
      } catch (err: any) {
        setError(err.message || "Failed to load prescriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  // Apply filters whenever filters or prescriptions change
  useEffect(() => {
    let filtered = [...prescriptions];

    if (filters.doctor) {
      filtered = filtered.filter((prescription) =>
        prescription.appointment.doctor.name
          .toLowerCase()
          .includes(filters.doctor.toLowerCase())
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(
        (prescription) =>
          new Date(prescription.dateIssued) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      dateTo.setHours(23, 59, 59, 999); // Include entire end date
      filtered = filtered.filter(
        (prescription) => new Date(prescription.dateIssued) <= dateTo
      );
    }

    setFilteredPrescriptions(filtered);
  }, [filters, prescriptions]);

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

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      doctor: "",
      dateFrom: "",
      dateTo: "",
    });
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

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Doctor
            </label>
            <input
              type="text"
              value={filters.doctor}
              onChange={(e) => handleFilterChange("doctor", e.target.value)}
              placeholder="Search by doctor name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date From
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date To
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>

        {/* Results count */}
        <div className="mt-3 text-sm text-gray-500">
          Showing {filteredPrescriptions.length} of {prescriptions.length}{" "}
          prescriptions
        </div>
      </div>

      {/* Prescriptions List */}
      {filteredPrescriptions.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <FiFileText className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {prescriptions.length === 0
              ? "No Prescriptions Found"
              : "No Matching Prescriptions"}
          </h3>
          <p className="text-gray-500">
            {prescriptions.length === 0
              ? "You don't have any prescriptions yet. Prescriptions will appear here after your appointments."
              : "No prescriptions match your current filters. Try adjusting your search criteria."}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="col-span-3">Prescription Details</div>
            <div className="col-span-2">Doctor</div>
            <div className="col-span-2">Appointment Date</div>
            <div className="col-span-2">Issued Date</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredPrescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => goToPrescription(prescription)}
              >
                {/* Prescription Details */}
                <div className="col-span-3">
                  <div className="flex items-center">
                    <FiFileText className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Prescription #{prescription.id}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {prescription.notes}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Doctor */}
                <div className="col-span-2 flex items-center">
                  <FiUser className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-700">
                    Dr. {prescription.appointment.doctor.name}
                  </span>
                </div>

                {/* Appointment Date */}
                <div className="col-span-2 flex items-center">
                  <FiCalendar className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-700">
                    {prescription.appointment.date}
                  </span>
                </div>

                {/* Issued Date */}
                <div className="col-span-2 flex items-center">
                  <FiClock className="h-4 w-4 text-orange-600 mr-2" />
                  <span className="text-sm text-gray-700">
                    {new Date(prescription.dateIssued).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-3 flex items-center justify-end space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrescription(prescription);
                    }}
                    className="flex items-center px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200"
                  >
                    <FiEye className="mr-1" />
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadPrescription(prescription);
                    }}
                    disabled={downloading === prescription.id}
                    className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200"
                  >
                    {downloading === prescription.id ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                        Downloading
                      </>
                    ) : (
                      <>
                        <FiDownload className="mr-1" />
                        Download
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionList;
