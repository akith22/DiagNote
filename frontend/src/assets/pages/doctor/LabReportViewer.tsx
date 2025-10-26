import { FiX, FiDownload, FiExternalLink } from 'react-icons/fi';

interface LabReportViewerProps {
  fileName: string;
  blob: Blob;
  onClose: () => void;
  onDownload: () => void;
}

export const LabReportViewer: React.FC<LabReportViewerProps> = ({
  fileName,
  blob,
  onClose,
  onDownload
}) => {
  const isPdf = fileName.toLowerCase().endsWith('.pdf');
  const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);
  
  const getFileUrl = () => {
    return URL.createObjectURL(blob);
  };

  const handleOpenInNewTab = () => {
    const url = getFileUrl();
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FiExternalLink className="text-xl text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Lab Report</h3>
              <p className="text-gray-600 text-sm">{fileName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
            >
              <FiDownload className="text-sm" />
              Download
            </button>
            <button
              onClick={handleOpenInNewTab}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <FiExternalLink className="text-sm" />
              Open in New Tab
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <FiX className="text-xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto">
          {isPdf ? (
            <div className="w-full h-full">
              <iframe
                src={getFileUrl()}
                className="w-full h-full border-0 rounded-lg"
                title={fileName}
              />
            </div>
          ) : isImage ? (
            <div className="flex items-center justify-center h-full">
              <img
                src={getFileUrl()}
                alt={fileName}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg font-medium mb-2">Document Preview Not Available</p>
              <p className="text-sm mb-4">
                This file type cannot be previewed in the browser. Please download the file to view it.
              </p>
              <button
                onClick={onDownload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <FiDownload className="text-sm" />
                Download {fileName}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>File: {fileName}</span>
            <span>Size: {(blob.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        </div>
      </div>
    </div>
  );
};