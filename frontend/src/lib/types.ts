// types/types.ts

// User interface based on backend User model
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'manager';
  createdAt: string;
  updatedAt: string;
}

// Card interface
export type Card = {
  _id: string;
  profilePicture?: string;
  fullName: string;
  title: string;
  location: string;
  companyName: string;
  description: string;
  contact: {
    phone?: string;
    email: string;
  };
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  services?: string[];
  products?: string[];
  gallery?: string[];
  assignedTo: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  lastUpdatedAt: string;
  createdAt: string;
};

// Login form data interface
export interface LoginCredentials {
  email: string;
  password: string;
}

// Admin registration form data interface
export interface UserRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'manager';
}

// Auth data that comes back from login/register
export interface AuthData {
  user: User;
  token: string;
}

// Generic API response wrapper for success cases
export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

// Login API response
export type LoginResponse = ApiResponse<AuthData>;

// Registration API response
export type UserRegistrationResponse = ApiResponse<AuthData>;

// Error response interface - simplified to match actual usage
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
