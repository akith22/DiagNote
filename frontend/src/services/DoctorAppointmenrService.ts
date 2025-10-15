// src/services/DoctorAppointmentService.ts
import API from './api'; // your axios instance with JWT interceptors

export interface AppointmentDto {
  id: number;
  patientName: string;
  patientId: number; // ✅ added patientId
  date: string;
  
  
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELLED" | "COMPLETED";
}

export const doctorAppointmentService = {
  // Get all appointments or filter by status
  getAppointments: async (status?: string): Promise<AppointmentDto[]> => {
    const res = await API.get<AppointmentDto[]>("/doctor/appointments", {
      params: status ? { status } : undefined,
    });
    return res.data;
  },

  // Accept an appointment
  acceptAppointment: async (id: number): Promise<AppointmentDto> => {
    const res = await API.post<AppointmentDto>(`/doctor/appointments/${id}/accept`);
    return res.data;
  },

  // Decline an appointment
  declineAppointment: async (id: number): Promise<AppointmentDto> => {
    const res = await API.post<AppointmentDto>(`/doctor/appointments/${id}/decline`);
    return res.data;
  },

  // ✅ Cancel an appointment
  cancelAppointment: async (id: number): Promise<AppointmentDto> => {
    const res = await API.post<AppointmentDto>(`/doctor/appointments/${id}/cancel`);
    return res.data;
  },
};
