import axios from "axios";
import { getToken } from "../api/auth";

export interface LabReport {
  id: number;
  reportName: string;
  dateIssued: string;
  uploadedBy: string;
  fileFormat: string;
  reportFile: string; // filename only, like "DiagNote_Final.pdf"
}

const API_URL = "/api/patient/lab-reports";

export const labReportService = {
  // ✅ Fetch all lab reports for logged-in patient
  getReports: async (): Promise<LabReport[]> => {
    const token = getToken();
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // ✅ Fetch report file (PDF/image) as a Blob for preview or download
  downloadReportBlob: async (fileName: string): Promise<Blob> => {
    const token = getToken();
    const res = await axios.get(`${API_URL}/file/${fileName}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });
    return res.data;
  },
};
