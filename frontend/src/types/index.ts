
export interface User {
  userId: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  email: string;
  accessToken: string;
  role: string;
}

export interface DoctorDetails {
  specialization: string;
  licenseNumber: string;
  availableTimes: string;
}

export interface DoctorProfile {
  name: string;
  email: string;
  specialization: string | null;
  licenseNumber: string | null;
  availableTimes: string | null;
  profileComplete: boolean;
}

export interface PatientDetails {
  gender: string;
  address: string;
  age: number;
}

export interface PatientProfile {
  name: string;
  email: string;
  gender: string | null;
  address: string | null;
  age: number | null;
  profileComplete: boolean;
}

export interface LabTechDetails {
  department: string;
}

export interface LabTechProfile {
  name: string;
  email: string;
  department: string | null;
  profileComplete: boolean;
}

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

export interface Prescription {
  id: number;
  notes: string;
  dateIssued: string;
  appointment: {
    id: number;
    date: string;
    time: string;
    doctor: {
      name: string;
      specialization: string;
    };
  };
}
