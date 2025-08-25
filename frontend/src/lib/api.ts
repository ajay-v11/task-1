import axios, {type AxiosInstance, type AxiosResponse, AxiosError} from 'axios';
import type {ApiError} from './types';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // Redirect to login page
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle network errors (no response from the server)
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        success: false,
        message: 'Network error. Please check your connection.',
      } as ApiError);
    }

    // Handle API errors with proper error structure
    const responseData = error.response?.data as {
      message?: string;
      errors?: Record<string, string[]>;
    };
    const apiError: ApiError = {
      success: false,
      message: responseData?.message || 'An unexpected error occurred',
      errors: responseData?.errors,
    };

    return Promise.reject(apiError);
  }
);

export default api;
