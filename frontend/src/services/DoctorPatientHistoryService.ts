import api from './api';

export interface AppointmentInfo {
  id: number;
  doctorName: string;
  date: string;
  status: string;
}

export interface PrescriptionInfo {
  id: number;
  doctorName: string;
  notes: string;
  dateIssued: string;
}

export interface DoctorPatientHistoryDto {
  name: string;
  email: string;
  gender: string;
  age: number;
  address: string;
  appointments: AppointmentInfo[];
  prescriptions: PrescriptionInfo[];
}

export const doctorPatientHistoryService = {
  getPatientHistoryByAppointmentId: async (appointmentId: number): Promise<DoctorPatientHistoryDto> => {
    const response = await api.get(`/doctor/patient-history/${appointmentId}`);
    return response.data;
  },
};