// src/lib/authContext.tsx

import React, {createContext, useContext, useEffect, useReducer} from 'react';
import api from './api';
import type {LoginCredentials, User, UserRegistrationData} from './types';

// --- Auth State and Actions ---
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

type AuthAction =
  | {type: 'AUTH_START'}
  | {type: 'AUTH_SUCCESS'; payload: {user: User; token: string}}
  | {type: 'AUTH_ERROR'; payload: string}
  | {type: 'LOGOUT'}
  | {type: 'CLEAR_ERROR'}
  | {type: 'INITIALIZE'};

// --- Initial State and Reducer ---
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  isInitialized: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {...state, isLoading: true, error: null};

    case 'AUTH_SUCCESS':
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', action.payload.token);
      }
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
        isInitialized: true,
      };

    case 'AUTH_ERROR':
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
        isInitialized: true,
      };

    case 'LOGOUT':
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      return {
        ...initialState,
        token: null,
        isLoading: false,
        isInitialized: true,
      };

    case 'CLEAR_ERROR':
      return {...state, error: null};

    case 'INITIALIZE':
      return {
        ...state,
        isLoading: false,
        isInitialized: true,
      };

    default:
      return state;
  }
}

// --- Context Definition ---
interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  createAdmin: (adminData: UserRegistrationData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  state: initialState,
  login: async () => {},
  createAdmin: async () => {},
  logout: () => {},
  clearError: () => {},
});

// --- AuthProvider Component ---
export function AuthProvider({children}: {children: React.ReactNode}) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check if we're in the browser
      if (typeof window === 'undefined') {
        dispatch({type: 'INITIALIZE'});
        return;
      }

      const token = localStorage.getItem('auth_token');
      if (!token) {
        dispatch({type: 'INITIALIZE'});
        return;
      }

      try {
        // Set the auth header for the API request
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const response = await api.get('/users/profile');

        // Handle different API response structures
        const user =
          response.data.data?.user || response.data.user || response.data;

        if (user && user._id) {
          dispatch({type: 'AUTH_SUCCESS', payload: {user, token}});
        } else {
          throw new Error('Invalid user data received');
        }
      } catch (error: any) {
        console.error('Auth initialization failed:', error);

        // Clear the invalid token
        localStorage.removeItem('auth_token');
        delete api.defaults.headers.common['Authorization'];

        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Session expired or invalid';

        dispatch({type: 'AUTH_ERROR', payload: errorMessage});
      }
    };

    initializeAuth();
  }, []);

  // Update API headers when token changes
  useEffect(() => {
    if (state.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  const login = async (credentials: LoginCredentials) => {
    dispatch({type: 'AUTH_START'});

    try {
      const response = await api.post('/auth/login', credentials);

      // Handle different API response structures
      let user, token;

      if (response.data.data) {
        user = response.data.data.user;
        token = response.data.data.token;
      } else {
        user = response.data.user;
        token = response.data.token;
      }

      if (!user || !token) {
        throw new Error('Invalid response format: missing user or token');
      }

      dispatch({type: 'AUTH_SUCCESS', payload: {user, token}});
    } catch (error: any) {
      console.error('Login error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Login failed. Please check your credentials.';

      dispatch({type: 'AUTH_ERROR', payload: errorMessage});
    }
  };

  const createAdmin = async (adminData: UserRegistrationData) => {
    dispatch({type: 'AUTH_START'});

    try {
      const response = await api.post('/auth/create-user', adminData);

      // Handle different API response structures
      let user, token;

      if (response.data.data) {
        user = response.data.data.user;
        token = response.data.data.token;
      } else {
        user = response.data.user;
        token = response.data.token;
      }

      if (!user || !token) {
        throw new Error('Invalid response format: missing user or token');
      }

      dispatch({type: 'AUTH_SUCCESS', payload: {user, token}});
    } catch (error: any) {
      console.error('Registration error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Registration failed. Please try again.';

      dispatch({type: 'AUTH_ERROR', payload: errorMessage});
    }
  };

  const logout = () => {
    dispatch({type: 'LOGOUT'});
  };

  const clearError = () => {
    dispatch({type: 'CLEAR_ERROR'});
  };

  const value = {state, login, createAdmin, logout, clearError};

  return (
    <AuthContext.Provider value={value}>
      {state.isInitialized ? (
        children
      ) : (
        <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500'></div>
          <p className='ml-4 text-lg font-medium text-gray-900 dark:text-gray-100'>
            Initializing Session...
          </p>
        </div>
      )}
    </AuthContext.Provider>
  );
}

// --- Custom Hook ---
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
