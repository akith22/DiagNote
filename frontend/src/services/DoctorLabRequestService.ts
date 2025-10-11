import API from './api'; 
// DTO matching backend
export interface DoctorLabRequestDto {
  id?: number;
  status: "REQUESTED" | "COMPLETED";
  testType: string;
  appointmentId: number;
  patientName?: string;
}

const API_URL = "/doctor";

export const doctorLabRequestService = {
  // ✅ Create a new lab request for an appointment
  createLabRequest: async (appointmentId: number, payload: DoctorLabRequestDto) => {
    const response = await API.post<DoctorLabRequestDto>(
      `${API_URL}/appointments/${appointmentId}/labrequests`,
      payload
    );
    return response.data;
  },

  // ✅ Get all lab requests for a specific appointment
  getLabRequestsByAppointment: async (appointmentId: number) => {
    const response = await API.get<DoctorLabRequestDto[]>(
      `${API_URL}/appointments/${appointmentId}/labrequests`
    );
    return response.data;
  },

  // ✅ Get a single lab request by ID
  getLabRequestById: async (id: number) => {
    const response = await API.get<DoctorLabRequestDto>(
      `${API_URL}/labrequests/${id}`
    );
    return response.data;
  },

  // ✅ Get all lab requests for the current doctor
  getAllLabRequestsByDoctor: async () => {
    const response = await API.get<DoctorLabRequestDto[]>(
      `${API_URL}/labrequests/doctor`
    );
    return response.data;
  },
};