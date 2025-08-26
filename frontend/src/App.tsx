import React from 'react';
import {Toaster} from 'react-hot-toast';
import {Routes, Route, Navigate} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserRegisterPage from './pages/UserRegisterPage';
import UsersPage from './pages/UsersPage';
import CardsPage from './pages/CardsPage';
import PageComponent from './pages/MainPage';
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

const AdminProtectedRoute = ({children}: {children: React.ReactNode}) => {
  const {isAuthenticated, user} = useAuthStore();

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    return <Navigate to='/login' replace />;
  }

  if (user?.role !== 'admin') {
    // If not admin, redirect to home page
    return <Navigate to='/' replace />;
  }

  // If authenticated and admin, render the children
  return children;
};

function App() {
  return (
    <>
      <Toaster position='top-right' />
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
        <Route path='/users' element={<UsersPage />} />
        <Route path='/cards' element={<CardsPage />} />
        <Route
          path='/register'
          element={
            <AdminProtectedRoute>
              <UserRegisterPage />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
