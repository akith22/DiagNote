import api from './api';

export interface LabReportInfo {
  labRequestId: number;
  testType: string;
  requestStatus: string;
  labReportId: number | null;
  reportFile: string | null;
  reportDateIssued: string | null;
  labTechName: string | null;
  completed: boolean;
}

export interface HistoryEntry {
  appointmentId: number;
  doctorName: string;
  appointmentDate: string;
  status: string;
  prescriptionId: number | null;
  prescriptionNotes: string | null;
  dateIssued: string | null;
  labReports: LabReportInfo[];
}

export interface DoctorPatientHistoryDto {
  patientName: string;
  patientEmail: string;
  gender: string;
  age: number;
  address: string;
  history: HistoryEntry[];
  labReports: any[];
}

export const doctorPatientHistoryService = {
  getPatientHistoryByPatientEmail: async (email: string): Promise<DoctorPatientHistoryDto> => {
    const response = await api.get(`/doctor/patient-history`, {
      params: { email }
    });
    return response.data;
  },

  // Download lab report file - updated to match your backend endpoint
  downloadLabReport: async (fileName: string): Promise<Blob> => {
    const response = await api.get(`/doctor/lab-reports/file/${fileName}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Optional: Add a method to view the file in new tab
  viewLabReport: async (fileName: string): Promise<string> => {
    const blob = await doctorPatientHistoryService.downloadLabReport(fileName);
    return URL.createObjectURL(blob);
  }
};