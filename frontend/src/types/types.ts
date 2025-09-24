export interface AppointmentRequest {
  doctorId: number;
  patientEmail: string;
  appointmentDateTime: string;
}

export interface AppointmentResponse {
  appointmentId: number;
  doctorId: number;
  patientId: number;
  appointmentDateTime: string;
}
