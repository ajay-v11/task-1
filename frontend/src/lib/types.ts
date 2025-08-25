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

// Generic API response wrapper
export interface ApiResponse {
  success: boolean;
  message: string;
  data?: Date;
}

// Login API response interface
export interface LoginResponse {
  user: User;
  token: string;
}

// Admin registration API response interface
export interface UserRegistrationResponse {
  user: User;
  token: string;
}

// Error response interface for API errors
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
