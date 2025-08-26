import axios, {type AxiosInstance, type AxiosResponse, AxiosError} from 'axios';
import type {ApiErrorResponse} from './types';

// Get the base URL from environment variable or use default
const getBaseURL = () => {
  const defaultUrl = '/api';

  const baseURL = defaultUrl;
  console.log('Using API base URL:', baseURL);

  return baseURL;
};

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor to automatically add JWT token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');

    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${
        config.url
      }`
    );
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      headers: config.headers,
      data: config.data
        ? {
            ...config.data,
            password: config.data.password ? '[HIDDEN]' : undefined,
          }
        : undefined,
    });
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`Response from ${response.config.url}:`, {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error: AxiosError) => {
    console.error('Response interceptor error:', {
      message: error.message,
      code: error.code,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers,
          }
        : null,
      request: error.request
        ? {
            readyState: error.request.readyState,
            status: error.request.status,
            responseText: error.request.responseText,
          }
        : null,
      config: error.config
        ? {
            url: error.config.url,
            method: error.config.method,
            baseURL: error.config.baseURL,
          }
        : null,
    });

    // Handle network errors (no response from the server)
    if (!error.response) {
      let networkError = 'Network error. Please check your connection.';

      if (
        error.code === 'ECONNREFUSED' ||
        error.message.includes('ECONNREFUSED')
      ) {
        networkError =
          'Cannot connect to server. Please ensure the backend server is running.';
      } else if (
        error.code === 'NETWORK_ERROR' ||
        error.code === 'ERR_NETWORK'
      ) {
        networkError =
          'Network error. Please check your internet connection and server status.';
      } else if (error.code === 'ENOTFOUND') {
        networkError = 'Server not found. Please check the server URL.';
      } else if (
        error.code === 'TIMEOUT' ||
        error.message.includes('timeout')
      ) {
        networkError = 'Request timeout. Please try again.';
      }

      const apiError: ApiErrorResponse = {
        success: false,
        message: networkError,
      };

      return Promise.reject(apiError);
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear invalid token from localStorage
      localStorage.removeItem('auth_token');

      // Don't auto-redirect here, let the auth store handle it
      const apiError: ApiErrorResponse = {
        success: false,
        message: error.response.data?.message || 'Unauthorized access',
      };
      return Promise.reject(apiError);
    }

    // Handle other HTTP errors
    const responseData = error.response?.data as {
      message?: string;
      errors?: Record<string, string[]>;
      success?: boolean;
    };

    const apiError: ApiErrorResponse = {
      success: false,
      message:
        responseData?.message ||
        `HTTP ${error.response?.status}: ${error.response?.statusText}`,
      errors: responseData?.errors,
    };

    return Promise.reject(apiError);
  }
);

// Test function to check API connectivity
export const testApiConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing API connection...');
    const response = await axios.get(`${getBaseURL()}/health`, {
      timeout: 5000,
    });
    console.log('API connection test successful:', response.data);
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

export default api;
