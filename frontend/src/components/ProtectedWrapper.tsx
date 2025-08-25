import {Navigate} from 'react-router-dom';
import {useAuthStore} from '../lib/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({children}: ProtectedRouteProps) {
  const {isAuthenticated, isLoading} = useAuthStore();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500'></div>
        <p className='ml-4 text-lg font-medium'>Authenticating...</p>
      </div>
    );
  }

  // If not authenticated (and no longer loading), redirect to the login page.
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  // If authenticated, render the child components (the protected content).
  return children;
}
