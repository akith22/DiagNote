// src/api/auth.ts
import axios from 'axios';
import type { AuthResponse, User } from "../types/index.ts";
import  API  from '../services/api';


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

// Store token and user data in localStorage
export const storeAuthData = (authData: AuthResponse, userData: User) => {
  localStorage.setItem('token', authData.accessToken);
  localStorage.setItem('user', JSON.stringify(userData));
};

// Remove auth data from localStorage
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get stored token
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Get stored user data
export const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Check if user has specific role
export const hasRole = (role: string): boolean => {
  const user = getUser();
  return user ? user.role === role : false;
};

export const loginUser = async (data: LoginRequest) => {
    try{
        const response = await API.post('/auth/login', data);
        const authData : AuthResponse = response.data;

        const userData: User = {
            userId: 0, // This would come from your backend
            name: "", // This would come from your backend
            email: authData.email,
            role: authData.role,
        };
        
        storeAuthData(authData, userData);
        return authData;
    }catch(error:any){
        throw new Error(error.response?.data?.message || "Login failed");
    }
    // const token = response.data.accessToken;
    // localStorage.setItem("jwt", token);
    // API.defaults.headers.common['Authorization'] = `Bearer ${token}`; // set for future
    // return authData;
};

export const registerUser = async (data: RegisterRequest) => {
            try {
                const response = await API.post('/auth/register', data);

                // If the registration is successful
                // showMessage(response.data.message || "Registration successful", true);
                return response.data;
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


// Logout function
export const logout = () => {
  clearAuthData();
  window.location.href = '/login';
};





