import {Routes, Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserRegisterPage from './pages/UserRegisterPage';
import PageComponent from './pages/MainPage';
import ProtectedRoute from './components/ProtectedWrapper';
import {useAuthStore} from './lib/authStore';
import {useEffect} from 'react';
import ProfilePage from './pages/ProfilePage';

function App() {
  const {initializeAuth} = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <>
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
    </>
  );
}

export default App;
