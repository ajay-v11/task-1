import React, {useEffect} from 'react';
import {useAuthStore} from './authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({children}: AuthProviderProps) {
  const {checkAuth, isInitialized} = useAuthStore();

  useEffect(() => {
    // Initialize auth on app start
    checkAuth();
  }, [checkAuth]);

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500'></div>
        <p className='ml-4 text-lg font-medium text-gray-900 dark:text-gray-100'>
          Initializing Session...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
