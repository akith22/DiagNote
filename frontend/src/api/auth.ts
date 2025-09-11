// src/api/auth.ts
import axios from 'axios';

const API = axios.create({
    baseURL: '/api', // Update with your backend URL
    withCredentials: true,
});

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role: string;
}

export const loginUser = async (data: LoginRequest) => {
    const response = await API.post('/auth/login', data);

    const token = response.data.accessToken;
    localStorage.setItem("jwt", token);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`; // set for future
    return response;
};

// export const registerUser = (data: RegisterRequest) => API.post('/auth/register', data);

export const registerUser = async (data: RegisterRequest) => {
            try {
                const response = await API.post('/auth/register', data);

                // If the registration is successful
                // showMessage(response.data.message || "Registration successful", true);
                return true;
            } catch (error) {
                let errorMsg = "Registration failed due to an unexpected error";
                 if (axios.isAxiosError(error)) {
                    // Server responded with an error status (4xx, 5xx)
                    if (error.response) {
                        errorMsg = error.response.data.message || 
                                  error.response.data.error ||
                                  (error.response.status === 400 ? "Bad request: Please check your input" : 
                                   error.response.status === 409 ? "User already exists" : 
                                   `Request failed with status ${error.response.status}`);
                    } 
                    // Request was made but no response received
                    else if (error.request) {
                        errorMsg = "No response received from server. Please check your connection.";
                    } 
                    // Other Axios error
                    else {
                        errorMsg = error.message || "Error setting up registration request";
                    }
                }
                alert(errorMsg); 
            }
        }


API.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});



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