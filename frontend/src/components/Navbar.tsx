import {Menu, User, LogOut} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {useAuthStore} from '../lib/authStore'; // Changed import

export default function Navbar() {
  const navigate = useNavigate();
  // Destructure state and actions from the Zustand store
  const {isAuthenticated, user, logout} = useAuthStore();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  // Helper function to get display name
  const getDisplayName = () => {
    if (!user) return 'Profile';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    // Return first name if available, otherwise the full name.
    return firstName || `${firstName} ${lastName}`.trim() || 'Profile';
  };

  // Helper function for full name with role
  const getFullNameWithRole = () => {
    if (!user) return 'Profile';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'User';
    const role = user.role || 'user';
    return `${fullName} (${role})`;
  };

  return (
    <nav className='bg-white shadow-sm border-b border-gray-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div
            className='flex-shrink-0 cursor-pointer'
            onClick={() => navigate('/')}>
            <h1 className='text-2xl font-bold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
              CONNECTREE
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-8'>
              <button
                onClick={() => navigate('/')}
                className='text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors'>
                Home
              </button>
              <a
                href='#'
                className='text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors'>
                About
              </a>
              <a
                href='#'
                className='text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors'>
                Free-Listing
              </a>
              <a
                href='#'
                className='text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors'>
                Business
              </a>
              {/* Conditional rendering based on store state */}
              {isAuthenticated && user?.role === 'admin' && (
                <button
                  onClick={() => navigate('/register')}
                  className='text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors'>
                  Register
                </button>
              )}
            </div>
          </div>

          {/* Auth Actions */}
          <div className='flex items-center space-x-4'>
            {isAuthenticated && user ? (
              // Authenticated user actions
              <>
                {/* Profile Button */}
                <button
                  onClick={handleProfile}
                  className='flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors'
                  title={getFullNameWithRole()}>
                  <User className='h-5 w-5' />
                  <div className='hidden sm:block text-sm'>
                    <span className='font-medium'>{getDisplayName()}</span>
                    <span className='ml-1 text-xs text-gray-500 capitalize'>
                      ({user.role})
                    </span>
                  </div>
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className='flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors'
                  title='Logout'>
                  <LogOut className='h-4 w-4' />
                  <span className='hidden sm:block'>Logout</span>
                </button>
              </>
            ) : (
              // Non-authenticated user actions
              <button
                onClick={handleLogin}
                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors'>
                Login
              </button>
            )}

            {/* Mobile menu button */}
            <div className='md:hidden'>
              <button className='text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors'>
                <Menu className='h-6 w-6' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
