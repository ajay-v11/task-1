import axios, {type AxiosInstance, type AxiosResponse, AxiosError} from 'axios';
import type {ApiError} from './types';
import {useAuthStore} from './authStore'; // 💡 Import the store directly

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
    // 💡 Use the Zustand store to get the current token
    const token = useAuthStore.getState().token;
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
    // Handle 401 Unauthorized errors by calling the store's logout method
    if (error.response?.status === 401) {
      // 💡 This is the crucial fix: call the logout action from the store
      useAuthStore.getState().logout();
      // The logout method handles both localStorage and state cleanup.
      // No need to manually removeItem here.

      // We still need to return a rejected promise to stop the chain.
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
