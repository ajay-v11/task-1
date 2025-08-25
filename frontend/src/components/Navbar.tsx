import {Menu} from 'lucide-react';

export default function Navbar() {
  return (
    <nav className='bg-white shadow-sm border-b border-gray-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <h1 className='text-2xl font-bold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
              CONNECTREE
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-8'>
              <a
                href='#'
                className='text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium'>
                Home
              </a>
              <a
                href='#'
                className='text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium'>
                About
              </a>
              <a
                href='#'
                className='text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium'>
                Free-Listing
              </a>
              <a
                href='#'
                className='text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium'>
                Business
              </a>
              <a
                href='#'
                className='text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium'>
                IT
              </a>
              <a
                href='#'
                className='text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium'>
                Jobs
              </a>
            </div>
          </div>

          {/* Login Button */}
          <div className='flex items-center space-x-4'>
            <button className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors'>
              Login
            </button>

            {/* Mobile menu button */}
            <div className='md:hidden'>
              <button className='text-gray-700 hover:text-gray-900'>
                <Menu className='h-6 w-6' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
