import React, { useEffect, useState } from "react";
import { labReportService } from "../../../services/LabReportService";
import type { LabReport } from "../../../services/LabReportService";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import {
  FiDownload,
  FiFileText,
  FiCalendar,
  FiUser,
  FiBarChart2,
} from "react-icons/fi";

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
          (a, b) =>
            new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime()
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
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <title>${report.reportName}</title>
              <style>
          html, body {
            height: 100%;
            width: 100%;
            margin: 0;
            background: #f8fafc;
            overflow: hidden;
          }
          .preview-container {
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
          }
          iframe, img {
            width: 100vw;
            height: 100vh;
            border: none;
            border-radius: 0;
            background: white;
            box-shadow: none;
            object-fit: contain;
            display: block;
          }
              </style>
            </head>
            <body>
              <div class="preview-container">
          ${
            report.fileFormat.toLowerCase() === "pdf"
              ? `<iframe src="${fileURL}"></iframe>`
              : `<img src="${fileURL}" alt="${report.reportName}" />`
          }
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
        <div className="text-gray-600 text-lg font-medium mb-2">
          No lab reports available
        </div>
        <div className="text-gray-400">
          There are no lab reports to display at the moment.
        </div>
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
              <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 border-2 border-blue-100">
                <FiFileText size={24} className="text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg leading-tight truncate group-hover:text-blue-600 transition-colors">
                  {report.reportName}
                </h3>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
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
              onClick={() => handleOpenInNewTab(report)}
              className="w-full cursor-pointer flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg border border-blue-500 hover:bg-blue-600 hover:border-blue-600 transition-all duration-200 group/btn font-medium shadow-sm hover:shadow-md"
            >
              <FiDownload className="w-4 h-4 mr-2 group-hover/btn:translate-y-0.5 transition-transform" />
              View Report
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LabReports;
