import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { labReportsService } from "../../../services/LabReportsService";
import { FiUpload, FiArrowLeft, FiFileText, FiUser, FiCalendar, FiClipboard, FiCheckCircle } from "react-icons/fi";

const UploadLabReport: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const labRequest = state?.labRequest;

  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    setIsUploading(true);
    try {
      await labReportsService.uploadReport(file, 10, labRequest.id); // 🔹 10 = sample labTechId
      setMessage("Report uploaded successfully!");
      setFile(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setMessage("Failed to upload report. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!labRequest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFileText className="text-red-600 text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Lab Request Selected</h2>
          <p className="text-gray-600 mb-6">Please go back and select a lab request to upload a report.</p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 mx-auto"
          >
            <FiArrowLeft className="mr-2" /> Back to Requests
          </button>
        </div>
      </div>
    );
  }

  const isCompleted = labRequest.status === "COMPLETED";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200 group"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Lab Requests
          </button>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <FiUpload className="text-blue-600 text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Upload Lab Report</h1>
                <p className="text-gray-600 mt-1">Upload test results and laboratory findings</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Request Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiClipboard className="mr-2 text-blue-600" />
                Request Details
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">#</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Request ID</p>
                    <p className="font-semibold text-gray-900">{labRequest.id}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3 mt-1">
                    <FiFileText className="text-green-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Test Type</p>
                    <p className="font-semibold text-gray-900">{labRequest.testType}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-3 mt-1">
                    <FiCalendar className="text-purple-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Appointment ID</p>
                    <p className="font-semibold text-gray-900">#{labRequest.appointmentId}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center mr-3 mt-1">
                    <FiUser className="text-orange-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Patient Name</p>
                    <p className="font-semibold text-gray-900">{labRequest.patientName || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center mr-3 mt-1">
                    <FiUser className="text-red-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Doctor Name</p>
                    <p className="font-semibold text-gray-900">{labRequest.doctorName || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Ensure the report is in PDF format and contains all required test results before uploading.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              {isCompleted ? (
                <div className="text-center py-16">
                  <FiCheckCircle className="text-green-600 text-5xl mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Report Already Uploaded</h3>
                  <p className="text-gray-600 mb-6">
                    This lab request has already been completed. You cannot upload another report.
                  </p>
                  <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                  >
                    Back to Requests
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Upload Report File</h3>

                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-6 hover:border-blue-400 transition-all duration-300 bg-gray-50 hover:bg-blue-50">
                    <input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                    />
                    
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FiUpload className="text-blue-600 text-2xl" />
                    </div>
                    
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {file ? file.name : "Choose a file to upload"}
                    </p>
                    
                    <p className="text-gray-500 mb-4">
                      Supported formats: PDF, DOC, DOCX, TXT
                    </p>
                    
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 cursor-pointer shadow-sm"
                    >
                      <FiFileText className="mr-2" />
                      Browse Files
                    </label>
                  </div>

                  {/* File Info */}
                  {file && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 animate-fade-in">
                      <div className="flex items-center">
                        <FiFileText className="text-green-600 mr-3 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-green-900">File Selected</p>
                          <p className="text-sm text-green-700 mt-1">
                            {file.name} • {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button
                      onClick={() => navigate(-1)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    
                    <button
                      onClick={handleUpload}
                      disabled={!file || isUploading}
                      className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FiUpload className="mr-2" />
                          Upload Report
                        </>
                      )}
                    </button>
                  </div>

                  {/* Message */}
                  {message && (
                    <div className={`mt-6 p-4 rounded-xl border ${
                      message.includes("successfully") 
                        ? "bg-green-50 border-green-200 text-green-700" 
                        : "bg-red-50 border-red-200 text-red-700"
                    } animate-fade-in`}>
                      <div className="flex items-center">
                        {message.includes("successfully") ? (
                          <FiFileText className="mr-3 flex-shrink-0" />
                        ) : (
                          <FiUpload className="mr-3 flex-shrink-0" />
                        )}
                        <p className="font-medium">{message}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadLabReport;







