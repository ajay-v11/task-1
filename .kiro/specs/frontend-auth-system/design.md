# Design Document

## Overview

The frontend authentication system will be built using React with TypeScript, integrating with the existing backend API endpoints. The system will use Zustand for global state management, Zod for validation, React Router for navigation, Axios for HTTP requests, and Tailwind CSS for styling. The architecture follows modern React patterns with a focus on simplicity and maintainability.

## Architecture

### Core Components

- **Authentication Pages**: Login and Admin Registration components
- **Global State Management**: Zustand store for authentication state
- **HTTP Client**: Configured Axios instance with automatic token handling
- **Route Protection**: Conditional rendering based on authentication status
- **Form Validation**: Zod schemas for client-side validation

### File Structure

```
frontend/src/
├── lib/
│   ├── authStore.ts          # Zustand authentication store
│   ├── types.ts              # TypeScript type definitions
│   ├── schema.ts             # Zod validation schemas
│   └── api.ts                # Axios configuration and API client
├── components/
│   ├── Login.tsx             # Login form component (existing)
│   ├── Register.tsx          # Admin registration component (existing)
│   └── ProtectedRoute.tsx    # Route protection wrapper
├── pages/
│   ├── LoginPage.tsx         # Login page container
│   └── AdminRegisterPage.tsx # Admin registration page
└── App.tsx                   # Main app with routing logic
```

## Components and Interfaces

### Authentication Store (Zustand)

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  createAdmin: (adminData: AdminRegistrationData) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
}
```

### User Types

```typescript
interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'manager';
  createdAt: string;
  updatedAt: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AdminRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  secretPassword: string;
}
```

### API Response Types

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

interface LoginResponse {
  user: User;
  token: string;
}
```

## Data Models

### Validation Schemas (Zod)

```typescript
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const adminRegistrationSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  secretPassword: z.string().min(1, 'Secret password is required'),
});
```

### Local Storage Management

- **Token Storage**: JWT token stored in localStorage with key 'auth_token'
- **User Data**: User information stored in Zustand state (not localStorage for security)
- **Session Persistence**: Token validation on app initialization

## Error Handling

### Client-Side Validation

- Form validation using Zod schemas before API calls
- Real-time validation feedback on form fields
- Display validation errors inline with form fields

### API Error Handling

- Axios interceptors for global error handling
- Automatic logout on 401 Unauthorized responses
- User-friendly error messages for common scenarios:
  - Network connectivity issues
  - Invalid credentials
  - Server errors
  - Validation errors from backend

### Error Display Strategy

- Toast notifications for global errors
- Inline error messages for form validation
- Loading states during API requests
- Graceful fallbacks for failed operations

## Testing Strategy

### Component Testing

- Unit tests for authentication store actions
- Component tests for login and registration forms
- Integration tests for authentication flow
- Mock API responses for consistent testing

### Validation Testing

- Test Zod schema validation with various input combinations
- Test form submission with valid and invalid data
- Test error message display and formatting

### Authentication Flow Testing

- Test login flow with valid credentials
- Test login flow with invalid credentials
- Test admin registration with correct secret password
- Test admin registration with incorrect secret password
- Test logout functionality
- Test session persistence across browser refreshes
- Test automatic logout on token expiration

### Route Protection Testing

- Test access to protected routes when authenticated
- Test redirect to login when not authenticated
- Test role-based content rendering
- Test navigation behavior for different user roles

## Implementation Details

### Axios Configuration

- Base URL configuration pointing to backend API
- Request interceptors to automatically add Authorization headers
- Response interceptors for global error handling and token refresh logic
- Timeout configuration for API requests

### Zustand Store Implementation

- Persistent state management with localStorage integration
- Async actions for API calls with proper error handling
- State updates for loading states during API operations
- Automatic token cleanup on logout

### React Router Integration

- Protected route wrapper component
- Conditional rendering based on authentication status
- Automatic redirects for authenticated/unauthenticated users
- Role-based route access control

### UI/UX Considerations

- Responsive design using Tailwind CSS
- Loading indicators during authentication operations
- Clear error messaging and validation feedback
- Consistent styling with existing application design
- Accessibility considerations for form elements

### Security Considerations

- JWT token stored securely in localStorage
- Automatic token cleanup on logout
- No sensitive data stored in localStorage
- Proper error handling to prevent information leakage
- Client-side validation as first line of defense (server validation is primary)
