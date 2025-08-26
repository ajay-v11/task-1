import {useState, useEffect} from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import MainCardForm from '../components/Card/Maincardform';
import api from '../lib/api';

interface Card {
  _id: string;
  profilePicture?: string;
  fullName: string;
  title: string;
  description: string;
  contact: {
    email: string;
    phone: string;
  };
  companyName?: string;
  location?: string;
  assignedTo:
    | string
    | {
        _id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        role?: string;
      };
  socialLinks?: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
  services?: string[];
  products?: string[];
  gallery?: string[];
  createdAt: string;
  lastUpdatedAt: string;
}

// Local mirror of the form's expected input type to avoid using 'any'
type CardFormInput = {
  fullName: string;
  title: string;
  location: string;
  companyName: string;
  description: string;
  assignedTo: string; // email string expected by the form
  contact: {
    phone: string;
    email: string;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
  services: string[];
  products: string[];
  gallery: string[];
};

// Helper to construct multipart FormData from form input
const buildFormData = (
  input: CardFormInput,
  profilePicture?: File
): FormData => {
  const formData = new FormData();
  formData.append('fullName', input.fullName);
  formData.append('title', input.title);
  formData.append('location', input.location);
  formData.append('companyName', input.companyName);
  formData.append('description', input.description);
  formData.append('assignedTo', input.assignedTo);
  formData.append('contact', JSON.stringify(input.contact));
  formData.append('socialLinks', JSON.stringify(input.socialLinks));
  formData.append('services', JSON.stringify(input.services));
  formData.append('products', JSON.stringify(input.products));
  formData.append('gallery', JSON.stringify(input.gallery));
  if (profilePicture) {
    formData.append('profilePicture', profilePicture);
  }
  return formData;
};

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/cards');

      if (response.data.success) {
        // The API returns data.data.cards structure
        const cardsData = response.data.data?.cards || response.data.data || [];
        setCards(cardsData);
      } else {
        setError(response.data.message || 'Failed to fetch cards');
      }
    } catch (err: unknown) {
      console.error('Error fetching cards:', err);
      // Handle axios error responses
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as {response?: {data?: {message?: string}}};
        setError(axiosError.response?.data?.message || 'Failed to fetch cards');
      } else {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch cards';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCard = () => {
    setFormMode('create');
    setEditingCard(null);
    setShowForm(true);
  };

  const handleEditCard = (card: Card) => {
    setFormMode('edit');
    setEditingCard(card);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCard(null);
    setFormMode('create');
  };

  const handleSaveCard = async (
    cardData: CardFormInput,
    profilePicture?: File
  ) => {
    try {
      if (formMode === 'create') {
        const formData = buildFormData(cardData, profilePicture);
        // Let Axios set the multipart Content-Type with proper boundary
        const response = await api.post('/cards', formData);

        if (response.data.success) {
          alert('Card created successfully!');
          handleCloseForm();
          fetchCards(); // Refresh the cards list
        } else {
          alert(response.data.message || 'Failed to create card');
        }
      } else {
        // Edit mode
        if (!editingCard) return;

        const formData = buildFormData(cardData, profilePicture);
        // Let Axios set the multipart Content-Type with proper boundary
        const response = await api.put(`/cards/${editingCard._id}`, formData);

        if (response.data.success) {
          alert('Card updated successfully!');
          handleCloseForm();
          fetchCards(); // Refresh the cards list
        } else {
          alert(response.data.message || 'Failed to update card');
        }
      }
    } catch (error: unknown) {
      console.error('Error saving card:', error);
      const message =
        (error as any)?.response?.data?.message ||
        (error instanceof Error ? error.message : 'Failed to save card');
      alert(message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getProfileImageUrl = (card: Card) => {
    if (card.profilePicture) {
      // If profilePicture is already a string (URL), return it
      if (typeof card.profilePicture === 'string') {
        return card.profilePicture;
      }
      // If it's a base64 string, return it directly
      return card.profilePicture;
    }
    return null;
  };

  const getAssignedToDisplay = (assignedTo: Card['assignedTo']) => {
    if (!assignedTo) return '';
    if (typeof assignedTo === 'string') return assignedTo;
    const first = assignedTo.firstName?.trim() || '';
    const last = assignedTo.lastName?.trim() || '';
    const name = `${first} ${last}`.trim();
    return name || assignedTo.email || assignedTo._id;
  };

  // Map a Card (API shape) to the form's initial data shape
  const mapCardToInitial = (card: Card): Partial<CardFormInput> => ({
    fullName: card.fullName || '',
    title: card.title || '',
    location: card.location || '',
    companyName: card.companyName || '',
    description: card.description || '',
    assignedTo:
      typeof card.assignedTo === 'string'
        ? card.assignedTo
        : card.assignedTo?.email || '',
    contact: {
      phone: card.contact?.phone || '',
      email: card.contact?.email || '',
    },
    socialLinks: {
      instagram: card.socialLinks?.instagram || '',
      facebook: card.socialLinks?.facebook || '',
      twitter: card.socialLinks?.twitter || '',
    },
    services: Array.isArray(card.services) && card.services.length
      ? card.services
      : [''],
    products: Array.isArray(card.products) && card.products.length
      ? card.products
      : [''],
    gallery: Array.isArray(card.gallery) && card.gallery.length
      ? card.gallery
      : [''],
  });

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Navbar />
        <div className='flex items-center justify-center min-h-[60vh]'>
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Navbar />
        <div className='flex items-center justify-center min-h-[60vh]'>
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center max-w-md'>
            <p className='font-medium'>Error loading cards</p>
            <p className='text-sm mt-1'>{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8 flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Business Cards</h1>
            <p className='mt-2 text-gray-600'>
              View and manage all business cards in the system
            </p>
          </div>
          <button
            onClick={handleCreateCard}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors'>
            Create New Card
          </button>
        </div>

        {cards.length === 0 ? (
          <div className='bg-white rounded-lg shadow p-8 text-center'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2'
                />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              No cards found
            </h3>
            <p className='text-gray-500'>
              There are no business cards in the system yet.
            </p>
            <button
              onClick={handleCreateCard}
              className='mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors'>
              Create Your First Card
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {cards.map((card) => (
              <div
                key={card._id}
                className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200'>
                {/* Card Header with Profile Picture */}
                <div className='relative h-32 bg-gradient-to-r from-blue-500 to-purple-600'>
                  <div className='absolute -bottom-12 left-6'>
                    <div className='w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white'>
                      {getProfileImageUrl(card) ? (
                        <img
                          src={getProfileImageUrl(card)!}
                          alt={card.fullName}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <div className='w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl'>
                          {card.fullName
                            .split(' ')
                            .map((n) => n.charAt(0))
                            .join('')
                            .toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className='pt-16 px-6 pb-6'>
                  <div className='mb-4'>
                    <h3 className='text-xl font-bold text-gray-900 mb-1'>
                      {card.fullName}
                    </h3>
                    <p className='text-blue-600 font-medium text-sm'>
                      {card.title}
                    </p>
                    {card.companyName && (
                      <p className='text-gray-600 text-sm'>
                        {card.companyName}
                      </p>
                    )}
                    {card.location && (
                      <p className='text-gray-500 text-xs flex items-center mt-1'>
                        <svg
                          className='w-3 h-3 mr-1'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                          />
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                          />
                        </svg>
                        {card.location}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  {card.description && (
                    <div className='mb-4'>
                      <p className='text-gray-700 text-sm line-clamp-3'>
                        {card.description}
                      </p>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className='space-y-2 mb-4'>
                    <div className='flex items-center text-sm text-gray-600'>
                      <svg
                        className='w-4 h-4 mr-2 text-blue-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                        />
                      </svg>
                      <span className='truncate'>{card.contact.email}</span>
                    </div>
                    {card.contact.phone && (
                      <div className='flex items-center text-sm text-gray-600'>
                        <svg
                          className='w-4 h-4 mr-2 text-blue-600'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                          />
                        </svg>
                        <span>{card.contact.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Assigned To */}
                  <div className='mb-4'>
                    <p className='text-xs text-gray-500'>
                      Assigned to:{' '}
                      <span className='font-medium'>
                        {getAssignedToDisplay(card.assignedTo)}
                      </span>
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className='pt-4 border-t border-gray-100'>
                    <div className='flex justify-between items-center text-xs text-gray-500 mb-2'>
                      <span>Created: {formatDate(card.createdAt)}</span>
                      <span>Updated: {formatDate(card.lastUpdatedAt)}</span>
                    </div>
                    <button
                      onClick={() => handleEditCard(card)}
                      className='w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors'>
                      Edit Card
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Card Form Modal */}
      {showForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
            <MainCardForm
              initialData={editingCard ? mapCardToInitial(editingCard) : undefined}
              onSave={handleSaveCard}
              onCancel={handleCloseForm}
              mode={formMode}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
