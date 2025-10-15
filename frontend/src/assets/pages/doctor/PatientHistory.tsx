import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiUser, 
  FiMail, 
  FiMapPin, 
  FiCalendar, 
  FiFileText, 
  FiClock,
  FiActivity
} from 'react-icons/fi';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { doctorPatientHistoryService } from '../../../services/DoctorPatientHistoryService';
import type {  DoctorPatientHistoryDto } from '../../../services/DoctorPatientHistoryService';

const PatientHistory: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const [patientHistory, setPatientHistory] = useState<DoctorPatientHistoryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPatientHistory = async () => {
      if (!appointmentId) {
        setError('No appointment ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const history = await doctorPatientHistoryService.getPatientHistoryByAppointmentId(parseInt(appointmentId));
        setPatientHistory(history);
      } catch (err: any) {
        console.error('Error fetching patient history:', err);
        setError(
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load patient history'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatientHistory();
  }, [appointmentId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Appointments
          </button>
          
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Patient History</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!patientHistory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Appointments
          </button>
          
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="text-gray-500 text-6xl mb-4">❓</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Patient Data Found</h2>
            <p className="text-gray-600">Unable to load patient history for this appointment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Appointments
          </button>
          <div className="text-sm text-gray-500">
            Appointment ID: {appointmentId}
          </div>
        </div>

        {/* Patient Information Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiUser className="mr-3 text-blue-600" />
            Patient Medical History
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center p-4 bg-blue-50 rounded-xl">
              <FiUser className="text-blue-600 mr-3 text-xl" />
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold text-gray-800">{patientHistory.name}</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-green-50 rounded-xl">
              <FiMail className="text-green-600 mr-3 text-xl" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-800">{patientHistory.email}</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-purple-50 rounded-xl">
              <FiActivity className="text-purple-600 mr-3 text-xl" />
              <div>
                <p className="text-sm text-gray-600">Gender & Age</p>
                <p className="font-semibold text-gray-800">
                  {patientHistory.gender}, {patientHistory.age} years
                </p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-orange-50 rounded-xl">
              <FiMapPin className="text-orange-600 mr-3 text-xl" />
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-semibold text-gray-800">{patientHistory.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointments Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <FiCalendar className="mr-2 text-blue-600" />
                Previous Appointments
              </h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {patientHistory.appointments.length}
              </span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {patientHistory.appointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FiCalendar className="mx-auto text-3xl mb-2 text-gray-300" />
                  <p>No previous appointments found</p>
                </div>
              ) : (
                patientHistory.appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">
                        Dr. {appointment.doctorName}
                      </h3>
                      <span
                        className={`text-xs font-medium py-1 px-2 rounded-full ${
                          appointment.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : appointment.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <FiClock className="mr-2" />
                      {formatDate(appointment.date)}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Appointment ID: {appointment.id}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Prescriptions Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <FiFileText className="mr-2 text-green-600" />
                Previous Prescriptions
              </h2>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                {patientHistory.prescriptions.length}
              </span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {patientHistory.prescriptions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FiFileText className="mx-auto text-3xl mb-2 text-gray-300" />
                  <p>No previous prescriptions found</p>
                </div>
              ) : (
                patientHistory.prescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="p-4 border border-gray-200 rounded-xl hover:border-green-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-800">
                        Dr. {prescription.doctorName}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <FiClock className="mr-1" />
                        {formatDate(prescription.dateIssued)}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {prescription.notes}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Prescription ID: {prescription.id}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;