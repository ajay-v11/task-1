import {useState} from 'react';
import {toast} from 'react-hot-toast';
import {Save, X, User, Upload, Image} from 'lucide-react';

type CardFormData = {
  fullName: string;
  title: string;
  location: string;
  companyName: string;
  description: string;
  assignedTo: string;
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

type CardFormProps = {
  initialData?: Partial<CardFormData>;
  onSave: (data: CardFormData, profilePicture?: File) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
};

export default function MainCardForm({
  initialData,
  onSave,
  onCancel,
  mode,
}: CardFormProps) {
  const [formData, setFormData] = useState<CardFormData>({
    fullName: '',
    title: '',
    location: '',
    companyName: '',
    description: '',
    assignedTo: '',
    contact: {
      phone: '',
      email: '',
    },
    socialLinks: {
      instagram: '',
      facebook: '',
      twitter: '',
    },
    services: [''],
    products: [''],
    gallery: [''],
    ...initialData,
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  };

  const handleSocialChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (
    field: 'services' | 'products' | 'gallery',
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field: 'services' | 'products' | 'gallery') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (
    field: 'services' | 'products' | 'gallery',
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (PNG, JPG, or JPEG)');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setProfilePicture(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, profilePicture || undefined);
  };

  return (
    <div className='w-full h-full flex flex-col space-y-4'>
      {/* Form Header */}
      <div className='bg-white rounded-xl shadow-md p-4'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-bold text-gray-900'>
            {mode === 'create' ? 'Create New Card' : 'Edit Card'}
          </h2>
          <button
            onClick={onCancel}
            className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'>
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Profile Picture Upload */}
          <div className='space-y-3'>
            <h3 className='text-md font-semibold text-gray-800 flex items-center gap-2'>
              <Image className='h-4 w-4' />
              Profile Picture
            </h3>

            <div className='flex items-center space-x-4'>
              <div className='relative'>
                <div className='w-24 h-24 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center'>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt='Profile preview'
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <Image className='w-8 h-8 text-gray-400' />
                  )}
                </div>
                <label
                  htmlFor='profilePicture'
                  className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-full'>
                  <Upload className='w-6 h-6 text-white' />
                </label>
              </div>

              <div className='flex-1'>
                <input
                  type='file'
                  id='profilePicture'
                  accept='image/png,image/jpg,image/jpeg'
                  onChange={handleProfilePictureChange}
                  className='hidden'
                />
                <label
                  htmlFor='profilePicture'
                  className='cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
                  <Upload className='w-4 h-4 mr-2' />
                  Upload Image
                </label>
                <p className='text-xs text-gray-500 mt-1'>
                  PNG, JPG, or JPEG up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className='space-y-3'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Full Name *
              </label>
              <input
                type='text'
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Enter full name'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Title *
              </label>
              <input
                type='text'
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Enter job title'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Location *
              </label>
              <input
                type='text'
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Enter location'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Company Name *
              </label>
              <input
                type='text'
                value={formData.companyName}
                onChange={(e) =>
                  handleInputChange('companyName', e.target.value)
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Enter company name'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Enter description'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Assigned To (Email) *
              </label>
              <input
                type='email'
                value={formData.assignedTo}
                onChange={(e) =>
                  handleInputChange('assignedTo', e.target.value)
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Enter user email'
                required
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className='space-y-3'>
            <h3 className='text-md font-semibold text-gray-800 flex items-center gap-2'>
              <User className='h-4 w-4' />
              Contact Information
            </h3>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Phone
              </label>
              <input
                type='tel'
                value={formData.contact.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Enter phone number'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email *
              </label>
              <input
                type='email'
                value={formData.contact.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Enter email address'
                required
              />
            </div>
          </div>

          {/* Social Links */}
          <div className='space-y-3'>
            <h3 className='text-md font-semibold text-gray-800'>
              Social Links
            </h3>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Instagram
              </label>
              <input
                type='url'
                value={formData.socialLinks.instagram}
                onChange={(e) =>
                  handleSocialChange('instagram', e.target.value)
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Enter Instagram URL'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Facebook
              </label>
              <input
                type='url'
                value={formData.socialLinks.facebook}
                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Enter Facebook URL'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Twitter
              </label>
              <input
                type='url'
                value={formData.socialLinks.twitter}
                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Enter Twitter URL'
              />
            </div>
          </div>

          {/* Services */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <h3 className='text-md font-semibold text-gray-800'>Services</h3>
              <button
                type='button'
                onClick={() => addArrayItem('services')}
                className='text-sm text-blue-600 hover:text-blue-700 font-medium'>
                + Add Service
              </button>
            </div>

            {formData.services.map((service, index) => (
              <div key={index} className='flex gap-2'>
                <input
                  type='text'
                  value={service}
                  onChange={(e) =>
                    handleArrayChange('services', index, e.target.value)
                  }
                  className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='Enter service'
                />
                {formData.services.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeArrayItem('services', index)}
                    className='px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors'>
                    <X className='h-4 w-4' />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Products */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <h3 className='text-md font-semibold text-gray-800'>Products</h3>
              <button
                type='button'
                onClick={() => addArrayItem('products')}
                className='text-sm text-blue-600 hover:text-blue-700 font-medium'>
                + Add Product
              </button>
            </div>

            {formData.products.map((product, index) => (
              <div key={index} className='flex gap-2'>
                <input
                  type='text'
                  value={product}
                  onChange={(e) =>
                    handleArrayChange('products', index, e.target.value)
                  }
                  className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='Enter product'
                />
                {formData.products.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeArrayItem('products', index)}
                    className='px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors'>
                    <X className='h-4 w-4' />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Gallery */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <h3 className='text-md font-semibold text-gray-800'>Gallery</h3>
              <button
                type='button'
                onClick={() => addArrayItem('gallery')}
                className='text-sm text-blue-600 hover:text-blue-700 font-medium'>
                + Add Image URL
              </button>
            </div>

            {formData.gallery.map((image, index) => (
              <div key={index} className='flex gap-2'>
                <input
                  type='url'
                  value={image}
                  onChange={(e) =>
                    handleArrayChange('gallery', index, e.target.value)
                  }
                  className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='Enter image URL'
                />
                {formData.gallery.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeArrayItem('gallery', index)}
                    className='px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors'>
                    <X className='h-4 w-4' />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 pt-4'>
            <button
              type='submit'
              className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2'>
              <Save className='h-4 w-4' />
              {mode === 'create' ? 'Create Card' : 'Save Changes'}
            </button>

            <button
              type='button'
              onClick={onCancel}
              className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
