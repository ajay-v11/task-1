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

// Generic API response data (the 'data' property of the response)
// This is the common structure for both login and registration
export interface AuthData {
  user: User;
  token: string;
}

// Generic API response wrapper for success cases
// This now correctly reflects the outer structure of the response
export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T; // The 'data' property is now generic, holding the actual payload
}

// Login API response interface, using the generic wrapper
// It specifies that the 'data' property contains the AuthData
export type LoginResponse = ApiResponse<AuthData>;

// Admin registration API response interface, using the generic wrapper
// It also specifies that the 'data' property contains the AuthData
export type UserRegistrationResponse = ApiResponse<AuthData>;

// Error response interface for API errors
// This one seems correct already as it does not have the 'data' property
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
