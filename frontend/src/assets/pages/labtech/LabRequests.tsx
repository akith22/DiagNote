import React, { useEffect, useState } from "react";
import { FiCheckCircle, FiXCircle, FiRefreshCcw } from "react-icons/fi";
import { labRequestsService } from "../../../services/LabRequestsService";
import type { LabRequest } from "../../../services/LabRequestsService";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const LabRequests: React.FC = () => {
  const [labRequests, setLabRequests] = useState<LabRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all lab requests
  const fetchLabRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await labRequestsService.getAllLabRequests();
      setLabRequests(response);
    } catch (err: any) {
      setError("Failed to load lab requests.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update status using backend format: PUT /api/lab-requests/{id}/status/{status}
  const handleStatusUpdate = async (id: number, status: "REQUESTED" | "COMPLETED") => {
    try {
      setError("");
      setSuccess("");
      await labRequestsService.updateLabRequestStatus(id, status); // correct call
      setSuccess(`Lab request #${id} marked as ${status}`);
      await fetchLabRequests(); // refresh table after update
    } catch (err: any) {
      setError("Failed to update status.");
    }
  };

  useEffect(() => {
    fetchLabRequests();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Lab Test Requests</h2>
        <button
          onClick={fetchLabRequests}
          className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
        >
          <FiRefreshCcw className="mr-2" /> Refresh
        </button>
      </div>

      {/* Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-400 text-green-700 rounded-lg flex items-center">
          <FiCheckCircle className="mr-2" /> {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-400 text-red-700 rounded-lg flex items-center">
          <FiXCircle className="mr-2" /> {error}
        </div>
      )}

      {/* Table */}
      {labRequests.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No lab requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-blue-50">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">ID</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">Test Type</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">Appointment ID</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {labRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-all border-b">
                  <td className="py-3 px-4">{req.id}</td>
                  <td className="py-3 px-4">{req.testType}</td>
                  <td className="py-3 px-4">{req.appointmentId}</td>
                  <td className="py-3 px-4">
                    <select
                      value={req.status}
                      onChange={(e) =>
                        handleStatusUpdate(req.id, e.target.value as "REQUESTED" | "COMPLETED")
                      }
                      className={`border rounded px-2 py-1 text-sm cursor-pointer ${
                        req.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      <option value="REQUESTED">REQUESTED</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LabRequests;
