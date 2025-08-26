import {useState} from 'react'; // Keep useState
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
  Plus,
} from 'lucide-react';
import {useCardData} from '../../hooks/use-card-data';
import NoCardMessage from './Nocard';
import LoadingSpinner from '../LoadingSpinner';
import QrModal from './Qrmodal';

// Type definitions remain the same
type ProfilePictureType = {
  data: {
    data: number[];
  };
  contentType: string;
};

type CardType = {
  _id?: string; // Add ID for potential future use
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
  // Add optional fields for new tabs
  services?: string[];
  products?: string[];
  gallery?: string[];
};

// Define the type for our tabs
type Tab = 'contact' | 'services' | 'products' | 'gallery';

export default function MainCard({
  onEdit,
  onCreate,
}: {
  onEdit: () => void;
  onCreate: () => void;
}) {
  const {myCard, loading, error, userRole} = useCardData() as {
    myCard?: CardType;
    loading: boolean;
    error?: string;
    userRole?: 'admin' | 'manager' | 'user';
  };

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  // 1. Add state for the active tab
  const [activeTab, setActiveTab] = useState<Tab>('contact');

  // Loading, error, and no card checks remain the same
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center'>
        <p>{error}</p>
      </div>
    );
  }

  if (!myCard) {
    return userRole ? <NoCardMessage userRole={userRole} /> : null;
  }

  // 2. Add the contact download function
  const handleDownloadVcf = () => {
    // vCard (VCF) format string
    const vcfContent = `BEGIN:VCARD
VERSION:3.0
FN:${myCard.fullName}
TITLE:${myCard.title}
ORG:${myCard.company?.name || myCard.companyName || ''}
TEL;TYPE=CELL:${myCard.contact?.phone || ''}
EMAIL:${myCard.contact?.email || ''}
END:VCARD`;

    // Create a Blob to hold the vCard data
    const blob = new Blob([vcfContent], {type: 'text/vcard;charset=utf-8'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const sanitizedName = myCard.fullName.replace(/\s+/g, '_');
    link.download = `${sanitizedName}_contact.vcf`;

    // Append to body, click, and then remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  // Helper component for rendering tab content
  const TabContent = () => {
    switch (activeTab) {
      case 'contact':
        return (
          <div>
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
              {!myCard.contact?.phone && !myCard.contact?.email && (
                <p className='text-xs sm:text-sm text-gray-500'>
                  No contact information available.
                </p>
              )}
            </div>
          </div>
        );
      case 'services':
        return (
          <div>
            <h4 className='font-semibold text-gray-900 mb-3 text-sm sm:text-base'>
              Our Services
            </h4>
            {myCard.services?.length ? (
              <ul className='list-disc list-inside text-gray-700 text-sm space-y-1'>
                {myCard.services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            ) : (
              <p className='text-xs sm:text-sm text-gray-500'>
                No services listed.
              </p>
            )}
          </div>
        );
      case 'products':
        return (
          <div>
            <h4 className='font-semibold text-gray-900 mb-3 text-sm sm:text-base'>
              Our Products
            </h4>
            {myCard.products?.length ? (
              <ul className='list-disc list-inside text-gray-700 text-sm space-y-1'>
                {myCard.products.map((product, index) => (
                  <li key={index}>{product}</li>
                ))}
              </ul>
            ) : (
              <p className='text-xs sm:text-sm text-gray-500'>
                No products listed.
              </p>
            )}
          </div>
        );
      case 'gallery':
        return (
          <div>
            <h4 className='font-semibold text-gray-900 mb-3 text-sm sm:text-base'>
              Gallery
            </h4>
            {myCard.gallery?.length ? (
              <div className='grid grid-cols-3 gap-2'>
                {myCard.gallery.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`gallery item ${index + 1}`}
                    className='w-full h-20 object-cover rounded-md'
                  />
                ))}
              </div>
            ) : (
              <p className='text-xs sm:text-sm text-gray-500'>
                No gallery items available.
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const canEdit =
    userRole === 'admin' ||
    (userRole === 'manager' &&
      myCard.createdBy?._id === myCard.assignedTo?._id) ||
    (userRole === 'user' && myCard.assignedTo?._id === myCard.assignedTo?._id);

  let profileImageSrc = 'https://via.placeholder.com/150';
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

  const companyName = myCard.company?.name || myCard.companyName;
  const companyDescription = myCard.company?.description || myCard.description;

  return (
    <>
      <div className='bg-white rounded-2xl shadow-lg overflow-hidden w-full h-full flex flex-col'>
        {/* ---- The top part of the card remains unchanged ---- */}
        <div
          className='relative h-32 sm:h-40 lg:h-48 bg-cover bg-center bg-gradient-to-r from-blue-500 to-purple-600'
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop)',
          }}>
          <div className='absolute top-4 right-4 flex gap-2'>
            {canEdit && (
              <button
                onClick={onEdit}
                className='bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors'>
                <Edit className='h-5 w-5 text-gray-600' />
              </button>
            )}
            <button
              onClick={onCreate}
              className='bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors'>
              <Plus className='h-5 w-5 text-gray-600' />
            </button>
          </div>
        </div>
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
            <div className='flex space-x-2 justify-center sm:justify-start'>
              <button className='bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-1 sm:space-x-2 transition-colors'>
                {' '}
                <span>Get in Touch</span>{' '}
                <Send className='h-3 w-3 sm:h-4 sm:w-4' />{' '}
              </button>
              <button className='border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors'>
                Follow
              </button>
            </div>
          </div>
          <div className='flex justify-center sm:justify-start space-x-3 mb-4 sm:mb-6'>
            {myCard.socialLinks?.gmail && (
              <a
                href={`mailto:${myCard.socialLinks.gmail}`}
                className='p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'>
                {' '}
                <Mail className='h-3 w-3 sm:h-4 sm:w-4' />{' '}
              </a>
            )}
            {myCard.socialLinks?.instagram && (
              <a
                href={myCard.socialLinks.instagram}
                className='p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors'>
                {' '}
                <Instagram className='h-3 w-3 sm:h-4 sm:w-4' />{' '}
              </a>
            )}
            {myCard.socialLinks?.facebook && (
              <a
                href={myCard.socialLinks.facebook}
                className='p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                {' '}
                <Facebook className='h-3 w-3 sm:h-4 sm:w-4' />{' '}
              </a>
            )}
            {myCard.socialLinks?.twitter && (
              <a
                href={myCard.socialLinks.twitter}
                className='p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors'>
                {' '}
                <Twitter className='h-3 w-3 sm:h-4 sm:w-4' />{' '}
              </a>
            )}
          </div>
          {(companyName || companyDescription) && (
            <div className='mb-4 sm:mb-6'>
              {' '}
              {companyName && (
                <h3 className='font-bold text-gray-900 mb-2 text-sm sm:text-base'>
                  {companyName}
                </h3>
              )}{' '}
              {companyDescription && (
                <p className='text-xs sm:text-sm text-gray-600 leading-relaxed'>
                  {companyDescription}
                </p>
              )}{' '}
            </div>
          )}

          <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 sm:mb-6'>
            <button className='flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1 border border-gray-300 hover:bg-gray-50 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors'>
              {' '}
              <Share className='h-3 w-3 sm:h-4 sm:w-4' /> <span>Share</span>{' '}
            </button>
            <button
              onClick={() => setIsQrModalOpen(true)}
              className='flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1 border border-gray-300 hover:bg-gray-50 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors'>
              {' '}
              <QrCode className='h-3 w-3 sm:h-4 sm:w-4' /> <span>QR</span>{' '}
            </button>
            <button className='flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1 border border-gray-300 hover:bg-gray-50 px-1 sm:px-2 py-2 rounded-lg text-xs transition-colors'>
              {' '}
              <Send className='h-3 w-3 sm:h-4 sm:w-4' />{' '}
              <span className='text-center'>Send Card</span>{' '}
            </button>
            {/* 3. Attach the download function to the Save button's onClick event */}
            <button
              onClick={handleDownloadVcf}
              className='flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1 border border-gray-300 hover:bg-gray-50 px-1 sm:px-2 py-2 rounded-lg text-xs transition-colors'>
              {' '}
              <Save className='h-3 w-3 sm:h-4 sm:w-4' />{' '}
              <span className='text-center'>Save</span>{' '}
            </button>
          </div>

          {/* 4. TABS SECTION: Updated with click handlers and conditional styling */}
          <div className='border-b border-gray-200 mb-4'>
            <nav className='flex space-x-4 sm:space-x-8 overflow-x-auto'>
              <button
                onClick={() => setActiveTab('contact')}
                className={`py-2 px-1 text-xs sm:text-sm font-medium whitespace-nowrap ${
                  activeTab === 'contact'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                Contact
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`py-2 px-1 text-xs sm:text-sm font-medium whitespace-nowrap ${
                  activeTab === 'services'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                Services
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-1 text-xs sm:text-sm font-medium whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                Products
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`py-2 px-1 text-xs sm:text-sm font-medium whitespace-nowrap ${
                  activeTab === 'gallery'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                Gallery
              </button>
            </nav>
          </div>

          {/* 5. TAB CONTENT: Renders content based on the active tab */}
          <div className='flex-1'>
            <TabContent />
          </div>
        </div>
      </div>
      {isQrModalOpen && (
        <QrModal
          cardData={myCard}
          profileImageSrc={profileImageSrc}
          onClose={() => setIsQrModalOpen(false)}
        />
      )}
    </>
  );
}
