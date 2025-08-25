import {create} from 'zustand';
import api from './api';
import type {
  User,
  LoginCredentials,
  UserRegistrationData,
  LoginResponse,
  UserRegistrationResponse,
  ApiError,
} from './types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  createAdmin: (adminData: UserRegistrationData) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({isLoading: true, error: null});

    try {
      const response = await api.post<LoginResponse>(
        '/auth/login',
        credentials
      );
      const {user, token} = response.data;

      // Store token in localStorage
      localStorage.setItem('auth_token', token);

      // Update state
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: apiError.message || 'Login failed',
      });
      throw error;
    }
  },

  createAdmin: async (adminData: UserRegistrationData) => {
    set({isLoading: true, error: null});

    try {
      const response = await api.post<UserRegistrationResponse>(
        '/auth/create-user',
        adminData
      );
      const {user, token} = response.data;

      // Store token in localStorage
      localStorage.setItem('auth_token', token);

      // Update state
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: apiError.message || 'Admin registration failed',
      });
      throw error;
    }
  },

  logout: () => {
    // Clear token from localStorage
    localStorage.removeItem('auth_token');

    // Reset state
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  initializeAuth: () => {
    const token = localStorage.getItem('auth_token');

    if (token) {
      set({isLoading: true});

      // Verify token by making a request to get user profile
      api
        .get<{user: User}>('/auth/profile')
        .then((response) => {
          const {user} = response.data;
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        })
        .catch(() => {
          // Token is invalid, clear it
          localStorage.removeItem('auth_token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        });
    } else {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  clearError: () => {
    set({error: null});
  },
}));
