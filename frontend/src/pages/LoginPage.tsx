import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {loginSchema, type LoginFormData} from '../lib/schema';
import {ZodError} from 'zod';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {useAuth} from '../lib/authContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const {state, login, clearError} = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Redirect if already authenticated
  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/', {replace: true});
    }
  }, [state.isAuthenticated, navigate]);

  // Clear errors on mount
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear global error when user starts typing
    if (state.error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear all errors
    setValidationErrors({});
    clearError();

    try {
      // Validate form data
      const validatedData = loginSchema.parse(formData);

      // Attempt login
      await login(validatedData);

      // Navigation will be handled by the useEffect above
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            errors[issue.path[0] as string] = issue.message;
          }
        });
        setValidationErrors(errors);
      }
      // API errors are handled by the auth context
    }
  };

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Navbar />
      <main className='flex-grow flex items-center justify-center px-4'>
        <div className='max-w-md w-full bg-white rounded-lg shadow-md p-6'>
          <h1 className='text-2xl font-bold text-center text-gray-900 mb-6'>
            Sign In
          </h1>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Email Field */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Email Address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                  validationErrors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder='Enter your email'
                disabled={state.isLoading}
              />
              {validationErrors.email && (
                <p className='mt-1 text-sm text-red-600'>
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                  validationErrors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder='Enter your password'
                disabled={state.isLoading}
              />
              {validationErrors.password && (
                <p className='mt-1 text-sm text-red-600'>
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* API Error Display */}
            {state.error && (
              <div className='bg-red-50 border border-red-200 rounded-md p-3'>
                <p className='text-sm text-red-800'>{state.error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={state.isLoading}
              className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200'>
              {state.isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className='text-blue-600 hover:text-blue-500 font-medium'>
                Sign up
              </button>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
