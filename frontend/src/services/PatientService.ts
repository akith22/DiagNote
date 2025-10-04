import api from './api';
import type { PatientProfile, PatientDetails } from '../types';

export const patientService = {

  getProfile: async (): Promise<PatientProfile> => {
    const response = await api.get('/patient/profile');
    return response.data;
  },

  saveProfile: async (profileData: PatientDetails): Promise<void> => {
    const response = await api.post('/patient/profile', profileData);
    return response.data;
  },

  updateProfile: async (profileData: PatientDetails): Promise<void> => {
    const response = await api.put('/patient/profile', profileData);
    return response.data;
  },

  deleteProfile: async (): Promise<void> => {
    const response = await api.delete('/patient/profile');
    return response.data;
  }
};