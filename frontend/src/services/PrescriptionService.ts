import type { Prescription } from "../types";
import API from "./api";

export interface PrescriptionDto {
  id?: number;
  appointmentId?: number;
  notes: string;
  dateIssued?: string;
  patientName?: string;
}

const API_BASE = "/doctor";

export const prescriptionService = {
  async createPrescription(
    appointmentId: number,
    dto: PrescriptionDto
  ): Promise<PrescriptionDto> {
    const res = await API.post(
      `${API_BASE}/p/${appointmentId}/prescriptions`,
      dto
    );
    return res.data;
  },

  async updatePrescription(
    prescriptionId: number,
    dto: PrescriptionDto
  ): Promise<PrescriptionDto> {
    const res = await API.put(
      `${API_BASE}/prescriptions/${prescriptionId}`,
      dto
    );
    return res.data;
  },

  async deletePrescription(prescriptionId: number): Promise<void> {
    await API.delete(`${API_BASE}/prescriptions/${prescriptionId}`);
  },

  async getById(prescriptionId: number): Promise<PrescriptionDto> {
    const res = await API.get(`${API_BASE}/prescriptions/${prescriptionId}`);
    return res.data;
  },

  async getByAppointmentId(
    appointmentId: number
  ): Promise<PrescriptionDto[]> {
    const res = await API.get(
      `${API_BASE}/appointments/${appointmentId}/prescriptions`
    );
    return res.data;
  },

  /**
   * Fetch detailed info for a prescription (for editing/viewing)
   */
  async getPrescriptionDetails(
prescriptionId: number  ): Promise<{
    prescriptionId: number;
    appointmentId: number;
    dateIssued: string;
    notes: string;
    patientName: string;
    patientGender: string;
    patientAge: number;
    patientAddress: string;
  }> {
    const res = await API.get(
      `${API_BASE}/prescriptions/${prescriptionId}/details`
    );
    return res.data;
  },

  async getPatientDetailsByAppointment(
  appointmentId: number
): Promise<{
  patientId: number;
  name: string;
  email: string;
  gender: string;
  age: number;
  address: string;
}> {
  const res = await API.get(
    `${API_BASE}/appointments/${appointmentId}/patient`
  );
  return res.data;
},

  /**
   * Fetch patient info by appointment (for new prescriptions)
   */
  

  async getAllPrescriptionsByDoctor(): Promise<PrescriptionDto[]> {
    const res = await API.get(`${API_BASE}/prescriptions/doctor`);
    return res.data;
  },

  async getPatientPrescriptions(): Promise<Prescription[]> {
    try {
      const response = await API.get("/patient/prescriptions");
      console.log("Prescription data received:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Prescription fetch error:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch prescriptions");
    }
  },

};
