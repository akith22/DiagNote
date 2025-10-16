import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { labReportsService } from "../../../services/LabReportsService";
import type { LabReport } from "../../../services/LabReportsService";
import type { LabRequest } from "../../../services/LabRequestsService";
import {
  FiArrowLeft,
  FiDownload,
  FiPrinter,
  FiZoomIn,
  FiZoomOut,
  FiRotateCw,
  FiX,
  FiMaximize,
  FiMinimize
} from "react-icons/fi";

const ViewLabReport: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const [report, setReport] = useState<LabReport | null>(null);
  const [labRequest, setLabRequest] = useState<LabRequest | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoading(true);
        
        if (state?.report && state?.labRequest) {
          setReport(state.report);
          setLabRequest(state.labRequest);
          await loadFileForViewing(state.report.reportFile);
        } else if (reportId) {
          setError("Report data not available. Please go back and try again.");
        }
      } catch (err) {
        setError("Failed to load report data.");
        console.error("Error loading report:", err);
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, [reportId, state]);

  const loadFileForViewing = async (fileName: string) => {
    try {
      const blob = await labReportsService.downloadFile(fileName);
      const url = URL.createObjectURL(blob);
      setFileUrl(url);
    } catch (err) {
      console.error("Error loading file content:", err);
      setError("Failed to load the report file.");
    }
  };

  const handleDownload = async () => {
    if (!report) return;

    try {
      const blob = await labReportsService.downloadFile(report.reportFile);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = report.reportFile;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download file.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
  const rotate = () => setRotation((prev) => (prev + 90) % 360);
  const resetZoom = () => {
    setScale(1);
    setRotation(0);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getFileType = (fileName: string) => {
    const ext = fileName.toLowerCase().split(".").pop();
    const fileTypes: { [key: string]: string } = {
      pdf: "PDF Document",
      doc: "Word Document",
      docx: "Word Document",
      txt: "Text File",
      jpg: "JPEG Image",
      jpeg: "JPEG Image",
      png: "PNG Image",
      gif: "GIF Image",
    };
    return fileTypes[ext || ""] || "File";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !report || !labRequest) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiX className="text-white text-xl" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">
            {error || "Report Not Found"}
          </h2>
          <p className="text-gray-300 mb-6">
            {error || "The requested report could not be found."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 mx-auto"
          >
            <FiArrowLeft className="mr-2" /> Back to Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-gray-900`}>
      {/* Header - Hidden in fullscreen */}
      {!isFullscreen && (
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
            >
              <FiArrowLeft className="mr-2" />
              Back
            </button>
            <div className="text-sm text-gray-300 truncate max-w-xs sm:max-w-md">
              {report.reportFile}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Zoom Controls */}
            <div className="flex items-center bg-gray-700 rounded-lg">
              <button
                onClick={zoomOut}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-l-lg transition-colors duration-200"
                disabled={scale <= 0.5}
              >
                <FiZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={resetZoom}
                className="px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-gray-600 transition-colors duration-200"
              >
                {Math.round(scale * 100)}%
              </button>
              <button
                onClick={zoomIn}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-r-lg transition-colors duration-200"
                disabled={scale >= 3}
              >
                <FiZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Rotate */}
            <button
              onClick={rotate}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              <FiRotateCw className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              <FiMaximize className="w-4 h-4" />
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              <FiPrinter className="w-4 h-4" />
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              <FiDownload className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Full Page Viewer - Takes entire space */}
      <div className="flex-1 bg-black overflow-hidden relative">
        {fileUrl ? (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            {getFileType(report.reportFile) === "PDF Document" ? (
              <iframe
                src={fileUrl}
                className="w-full h-full border-0"
                title="PDF Document"
                style={{
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                  transformOrigin: "center center",
                }}
              />
            ) : getFileType(report.reportFile).includes("Image") ? (
              <img
                src={fileUrl}
                alt={report.reportFile}
                className="max-w-full max-h-full object-contain"
                style={{
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                  transformOrigin: "center center",
                }}
              />
            ) : (
              <div className="text-center text-white">
                <p>This file type cannot be previewed.</p>
                <button
                  onClick={handleDownload}
                  className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 mx-auto"
                >
                  <FiDownload className="mr-2" /> Download File
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-400">Unable to load document.</p>
          </div>
        )}

        {/* Floating Controls in Fullscreen */}
        {isFullscreen && (
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-gray-800 bg-opacity-80 rounded-lg p-2 border border-gray-700">
            {/* Zoom Controls */}
            <div className="flex items-center bg-gray-700 rounded-lg">
              <button
                onClick={zoomOut}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-l-lg transition-colors duration-200"
                disabled={scale <= 0.5}
              >
                <FiZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={resetZoom}
                className="px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-gray-600 transition-colors duration-200"
              >
                {Math.round(scale * 100)}%
              </button>
              <button
                onClick={zoomIn}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-r-lg transition-colors duration-200"
                disabled={scale >= 3}
              >
                <FiZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Rotate */}
            <button
              onClick={rotate}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              <FiRotateCw className="w-4 h-4" />
            </button>

            {/* Exit Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              <FiMinimize className="w-4 h-4" />
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              <FiPrinter className="w-4 h-4" />
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              <FiDownload className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-300 hover:text-white hover:bg-red-600 rounded-lg transition-colors duration-200"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Footer - Hidden in fullscreen */}
      {!isFullscreen && (
        <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 flex items-center justify-between text-sm text-gray-400">
          <div>
            {labRequest.patientName && (
              <span>Patient: {labRequest.patientName} • </span>
            )}
            <span>Test: {labRequest.testType}</span>
          </div>
          <div>Page 1 of 1</div>
        </div>
      )}
    </div>
  );
};

export default ViewLabReport;