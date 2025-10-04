export interface AppointmentRequest {
  doctorEmail: string;
  patientEmail: string;
  appointmentDateTime: string;
}

export interface AppointmentResponse {
  appointmentId: number;
  doctorId: number;
  doctorName: string;
  patientId: number;
  patientName: string;
  appointmentDateTime: string;
  status: string;
  notes: string
}
