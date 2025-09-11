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