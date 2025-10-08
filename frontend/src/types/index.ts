
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
  medicalLicense: string;
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