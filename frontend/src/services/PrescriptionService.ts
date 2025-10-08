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
      `${API_BASE}/p/${appointmentId}/prescriptions`, // fixed URL
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

  async getPrescriptionDetails(
    prescriptionId: number
  ): Promise<Record<string, any>> {
    const res = await API.get(
      `${API_BASE}/prescriptions/${prescriptionId}/details`
    );
    return res.data;
  },

  async getAllPrescriptionsByDoctor(
    doctorEmail: string
  ): Promise<PrescriptionDto[]> {
    const res = await API.get(`${API_BASE}/prescriptions/doctor`, {
      params: { email: doctorEmail },
    });
    return res.data;
  },
};
