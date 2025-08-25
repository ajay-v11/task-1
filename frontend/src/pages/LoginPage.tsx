import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuthStore} from '../lib/authStore';
import {loginSchema, type LoginFormData} from '../lib/schema';
import {ZodError} from 'zod';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LoginPage() {
  const navigate = useNavigate();
  const {login, isLoading, error, isAuthenticated, clearError} = useAuthStore();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  // Clear errors on mount or form change
  useEffect(() => {
    clearError();
    setValidationErrors({});
  }, [formData, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationErrors({});

    try {
      const validatedData = loginSchema.parse(formData);
      await login(validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) errors[issue.path[0] as string] = issue.message;
        });
        setValidationErrors(errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      {/* NAVBAR */}
      <Navbar />

      {/* LOGIN CARD */}
      <main className='flex-grow flex items-center justify-center px-4'>
        <div className='max-w-md w-full bg-white rounded-2xl shadow-lg p-8'>
          <h2 className='text-center text-2xl font-bold text-gray-800 mb-6'>
            Sign in to your account
          </h2>

          <form className='space-y-5' onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor='email' className='sr-only'>
                Email address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                className={`w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.email ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder='Email address'
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading || isSubmitting}
              />
              {validationErrors.email && (
                <p className='mt-1 text-sm text-red-600'>
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                className={`w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.password
                    ? 'border-red-400'
                    : 'border-gray-300'
                }`}
                placeholder='Password'
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading || isSubmitting}
              />
              {validationErrors.password && (
                <p className='mt-1 text-sm text-red-600'>
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* API error */}
            {error && (
              <div className='rounded-lg bg-red-50 p-3 text-red-700 text-sm'>
                <strong>Login failed:</strong> {error}
              </div>
            )}

            {/* Submit */}
            <button
              type='submit'
              disabled={isLoading || isSubmitting}
              className='w-full flex justify-center items-center py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'>
              {isLoading || isSubmitting ? (
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
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 
                         3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
