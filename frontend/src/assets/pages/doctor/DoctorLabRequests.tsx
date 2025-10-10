// DoctorLabRequests.tsx
import { useState, useEffect } from "react";
import { FiPlus, FiX, FiCheck, FiCalendar, FiUser, FiActivity, FiArrowUp, FiArrowDown } from "react-icons/fi";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { doctorLabRequestService, type DoctorLabRequestDto } from "../../../services/DoctorLabRequestService";

export interface LabRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: number;
  patientName: string;
  onLabRequestCreated?: () => void;
}

interface LabRequestsTableProps {
  refreshTrigger?: number;
}

export const LabRequestModal: React.FC<LabRequestModalProps> = ({ 
  isOpen, 
  onClose, 
  appointmentId, 
  patientName,
  onLabRequestCreated 
}) => {
  const [testType, setTestType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testType.trim()) {
      alert("Please enter a test type");
      return;
    }

    try {
      setLoading(true);
      const payload: DoctorLabRequestDto = {
        status: "REQUESTED",
        testType: testType.trim(),
        appointmentId: appointmentId,
        patientName: patientName,
      };

      await doctorLabRequestService.createLabRequest(appointmentId, payload);
      alert("Lab request submitted successfully!");
      setTestType("");
      onClose();
      onLabRequestCreated?.();
    } catch (err) {
      console.error("❌ Error creating lab request", err);
      alert("Failed to create lab request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FiPlus className="text-xl text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Request A Test</h3>
              <p className="text-gray-600 text-sm">Create a new lab test request</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Appointment ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Appointment ID
            </label>
            <input
              type="text"
              value={`#${appointmentId}`}
              disabled
              className="w-full border border-gray-300 rounded-xl p-3 bg-gray-100 text-gray-600"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <input
              type="text"
              value="REQUESTED"
              disabled
              className="w-full border border-gray-300 rounded-xl p-3 bg-gray-100 text-gray-600"
            />
          </div>

          {/* Patient Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Patient Name
            </label>
            <input
              type="text"
              value={patientName}
              disabled
              className="w-full border border-gray-300 rounded-xl p-3 bg-gray-100 text-gray-600"
            />
          </div>

          {/* Test Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Test Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              placeholder="Enter test type (e.g., Blood Test, MRI, X-Ray)"
              required
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            <div className="mt-1 text-xs text-gray-500">
              Examples: Complete Blood Count, Lipid Profile, Liver Function Test, etc.
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium transition-all duration-200"
            >
              <FiX /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !testType.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner /> : <FiCheck className="text-lg" />}
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const LabRequestsTable: React.FC<LabRequestsTableProps> = ({ refreshTrigger }) => {
  const [labRequests, setLabRequests] = useState<DoctorLabRequestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof DoctorLabRequestDto>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchLabRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const requests = await doctorLabRequestService.getAllLabRequestsByDoctor();
      setLabRequests(requests);
    } catch (err) {
      console.error("❌ Error fetching lab requests", err);
      setError("Failed to load lab requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabRequests();
  }, [refreshTrigger]);

  const handleSort = (field: keyof DoctorLabRequestDto) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedLabRequests = [...labRequests].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === undefined || bValue === undefined) return 0;
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
    if (status === "COMPLETED") {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    return `${baseClasses} bg-yellow-100 text-yellow-800`;
  };

  const SortIcon: React.FC<{ field: keyof DoctorLabRequestDto }> = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <FiArrowUp className="inline ml-1" /> : <FiArrowDown className="inline ml-1" />;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600">Loading lab requests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="text-red-500 text-lg mb-2">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchLabRequests}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-lg">
            <FiActivity className="text-xl text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Lab Requests</h3>
            <p className="text-gray-600 text-sm">
              {labRequests.length} request{labRequests.length !== 1 ? 's' : ''} total
            </p>
          </div>
        </div>
        <button
          onClick={fetchLabRequests}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
        >
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center gap-1">
                  ID
                  <SortIcon field="id" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleSort('patientName')}
              >
                <div className="flex items-center gap-1">
                  Patient
                  <SortIcon field="patientName" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleSort('testType')}
              >
                <div className="flex items-center gap-1">
                  Test Type
                  <SortIcon field="testType" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  <SortIcon field="status" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleSort('appointmentId')}
              >
                <div className="flex items-center gap-1">
                  Appointment
                  <SortIcon field="appointmentId" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedLabRequests.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <FiActivity className="text-3xl mb-2 opacity-50" />
                    <p className="text-lg font-medium">No lab requests found</p>
                    <p className="text-sm">Lab requests you create will appear here</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedLabRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{request.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiUser className="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.patientName || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium">
                      {request.testType}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(request.status)}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <FiCalendar className="text-green-600 text-sm" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        #{request.appointmentId}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabRequestModal;