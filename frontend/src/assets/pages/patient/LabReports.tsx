import React, { useEffect, useState } from "react";
import { labReportService } from "../../../services/LabReportService";
import type { LabReport } from "../../../services/LabReportService";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { FiDownload, FiFileText, FiCalendar, FiUser, FiFile, FiBarChart2 } from "react-icons/fi";

const LabReports: React.FC = () => {
  const [reports, setReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await labReportService.getReports();
      setReports(
        data.sort(
          (a, b) => new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime()
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch lab reports");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInNewTab = async (report: LabReport) => {
    try {
      const blob = await labReportService.downloadReportBlob(report.reportFile);
      const fileURL = URL.createObjectURL(blob);

      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${report.reportName}</title>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  min-height: 100vh;
                  padding: 20px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                .glass-container {
                  background: rgba(255, 255, 255, 0.25);
                  backdrop-filter: blur(20px);
                  -webkit-backdrop-filter: blur(20px);
                  border: 1px solid rgba(255, 255, 255, 0.18);
                  border-radius: 24px;
                  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                  width: 95%;
                  max-width: 1400px;
                  overflow: hidden;
                }
                .header {
                  background: rgba(255, 255, 255, 0.3);
                  padding: 32px;
                  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                  backdrop-filter: blur(10px);
                }
                .header h2 { 
                  color: #1e293b; 
                  font-size: 28px; 
                  font-weight: 700;
                  margin-bottom: 16px;
                  line-height: 1.3;
                  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .meta-info {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 16px;
                }
                .meta-item {
                  display: flex;
                  align-items: center;
                  gap: 10px;
                  padding: 10px 16px;
                  background: rgba(255, 255, 255, 0.4);
                  border-radius: 12px;
                  border: 1px solid rgba(255, 255, 255, 0.3);
                  color: #334155;
                  font-weight: 500;
                  font-size: 14px;
                  backdrop-filter: blur(10px);
                  transition: all 0.3s ease;
                }
                .meta-item:hover {
                  background: rgba(255, 255, 255, 0.6);
                  transform: translateY(-2px);
                }
                .preview-container {
                  padding: 40px;
                  background: rgba(255, 255, 255, 0.15);
                  min-height: 75vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  backdrop-filter: blur(10px);
                }
                iframe, img { 
                  width: 100%; 
                  height: 75vh; 
                  border: none; 
                  border-radius: 20px;
                  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                  background: white;
                  border: 1px solid rgba(255, 255, 255, 0.3);
                }
                .watermark {
                  position: fixed;
                  bottom: 30px;
                  right: 30px;
                  background: rgba(59, 130, 246, 0.9);
                  color: white;
                  padding: 14px 24px;
                  border-radius: 16px;
                  font-size: 14px;
                  font-weight: 600;
                  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
                  backdrop-filter: blur(10px);
                  border: 1px solid rgba(255, 255, 255, 0.2);
                  z-index: 1000;
                }
                @media (max-width: 768px) {
                  body { padding: 16px; }
                  .header { padding: 24px; }
                  .preview-container { padding: 24px; }
                  .meta-info { gap: 12px; }
                  .meta-item { flex: 1; min-width: 140px; }
                }
              </style>
            </head>
            <body>
              <div class="watermark">
                🔬 Lab Report Preview
              </div>
              <div class="glass-container">
                <div class="header">
                  <h2>${report.reportName}</h2>
                  <div class="meta-info">
                    <span class="meta-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      ${new Date(report.dateIssued).toLocaleString()}
                    </span>
                    <span class="meta-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      ${report.uploadedBy}
                    </span>
                    <span class="meta-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10,9 9,9 8,9"></polyline>
                      </svg>
                      ${report.fileFormat.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div class="preview-container">
                  ${
                    report.fileFormat.toLowerCase() === "pdf"
                      ? `<iframe src="${fileURL}"></iframe>`
                      : `<img src="${fileURL}" alt="${report.reportName}" />`
                  }
                </div>
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    } catch (err) {
      console.error("Failed to open report", err);
    }
  };

  const handleDownload = async (report: LabReport, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const blob = await labReportService.downloadReportBlob(report.reportFile);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${report.reportName}.${report.fileFormat}`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Failed to download report", err);
    }
  };

  const getFileIconColor = (fileFormat: string) => {
    const format = fileFormat.toLowerCase();
    // Pleasant blue color scheme
    if (format === "pdf") return "#3b82f6";
    if (["jpg", "jpeg", "png", "gif"].includes(format)) return "#60a5fa";
    if (["doc", "docx"].includes(format)) return "#2563eb";
    return "#1d4ed8"; // Default blue
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="text-red-500 text-lg font-semibold mb-2">Error</div>
        <div className="text-red-600">{error}</div>
        <button
          onClick={fetchReports}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiBarChart2 className="text-blue-500 text-3xl" />
        </div>
        <div className="text-gray-600 text-lg font-medium mb-2">No lab reports available</div>
        <div className="text-gray-400">There are no lab reports to display at the moment.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {reports.map((report) => (
        <div
          key={report.id}
          className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer hover:border-blue-200"
          onClick={() => handleOpenInNewTab(report)}
        >
          {/* Card Header */}
          <div className="p-6 pb-4">
            <div className="flex items-start space-x-4">
              <div 
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 border-2 border-blue-100"
              >
                <FiFileText 
                  size={24} 
                  className="text-blue-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg leading-tight truncate group-hover:text-blue-600 transition-colors">
                  {report.reportName}
                </h3>
                <div className="flex items-center space-x-2 mt-2">
                  <span 
                    className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    {report.fileFormat.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Meta Information */}
          <div className="px-6 pb-4 space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <FiCalendar className="w-4 h-4 mr-2 text-blue-500" />
              <span>{formatDate(report.dateIssued)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FiUser className="w-4 h-4 mr-2 text-blue-500" />
              <span>Uploaded by {report.uploadedBy}</span>
            </div>
          </div>

          {/* Card Footer - Download Button */}
          <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
            <button
              onClick={(e) => handleDownload(report, e)}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg border border-blue-500 hover:bg-blue-600 hover:border-blue-600 transition-all duration-200 group/btn font-medium shadow-sm hover:shadow-md"
            >
              <FiDownload className="w-4 h-4 mr-2 group-hover/btn:translate-y-0.5 transition-transform" />
              Download Report
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LabReports;