// src/App.tsx
import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserRegisterPage from './pages/UserRegisterPage';
import PageComponent from './pages/MainPage';
import ProfilePage from './pages/ProfilePage';
import {useAuthStore} from './lib/authStore';

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
  const {isAuthenticated} = useAuthStore();

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    return <Navigate to='/login' replace />;
  }

  // If authenticated, render the children (the protected page)
  return children;
};

function App() {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <PageComponent />
          </ProtectedRoute>
        }
      />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<UserRegisterPage />} />
      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
