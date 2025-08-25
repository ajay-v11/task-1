import {
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Share,
  QrCode,
  Send,
  Save,
  Phone,
} from 'lucide-react';
import {useProfileData} from '../../hooks/use-profile-data';

export default function MainCard() {
  const {profileData} = useProfileData();

  return (
    <div className='bg-white rounded-2xl shadow-lg overflow-hidden w-full h-full flex flex-col'>
      {/* Background Image */}
      <div
        className='relative h-32 sm:h-40 lg:h-48 bg-cover bg-center bg-gradient-to-r from-blue-500 to-purple-600'
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop)',
        }}></div>

      {/* Profile Section */}
      <div className='px-4 sm:px-6 py-4 flex-1 flex flex-col'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-4 sm:space-y-0'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:space-x-4'>
            <div className='relative -mt-2 sm:-mt-1 self-center sm:self-start'>
              <img
                src={profileData.profileImage}
                alt={profileData.name}
                className='w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-lg object-cover'
              />
            </div>
            <div className='mt-2 sm:mt-0 text-center sm:text-left'>
              <h2 className='text-lg sm:text-xl font-bold text-gray-900'>
                {profileData.name}
              </h2>
              <p className='text-gray-600 text-sm sm:text-base'>
                {profileData.title}
              </p>
              <p className='text-xs sm:text-sm text-gray-500'>
                {profileData.location}
              </p>
            </div>
          </div>

          <div className='flex space-x-2 justify-center sm:justify-start'>
            <button className='bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-1 sm:space-x-2 transition-colors'>
              <span>Get in Touch</span>
              <Send className='h-3 w-3 sm:h-4 sm:w-4' />
            </button>
            <button className='border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors'>
              Follow
            </button>
          </div>
        </div>

        {/* Social Icons */}
        <div className='flex justify-center sm:justify-start space-x-3 mb-4 sm:mb-6'>
          <a
            href={profileData.socialLinks.gmail}
            className='p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'>
            <Mail className='h-3 w-3 sm:h-4 sm:w-4' />
          </a>
          <a
            href={profileData.socialLinks.instagram}
            className='p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors'>
            <Instagram className='h-3 w-3 sm:h-4 sm:w-4' />
          </a>
          <a
            href={profileData.socialLinks.facebook}
            className='p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
            <Facebook className='h-3 w-3 sm:h-4 sm:w-4' />
          </a>
          <a
            href={profileData.socialLinks.twitter}
            className='p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors'>
            <Twitter className='h-3 w-3 sm:h-4 sm:w-4' />
          </a>
        </div>

        {/* Company Info */}
        <div className='mb-4 sm:mb-6'>
          <h3 className='font-bold text-gray-900 mb-2 text-sm sm:text-base'>
            {profileData.company.name}
          </h3>
          <p className='text-xs sm:text-sm text-gray-600 leading-relaxed'>
            {profileData.company.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 sm:mb-6'>
          <button className='flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1 border border-gray-300 hover:bg-gray-50 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors'>
            <Share className='h-3 w-3 sm:h-4 sm:w-4' />
            <span>Share</span>
          </button>
          <button className='flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1 border border-gray-300 hover:bg-gray-50 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors'>
            <QrCode className='h-3 w-3 sm:h-4 sm:w-4' />
            <span>QR</span>
          </button>
          <button className='flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1 border border-gray-300 hover:bg-gray-50 px-1 sm:px-2 py-2 rounded-lg text-xs transition-colors'>
            <Send className='h-3 w-3 sm:h-4 sm:w-4' />
            <span className='text-center'>Send Card</span>
          </button>
          <button className='flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1 border border-gray-300 hover:bg-gray-50 px-1 sm:px-2 py-2 rounded-lg text-xs transition-colors'>
            <Save className='h-3 w-3 sm:h-4 sm:w-4' />
            <span className='text-center'>Save</span>
          </button>
        </div>

        {/* Tabs */}
        <div className='border-b border-gray-200 mb-4'>
          <nav className='flex space-x-4 sm:space-x-8 overflow-x-auto'>
            <button className='border-b-2 border-blue-600 text-blue-600 py-2 px-1 text-xs sm:text-sm font-medium whitespace-nowrap'>
              Contact
            </button>
            <button className='text-gray-500 hover:text-gray-700 py-2 px-1 text-xs sm:text-sm font-medium whitespace-nowrap'>
              Services
            </button>
            <button className='text-gray-500 hover:text-gray-700 py-2 px-1 text-xs sm:text-sm font-medium whitespace-nowrap'>
              Products
            </button>
            <button className='text-gray-500 hover:text-gray-700 py-2 px-1 text-xs sm:text-sm font-medium whitespace-nowrap'>
              Gallery
            </button>
          </nav>
        </div>

        {/* Contact Info - This will expand to fill remaining space */}
        <div className='flex-1'>
          <h4 className='font-semibold text-gray-900 mb-3 text-sm sm:text-base'>
            Personal Contact
          </h4>
          <div className='space-y-2'>
            <div className='flex items-center space-x-3'>
              <Phone className='h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0' />
              <span className='text-xs sm:text-sm text-gray-700'>
                {profileData.contact.phone}
              </span>
            </div>
            <div className='flex items-center space-x-3'>
              <Mail className='h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0' />
              <span className='text-xs sm:text-sm text-gray-700 break-all'>
                {profileData.contact.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
