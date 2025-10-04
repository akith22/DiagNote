import API from './api';

export const doctorService = {
    
  getProfile: async () => {
    const response = await API.get('/doctor/profile');
    return response.data;
  },

  saveProfile: async (profileData: {
    specialization: string;
    licenseNumber: string;
    availableTimes: string;
  }) => {
    const response = await API.post('/doctor/profile', profileData);
    return response.data;
  },

  updateProfile: async (profileData: {
    specialization: string;
    licenseNumber: string;
    availableTimes: string;
  }) => {
    const response = await API.put('/doctor/profile', profileData);
    return response.data;
  },
  };