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
    <div className=' rounded-2xl shadow-lg overflow-hidden max-w-2xl w-full'>
      {/* Background Image */}
      <div
        className='relative h-48 bg-cover bg-center'
        style={{backgroundImage: 'url(/gr.png)'}}>
      </div>

      {/* Profile Section */}
      <div className='px-6 py-4'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-center space-x-4'>
            <div className='relative -mt-12'>
              <img
                src={profileData.profileImage || '/user.jpeg'}
                alt={profileData.name}
                className='w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover'
              />
            </div>
            <div className='mt-2'>
              <h2 className='text-xl font-bold text-gray-900'>
                {profileData.name}
              </h2>
              <p className='text-gray-600'>{profileData.title}</p>
              <p className='text-sm text-gray-500'>{profileData.location}</p>
            </div>
          </div>

          <div className='flex space-x-2 mt-2'>
            <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors'>
              <span>Get in Touch</span>
              <Send className='h-4 w-4' />
            </button>
            <button className='border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors'>
              Follow
            </button>
          </div>
        </div>

        {/* Social Icons */}
        <div className='flex space-x-3 mb-6'>
          <a
            href={profileData.socialLinks.gmail}
            className='p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'>
            <Mail className='h-4 w-4' />
          </a>
          <a
            href={profileData.socialLinks.instagram}
            className='p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors'>
            <Instagram className='h-4 w-4' />
          </a>
          <a
            href={profileData.socialLinks.facebook}
            className='p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
            <Facebook className='h-4 w-4' />
          </a>
          <a
            href={profileData.socialLinks.twitter}
            className='p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors'>
            <Twitter className='h-4 w-4' />
          </a>
        </div>

        {/* Company Info */}
        <div className='mb-6'>
          <h3 className='font-bold text-gray-900 mb-2'>
            {profileData.company.name}
          </h3>
          <p className='text-sm text-gray-600 leading-relaxed'>
            {profileData.company.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2 mb-6'>
          <button className='flex items-center justify-center space-x-2 border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm transition-colors'>
            <Share className='h-4 w-4' />
            <span>Share</span>
          </button>
          <button className='flex items-center justify-center space-x-2 border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm transition-colors'>
            <QrCode className='h-4 w-4' />
            <span>QR</span>
          </button>
          <button className='flex items-center justify-center space-x-2 border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm transition-colors'>
            <Send className='h-4 w-4' />
            <span>Send My Card</span>
          </button>
          <button className='flex items-center justify-center space-x-2 border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm transition-colors'>
            <Save className='h-4 w-4' />
            <span>Save contact</span>
          </button>
        </div>

        {/* Tabs */}
        <div className='border-b border-gray-200 mb-4'>
          <nav className='flex space-x-8'>
            <button className='border-b-2 border-blue-600 text-blue-600 py-2 px-1 text-sm font-medium'>
              Contact
            </button>
            <button className='text-gray-500 hover:text-gray-700 py-2 px-1 text-sm font-medium'>
              Services
            </button>
            <button className='text-gray-500 hover:text-gray-700 py-2 px-1 text-sm font-medium'>
              Products
            </button>
            <button className='text-gray-500 hover:text-gray-700 py-2 px-1 text-sm font-medium'>
              Gallery
            </button>
          </nav>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className='font-semibold text-gray-900 mb-3'>Personal Contact</h4>
          <div className='space-y-2'>
            <div className='flex items-center space-x-3'>
              <Phone className='h-4 w-4 text-blue-600' />
              <span className='text-sm text-gray-700'>
                {profileData.contact.phone}
              </span>
            </div>
            <div className='flex items-center space-x-3'>
              <Mail className='h-4 w-4 text-blue-600' />
              <span className='text-sm text-gray-700'>
                {profileData.contact.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
