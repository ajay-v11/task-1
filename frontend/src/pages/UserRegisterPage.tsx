import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuthStore} from '../lib/authStore'; // Changed import
import {
  userRegistrationSchema,
  type UserRegistrationFormData,
} from '../lib/schema';
import {ZodError} from 'zod';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function UserRegisterPage() {
  const navigate = useNavigate();
  // Destructure state and actions from the Zustand store
  const {createAdmin, isLoading, error, isAuthenticated, clearError} =
    useAuthStore();

  const [formData, setFormData] = useState<UserRegistrationFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'user',
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts or form data changes
  useEffect(() => {
    clearError();
    setValidationErrors({});
  }, [formData, clearError]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // REMOVE setIsSubmitting(true);
    setValidationErrors({});

    try {
      const validatedData = userRegistrationSchema.parse(formData);
      await createAdmin(validatedData); // This will no longer throw on API error
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
      // No need to handle API errors here anymore, the store does it.
    }
    // REMOVE the finally block
  };

  return (
    <div className='h-screen flex flex-col'>
      <Navbar />
      <main className='flex-grow flex items-center justify-center px-4'>
        <div className='max-w-md w-full space-y-8'>
          <div>
            <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
              Create New User/Manager
            </h2>
            <p className='mt-2 text-center text-sm text-gray-600'>
              Or{' '}
              <Link
                to='/login'
                className='font-medium text-indigo-600 hover:text-indigo-500'>
                sign in to existing account
              </Link>
            </p>
          </div>

          <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
            <div className='space-y-4'>
              {/* First Name Input */}
              <div>
                <label
                  htmlFor='firstName'
                  className='block text-sm font-medium text-gray-700'>
                  First Name
                </label>
                <input
                  id='firstName'
                  name='firstName'
                  type='text'
                  autoComplete='given-name'
                  required
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    validationErrors.firstName
                      ? 'border-red-300'
                      : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder='First Name'
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                {validationErrors.firstName && (
                  <p className='mt-1 text-sm text-red-600'>
                    {validationErrors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name Input */}
              <div>
                <label
                  htmlFor='lastName'
                  className='block text-sm font-medium text-gray-700'>
                  Last Name
                </label>
                <input
                  id='lastName'
                  name='lastName'
                  type='text'
                  autoComplete='family-name'
                  required
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    validationErrors.lastName
                      ? 'border-red-300'
                      : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder='Last Name'
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                {validationErrors.lastName && (
                  <p className='mt-1 text-sm text-red-600'>
                    {validationErrors.lastName}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'>
                  Email Address
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    validationErrors.email
                      ? 'border-red-300'
                      : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder='Email address'
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                {validationErrors.email && (
                  <p className='mt-1 text-sm text-red-600'>
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700'>
                  Password
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='new-password'
                  required
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    validationErrors.password
                      ? 'border-red-300'
                      : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder='Password (min 6 characters)'
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                {validationErrors.password && (
                  <p className='mt-1 text-sm text-red-600'>
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Role Select */}
              <div>
                <label
                  htmlFor='role'
                  className='block text-sm font-medium text-gray-700'>
                  Role
                </label>
                <select
                  id='role'
                  name='role'
                  required
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    validationErrors.role ? 'border-red-300' : 'border-gray-300'
                  } text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  value={formData.role}
                  onChange={handleInputChange}
                  disabled={isLoading}>
                  <option value='user'>User</option>
                  <option value='admin'>Admin</option>
                  <option value='moderator'>Moderator</option>
                </select>
                {validationErrors.role && (
                  <p className='mt-1 text-sm text-red-600'>
                    {validationErrors.role}
                  </p>
                )}
              </div>
            </div>

            {/* API Error Display */}
            {error && (
              <div className='rounded-md bg-red-50 p-4'>
                <div className='flex'>
                  <div className='ml-3'>
                    <h3 className='text-sm font-medium text-red-800'>
                      Registration failed
                    </h3>
                    <div className='mt-2 text-sm text-red-700'>
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type='submit'
                disabled={isLoading}
                className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'>
                {isLoading ? (
                  <>
                    <svg
                      className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'>
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
