import api from './api';

// LabRequest interface matching backend DTO
export interface LabRequest {
  id: number;
  status: "REQUESTED" | "COMPLETED";
  testType: string;
  appointmentId: number;
  // Optional fields if needed
  doctorName?: string;
  patientName?: string;
}

export const labRequestsService = {
  // Fetch all lab requests
  getAllLabRequests: async (): Promise<LabRequest[]> => {
    const response = await api.get('/lab-requests');
    return response.data;
  },

  // ✅ Matches backend mapping: PUT /api/lab-requests/{id}/status/{status}
  updateLabRequestStatus: async (id: number, status: "REQUESTED" | "COMPLETED"): Promise<LabRequest> => {
    const response = await api.put(`/lab-requests/${id}/status/${status}`);
    return response.data;
  },

  // Optionally: add a new lab request
  addLabRequest: async (requestData: Partial<LabRequest>): Promise<LabRequest> => {
    const response = await api.post('/lab-requests', requestData);
    return response.data;
  },

  // Optionally: delete a lab request
  deleteLabRequest: async (id: number): Promise<void> => {
    const response = await api.delete(`/lab-requests/${id}`);
    return response.data;
  },
};
