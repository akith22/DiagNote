import React, { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiRefreshCcw,
  FiUpload,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { labRequestsService } from "../../../services/LabRequestsService";
import type { LabRequest } from "../../../services/LabRequestsService";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const LabRequests: React.FC = () => {
  const [labRequests, setLabRequests] = useState<LabRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LabRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const navigate = useNavigate();

  const fetchLabRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await labRequestsService.getAllLabRequests();
      setLabRequests(response);
      setFilteredRequests(response);
    } catch (err: any) {
      setError("Failed to load lab requests.");
    } finally {
      setLoading(false);
    }
  };

  // Filter requests based on search term and status
  useEffect(() => {
    let filtered = labRequests;

    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.patientName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.doctorName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.testType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.id?.toString().includes(searchTerm)
      );
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, labRequests]);

  useEffect(() => {
    fetchLabRequests();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      REQUESTED: {
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        label: "Requested",
      },
      COMPLETED: {
        color: "bg-green-50 text-green-700 border-green-200",
        label: "Completed",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-gray-50 text-gray-700 border-gray-200",
      label: status,
    };

    return (
      <span
        className={`px-3 py-1.5 text-xs font-medium rounded-full border ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Lab Test Requests
          </h1>
          <p className="text-gray-600">
            Manage and track laboratory test requests
          </p>
        </div>
        <button
          onClick={fetchLabRequests}
          className="flex items-center px-4 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm self-start lg:self-auto"
        >
          <FiRefreshCcw className="mr-2 text-gray-500" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center animate-fade-in">
          <FiXCircle className="mr-3 text-red-500 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by patient, doctor, test type, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
            >
              <option value="ALL">All Status</option>
              <option value="REQUESTED">Requested</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold">{filteredRequests.length}</span> of{" "}
          <span className="font-semibold">{labRequests.length}</span> requests
        </p>
      </div>

      {/* Table */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-gray-400 mb-3">
            <FiSearch size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No lab requests found
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {labRequests.length === 0
              ? "There are no lab requests available at the moment."
              : "No requests match your current filters. Try adjusting your search criteria."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Request ID
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Test Type
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Appointment ID
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Doctor Name
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="py-4 px-4 whitespace-nowrap">#{req.id}</td>
                    <td className="py-4 px-4">{req.testType}</td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      #{req.appointmentId}
                    </td>
                    <td className="py-4 px-4">{req.patientName ?? "N/A"}</td>
                    <td className="py-4 px-4">{req.doctorName ?? "N/A"}</td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {req.status === "REQUESTED" ? (
                        <button
                          onClick={() =>
                            navigate(`/labtech/upload-report/${req.id}`, {
                              state: { labRequest: req },
                            })
                          }
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 shadow-sm"
                        >
                          <FiUpload className="mr-2" /> Upload Report
                        </button>
                      ) : (
                        <span className="flex items-center text-green-700 font-medium text-sm">
                          <FiCheckCircle className="mr-1.5" /> Report Uploaded
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabRequests;
