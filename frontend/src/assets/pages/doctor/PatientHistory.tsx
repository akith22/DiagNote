import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorPatientHistoryService } from '../../../services/DoctorPatientHistoryService';
import type { DoctorPatientHistoryDto } from '../../../services/DoctorPatientHistoryService';
import { 
  FiArrowLeft, 
  FiDownload, 
  FiUser, 
  FiCalendar, 
  FiFileText, 
  FiMapPin, 
  FiInfo, 
  FiHeart,
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi';

const PatientHistory: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const [patientHistory, setPatientHistory] = useState<DoctorPatientHistoryDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);

  useEffect(() => {
    const fetchPatientHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        if (email) {
          const history = await doctorPatientHistoryService.getPatientHistoryByPatientEmail(email);
          setPatientHistory(history);
        } else {
          setError('Patient email not provided');
        }
      } catch (err) {
        console.error('Error fetching patient history:', err);
        setError('Failed to load patient history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientHistory();
  }, [email]);

  const handleDownloadReport = async (labReportId: number, reportFile: string, labRequestId: number) => {
    try {
      setDownloading(labRequestId);
      
      const blob = await doctorPatientHistoryService.downloadLabReport(reportFile);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fileExtension = reportFile.split('.').pop() || 'pdf';
      link.download = `lab-report-${labReportId}.${fileExtension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setDownloading(null);

    } catch (err) {
      console.error('Error downloading report:', err);
      alert('Failed to download report. Please try again.');
      setDownloading(null);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <FiCheckCircle className="text-green-500" />;
      case 'CANCELLED':
        return <FiAlertCircle className="text-red-500" />;
      default:
        return <FiClock className="text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <FiActivity className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 text-xl" />
          </div>
          <p className="mt-4 text-gray-600 text-lg font-medium">Loading patient history...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch the records</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="text-red-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load History</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mx-auto"
          >
            <FiArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!patientHistory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-gray-400 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Patient Found</h2>
          <p className="text-gray-600 mb-6">No patient history found for the provided email address.</p>
          <button
            onClick={handleBack}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mx-auto"
          >
            <FiArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 lg:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-all duration-200 hover:gap-3 group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="font-medium">Back to Prescription</span>
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Patient Medical History
              </h1>
              <p className="text-gray-600 text-lg">
                Comprehensive overview of {patientHistory.patientName}'s medical records
              </p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Live Record</span>
            </div>
          </div>
        </div>

        {/* Patient Basic Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-800">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FiUser className="text-blue-600 text-xl" />
            </div>
            Patient Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <FiUser className="text-blue-600 text-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Full Name</label>
                  <p className="text-lg font-semibold text-gray-900">{patientHistory.patientName}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <FiUser className="text-green-600 text-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Email</label>
                  <p className="text-lg font-semibold text-gray-900 break-all">{patientHistory.patientEmail}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <FiHeart className="text-purple-600 text-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Gender</label>
                  <p className="text-lg font-semibold text-gray-900">{patientHistory.gender}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <FiInfo className="text-orange-600 text-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Age</label>
                  <p className="text-lg font-semibold text-gray-900">{patientHistory.age} years</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <FiMapPin className="text-gray-600 text-lg" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-500 block mb-1">Address</label>
                <p className="text-lg font-semibold text-gray-900">{patientHistory.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiFileText className="text-blue-600 text-xl" />
              </div>
              Medical History
            </h2>
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
              {patientHistory.history.length} appointment{patientHistory.history.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          {patientHistory.history.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiFileText className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Medical History</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No medical appointments or records found for this patient. 
                All future appointments and prescriptions will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {patientHistory.history.map((appointment, index) => (
                <div 
                  key={`${appointment.appointmentId}-${index}`} 
                  className="border border-gray-200 rounded-xl p-6 lg:p-8 hover:shadow-lg transition-all duration-300 bg-white group"
                >
                  {/* Appointment Header */}
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <FiCalendar className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            Consultation with Dr. {appointment.doctorName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 mt-2">
                            <p className="text-gray-600 flex items-center gap-2">
                              <FiCalendar className="text-gray-400" />
                              {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                weekday: 'long'
                              })}
                            </p>
                            <span className="text-gray-400">•</span>
                            <p className="text-gray-500 text-sm">
                              ID: #{appointment.appointmentId}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(appointment.status)}
                      <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0) + appointment.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>

                  {/* Prescription */}
                  {appointment.prescriptionNotes && (
                    <div className="mb-6 p-5 bg-blue-50 rounded-xl border border-blue-200 group-hover:border-blue-300 transition-colors">
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <FiFileText className="text-blue-600" />
                        Medical Prescription
                      </h4>
                      <div className="bg-white p-4 rounded-lg border border-blue-100">
                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                          {appointment.prescriptionNotes}
                        </p>
                      </div>
                      {appointment.dateIssued && (
                        <p className="text-sm text-gray-500 mt-3 ml-2 flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          Prescribed on {new Date(appointment.dateIssued).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Lab Reports */}
                  {appointment.labReports && appointment.labReports.length > 0 && (
                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 group-hover:border-gray-300 transition-colors">
                      <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <FiFileText className="text-gray-600" />
                        Laboratory Reports ({appointment.labReports.length})
                      </h4>
                      <div className="space-y-3">
                        {appointment.labReports.map((labReport) => (
                          <div 
                            key={labReport.labRequestId} 
                            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <p className="font-semibold text-gray-900 text-lg">{labReport.testType}</p>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  labReport.requestStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                                  labReport.requestStatus === 'REQUESTED' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {labReport.requestStatus}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                {labReport.labTechName && (
                                  <span className="flex items-center gap-1">
                                    <FiUser className="text-gray-400" />
                                    {labReport.labTechName}
                                  </span>
                                )}
                                {labReport.reportDateIssued && (
                                  <span className="flex items-center gap-1">
                                    <FiCalendar className="text-gray-400" />
                                    {new Date(labReport.reportDateIssued).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            {labReport.completed && labReport.reportFile && labReport.labReportId && (
                              <button 
                                onClick={() => handleDownloadReport(labReport.labReportId!, labReport.reportFile!, labReport.labRequestId)}
                                disabled={downloading === labReport.labRequestId}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
                              >
                                {downloading === labReport.labRequestId ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Downloading...
                                  </>
                                ) : (
                                  <>
                                    <FiDownload className="text-sm" /> Download
                                  </>
                                )}
                              </button>
                            )}
                            {labReport.completed && (!labReport.reportFile || !labReport.labReportId) && (
                              <span className="text-sm text-gray-500 px-3 py-2 bg-gray-100 rounded-lg">
                                Report unavailable
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;