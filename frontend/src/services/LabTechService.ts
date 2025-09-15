import api from './api';
import type { LabTechProfile, LabTechDetails } from '../types';

export const labTechService = {
  getProfile: async (): Promise<LabTechProfile> => {
    const response = await api.get('/labtech/profile');
    return response.data;
  },

  saveProfile: async (profileData: LabTechDetails): Promise<void> => {
    const response = await api.post('/labtech/profile', profileData);
    return response.data;
  },

  updateProfile: async (profileData: LabTechDetails): Promise<void> => {
    const response = await api.put('/labtech/profile', profileData);
    return response.data;
  },

  deleteProfile: async (): Promise<void> => {
    const response = await api.delete('/labtech/profile');
    return response.data;
  }
};