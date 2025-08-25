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
  isLoading: true,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({isLoading: true, error: null});

    try {
      const response = await api.post<LoginResponse>(
        '/auth/login',
        credentials
      );
      const {data} = response.data;
      const {user, token} = data;

      console.log('thr response after login', response.data);
      console.log(user, token);

      localStorage.setItem('auth_token', token);

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
      const {data} = response.data;
      const {user, token} = data;

      localStorage.setItem('auth_token', token);

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
    localStorage.removeItem('auth_token');

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  initializeAuth: () => {
    const storedToken = localStorage.getItem('auth_token');

    if (storedToken) {
      // 💡 Crucial Fix: Immediately set the token in the store
      // This makes the token available to interceptors for subsequent API calls.
      set({isLoading: true, error: null, token: storedToken});

      api
        .get<{user: User}>('/users/profile')
        .then((response) => {
          const {user} = response.data;
          console.log('User profile fetched:', user);
          set({
            user,
            // token is already set, ensuring it persists even if this request takes time
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        })
        .catch((err) => {
          console.error('Authentication initialization failed:', err);
          // The interceptor's 401 handler will call logout,
          // which correctly clears localStorage and Zustand state.
          // This specific catch block handles non-401 errors for the profile fetch.
          useAuthStore.getState().logout(); // Call logout to fully reset on any profile fetch failure
          set({
            user: null,
            token: null, // Ensure token is nullified in state if profile fetch fails
            isAuthenticated: false,
            isLoading: false,
            error: 'Session expired or invalid. Please log in again.',
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
