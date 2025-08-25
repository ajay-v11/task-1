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
  Edit,
} from 'lucide-react';
import {useCardData} from '../../hooks/use-card-data';
import NoCardMessage from './Nocard';
import LoadingSpinner from '../LoadingSpinner';

type ProfilePictureType = {
  data: {
    data: number[];
  };
  contentType: string;
};

type CardType = {
  profilePicture?: string | ProfilePictureType;
  fullName: string;
  title: string;
  location: string;
  socialLinks?: {
    gmail?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  company?: {
    name?: string;
    description?: string;
  };
  // Updated to match API response
  companyName?: string;
  description?: string;
  contact?: {
    phone?: string;
    email?: string;
  };
  createdBy?: {
    _id?: string;
  };
  assignedTo?: {
    _id?: string;
  };
};

export default function MainCard() {
  const {myCard, loading, error, userRole} = useCardData() as {
    myCard?: CardType;
    loading: boolean;
    error?: string;
    userRole?: 'admin' | 'manager' | 'user';
  };

  // Handle loading state first
  if (loading) {
    return <LoadingSpinner />;
  }

  // Handle error state
  if (error) {
    return (
      <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center'>
        <p>{error}</p>
      </div>
    );
  }

  // Now, check if myCard exists after loading is complete
  if (!myCard) {
    return userRole ? <NoCardMessage userRole={userRole} /> : null;
  }

  // Permission check logic
  const canEdit =
    userRole === 'admin' ||
    (userRole === 'manager' &&
      myCard.createdBy?._id === myCard.assignedTo?._id) ||
    (userRole === 'user' && myCard.assignedTo?._id === myCard.assignedTo?._id);

  // Convert buffer to base64 for profile image or use string URL
  let profileImageSrc = 'https://via.placeholder.com/150'; // fallback
  if (myCard.profilePicture) {
    if (typeof myCard.profilePicture === 'string') {
      profileImageSrc = myCard.profilePicture;
    } else if (myCard.profilePicture.data) {
      profileImageSrc = `data:${
        myCard.profilePicture.contentType
      };base64,${btoa(
        new Uint8Array(myCard.profilePicture.data.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      )}`;
    }
  }

  // Handle company info - use either nested company object or direct fields
  const companyName = myCard.company?.name || myCard.companyName;
  const companyDescription = myCard.company?.description || myCard.description;

  return (
    <div className='bg-white rounded-2xl shadow-lg overflow-hidden w-full h-full flex flex-col'>
      {/* Background Image */}
      <div
        className='relative h-32 sm:h-40 lg:h-48 bg-cover bg-center bg-gradient-to-r from-blue-500 to-purple-600'
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop)',
        }}>
        {/* Conditional Edit Button */}
        {canEdit && (
          <button className='absolute top-4 right-4 bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors'>
            <Edit className='h-5 w-5 text-gray-600' />
          </button>
        )}
      </div>

      {/* Profile Section */}
      <div className='px-4 sm:px-6 py-4 flex-1 flex flex-col'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-4 sm:space-y-0'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:space-x-4'>
            <div className='relative -mt-2 sm:-mt-1 self-center sm:self-start'>
              <img
                src={profileImageSrc}
                alt={myCard.fullName}
                className='w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-lg object-cover'
              />
            </div>
            <div className='mt-2 sm:mt-0 text-center sm:text-left'>
              <h2 className='text-lg sm:text-xl font-bold text-gray-900'>
                {myCard.fullName}
              </h2>
              <p className='text-gray-600 text-sm sm:text-base'>
                {myCard.title}
              </p>
              <p className='text-xs sm:text-sm text-gray-500'>
                {myCard.location}
              </p>
            </div>
          </div>

          {/* Get in Touch / Follow Buttons */}
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
          {myCard.socialLinks?.gmail && (
            <a
              href={`mailto:${myCard.socialLinks.gmail}`}
              className='p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'>
              <Mail className='h-3 w-3 sm:h-4 sm:w-4' />
            </a>
          )}
          {myCard.socialLinks?.instagram && (
            <a
              href={myCard.socialLinks.instagram}
              className='p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors'>
              <Instagram className='h-3 w-3 sm:h-4 sm:w-4' />
            </a>
          )}
          {myCard.socialLinks?.facebook && (
            <a
              href={myCard.socialLinks.facebook}
              className='p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
              <Facebook className='h-3 w-3 sm:h-4 sm:w-4' />
            </a>
          )}
          {myCard.socialLinks?.twitter && (
            <a
              href={myCard.socialLinks.twitter}
              className='p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors'>
              <Twitter className='h-3 w-3 sm:h-4 sm:w-4' />
            </a>
          )}
        </div>

        {/* Company Info */}
        {(companyName || companyDescription) && (
          <div className='mb-4 sm:mb-6'>
            {companyName && (
              <h3 className='font-bold text-gray-900 mb-2 text-sm sm:text-base'>
                {companyName}
              </h3>
            )}
            {companyDescription && (
              <p className='text-xs sm:text-sm text-gray-600 leading-relaxed'>
                {companyDescription}
              </p>
            )}
          </div>
        )}

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

        {/* Contact Info */}
        <div className='flex-1'>
          <h4 className='font-semibold text-gray-900 mb-3 text-sm sm:text-base'>
            Personal Contact
          </h4>
          <div className='space-y-2'>
            {myCard.contact?.phone && (
              <div className='flex items-center space-x-3'>
                <Phone className='h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0' />
                <span className='text-xs sm:text-sm text-gray-700'>
                  {myCard.contact.phone}
                </span>
              </div>
            )}
            {myCard.contact?.email && (
              <div className='flex items-center space-x-3'>
                <Mail className='h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0' />
                <span className='text-xs sm:text-sm text-gray-700 break-all'>
                  {myCard.contact.email}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
