import {create} from 'zustand';
import api from './api';
import type {LoginCredentials, User, UserRegistrationData} from './types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  token: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  createAdmin: (adminData: UserRegistrationData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  getToken: () => string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

type AuthStore = AuthState & AuthActions;

// Token storage keys
const TOKEN_KEY = 'auth_token';

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  isInitialized: false,
  token: localStorage.getItem(TOKEN_KEY),

  // Actions
  login: async (credentials: LoginCredentials) => {
    set({isLoading: true, error: null});

    try {
      console.log('Attempting login to:', api.defaults.baseURL);
      console.log('Login credentials:', {
        email: credentials.email,
        passwordLength: credentials.password.length,
      });

      const response = await api.post('/auth/login', credentials);

      console.log('Login response:', response.data);

      // Handle API response structure based on your backend
      let user;
      let token;
      if (
        response.data.success &&
        response.data.data &&
        response.data.data.user
      ) {
        user = response.data.data.user;
        token = response.data.data.token;
      } else if (response.data.user) {
        user = response.data.user;
        token = response.data.token;
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Invalid response format: missing user data');
      }

      if (!user || !user._id) {
        throw new Error('Invalid user data received from server');
      }

      if (!token) {
        throw new Error('No authentication token received from server');
      }

      // Store token in localStorage
      localStorage.setItem(TOKEN_KEY, token);

      console.log('Login successful, user:', user);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isInitialized: true,
      });
    } catch (error: any) {
      console.error('Login error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        config: error?.config,
      });

      let errorMessage = 'Login failed. Please try again.';

      if (error?.code === 'NETWORK_ERROR' || error?.code === 'ERR_NETWORK') {
        errorMessage =
          'Network error. Please check your connection and ensure the server is running.';
      } else if (error?.response?.status === 401) {
        errorMessage =
          'Invalid credentials. Please check your email and password.';
      } else if (error?.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        if (error.message.includes('Network Error')) {
          errorMessage =
            'Cannot connect to server. Please check if the backend is running.';
        } else {
          errorMessage = error.message;
        }
      }

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
        isInitialized: true,
      });

      throw error; // Re-throw to allow component to handle if needed
    }
  },

  createAdmin: async (adminData: UserRegistrationData) => {
    set({isLoading: true, error: null});

    try {
      console.log('Attempting admin creation to:', api.defaults.baseURL);

      const response = await api.post('/auth/create-admin', adminData);

      console.log('Admin creation response:', response.data);

      // Handle API response structure
      let user;
      let token;
      if (
        response.data.success &&
        response.data.data &&
        response.data.data.user
      ) {
        user = response.data.data.user;
        token = response.data.data.token;
      } else if (response.data.user) {
        user = response.data.user;
        token = response.data.token;
      } else {
        throw new Error('Invalid response format: missing user data');
      }

      if (!user || !user._id) {
        throw new Error('Invalid user data received from server');
      }

      if (!token) {
        throw new Error('No authentication token received from server');
      }

      // Store token in localStorage
      localStorage.setItem(TOKEN_KEY, token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isInitialized: true,
      });
    } catch (error: any) {
      console.error('Admin creation error:', error);

      let errorMessage = 'Admin creation failed. Please try again.';

      if (error?.code === 'NETWORK_ERROR' || error?.code === 'ERR_NETWORK') {
        errorMessage =
          'Network error. Please check your connection and ensure the server is running.';
      } else if (error?.response?.status === 403) {
        errorMessage = 'Invalid secret password or admin already exists.';
      } else if (error?.response?.status === 400) {
        errorMessage =
          error?.response?.data?.message || 'Invalid data provided.';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message && error.message.includes('Network Error')) {
        errorMessage =
          'Cannot connect to server. Please check if the backend is running.';
      }

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
        isInitialized: true,
      });

      throw error;
    }
  },

  logout: async () => {
    set({isLoading: true});

    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Don't show error to user for logout failures
    } finally {
      // Clear token from localStorage
      localStorage.removeItem(TOKEN_KEY);

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isInitialized: true,
      });
    }
  },

  checkAuth: async () => {
    set({isLoading: true, error: null});

    try {
      const response = await api.get('/auth/me');

      console.log('Auth check response:', response.data);

      // Handle API response structure
      let user;
      if (
        response.data.success &&
        response.data.data &&
        response.data.data.user
      ) {
        user = response.data.data.user;
      } else if (response.data.user) {
        user = response.data.user;
      } else {
        user = response.data;
      }

      if (user && user._id) {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          isInitialized: true,
        });
      } else {
        throw new Error('Invalid user data received');
      }
    } catch (error: any) {
      console.error('Auth check failed:', error);

      // If auth check fails, clear token and user data
      localStorage.removeItem(TOKEN_KEY);

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null, // Don't show auth check errors to user
        isInitialized: true,
      });
    }
  },

  clearError: () => {
    set({error: null});
  },

  setLoading: (loading: boolean) => {
    set({isLoading: loading});
  },

  getToken: () => {
    return get().token || localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    set({token});
  },

  clearToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({token: null});
  },
}));
