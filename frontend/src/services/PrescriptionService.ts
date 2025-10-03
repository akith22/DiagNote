import api from './api';

// Types
export interface PrescriptionDto {
  id?: number;
  appointmentId: number;
  dateIssued: string;
  notesJson: string;
  patientName?: string;
}

export interface CreatePrescriptionRequest {
  notesJson: string;
}

export interface UpdatePrescriptionRequest {
  notesJson: string;
}

// Service Functions
export const prescriptionService = {
  // Create a new prescription
  async createPrescription(
    appointmentId: number,
    data: CreatePrescriptionRequest
  ): Promise<PrescriptionDto> {
    const response = await api.post(`/appointments/${appointmentId}/prescriptions`, data);
    return response.data;
  },

  // Update an existing prescription
  async updatePrescription(
    prescriptionId: number,
    data: UpdatePrescriptionRequest
  ): Promise<PrescriptionDto> {
    const response = await api.put(`/prescriptions/${prescriptionId}`, data);
    return response.data;
  },

  // Get all prescriptions for an appointment
  async getByAppointment(appointmentId: number): Promise<PrescriptionDto[]> {
    const response = await api.get(`/appointments/${appointmentId}/prescriptions`);
    return response.data;
  },

  // Get single prescription by appointment ID
  async getPrescription(appointmentId: number): Promise<PrescriptionDto> {
    const response = await api.get(`/appointments/${appointmentId}/prescription`);
    return response.data;
  },
};

export default prescriptionService;
