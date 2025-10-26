import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { labReportService } from "../../../services/LabReportService";
import type { LabReport } from "../../../services/LabReportService";
import { FiArrowLeft, FiDownload, FiFile, FiImage } from "react-icons/fi";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const LabReportPreview: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<LabReport | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setError(null);
        const reports = await labReportService.getReports();
        const found = reports.find((r) => r.id === Number(id));
        
        if (!found) {
          setError("Report not found");
          return;
        }

        setReport(found);
        const blob = await labReportService.downloadReportBlob(found.reportFile);
        const fileURL = URL.createObjectURL(blob);
        setPreviewURL(fileURL);
      } catch (err) {
        console.error("Error loading preview:", err);
        setError("Failed to load report preview");
      } finally {
        setLoading(false);
      }
    };

    loadReport();

    return () => {
      if (previewURL) URL.revokeObjectURL(previewURL);
    };
  }, [id, navigate]);

  const handleDownload = async () => {
    if (!report) return;
    
    try {
      const blob = await labReportService.downloadReportBlob(report.reportFile);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${report.reportName}.${report.fileFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Download failed:", err);
      setError("Download failed. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error || "Report not found"}</p>
          <button
            onClick={() => navigate("/lab-reports")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  const isPDF = report.fileFormat.toLowerCase() === "pdf";
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(report.fileFormat.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/lab-reports")}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{report.reportName}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center">
                    <FiFile className="w-4 h-4 mr-1" />
                    {report.fileFormat.toUpperCase()}
                  </span>
                  <span>Issued: {formatDate(report.dateIssued)}</span>
                  <span>Uploaded by: {report.uploadedBy}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
            >
              <FiDownload className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isPDF ? (
            <div className="flex flex-col h-[calc(100vh-200px)]">
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
                <span className="text-sm text-gray-600 flex items-center">
                  <FiFile className="w-4 h-4 mr-2" />
                  PDF Document
                </span>
              </div>
              <iframe
                src={previewURL || ""}
                className="flex-1 w-full border-0"
                title={`PDF Preview - ${report.reportName}`}
              />
            </div>
          ) : isImage ? (
            <div className="flex flex-col h-[calc(100vh-200px)]">
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
                <span className="text-sm text-gray-600 flex items-center">
                  <FiImage className="w-4 h-4 mr-2" />
                  Image Preview
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                <img
                  src={previewURL || ""}
                  alt={report.reportName}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FiFile className="w-16 h-16 mb-4" />
              <p className="text-lg">Preview not available for this file type</p>
              <p className="text-sm">Format: {report.fileFormat}</p>
            </div>
          )}
        </div>

        {/* Download Card for Mobile */}
        <div className="lg:hidden fixed bottom-6 left-6 right-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <FiDownload className="w-5 h-5 mr-2" />
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabReportPreview;