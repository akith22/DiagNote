import api from "./api";

export interface LabReport {
  id: number;
  reportFile: string;
  dateIssued: string;
  labTechId: number;
  labRequestId: number;
}

export const labReportsService = {
  uploadReport: async (file: File, labRequestId: number) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("labRequestId", labRequestId.toString());

    const response = await api.post("/lab-reports/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  uploadMultipleReports: async (files: File[], labRequestId: number) => {
    const formData = new FormData();
    
    // Append each file
    files.forEach(file => {
      formData.append("files", file);
    });
    
    formData.append("labRequestId", labRequestId.toString());

    const response = await api.post("/lab-reports/upload-multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // 🔹 Get reports by lab request ID
  getReportsByLabRequest: async (labRequestId: number): Promise<LabReport[]> => {
    const response = await api.get(`/lab-reports/lab-request/${labRequestId}`);
    return response.data;
  },

  // 🔹 NEW: Get file download URL
  getFileDownloadUrl: (fileName: string): string => {
    return `${api.defaults.baseURL}/lab-reports/files/${fileName}`;
  },

  // 🔹 NEW: Download file as blob
  downloadFile: async (fileName: string): Promise<Blob> => {
    const response = await api.get(`/lab-reports/files/${fileName}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // 🔹 NEW: Get file URL for viewing
  getFileViewUrl: (fileName: string): string => {
    return `${api.defaults.baseURL}/lab-reports/files/${fileName}`;
  }
};