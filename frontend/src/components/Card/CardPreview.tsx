import { Eye, Edit } from 'lucide-react';

type CardPreviewData = {
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

type CardPreviewProps = {
  data: CardPreviewData;
  onEdit: () => void;
};

export default function CardPreview({ data, onEdit }: CardPreviewProps) {
  return (
    <div className="w-full h-full flex flex-col space-y-4">
      {/* Preview Header */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Card Preview
          </h2>
          <button
            onClick={onEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
        </div>
      </div>

      {/* Card Preview */}
      <div className="bg-white rounded-xl shadow-md p-4 flex-1">
        <div className="space-y-4">
          {/* Header Section */}
          <div className="text-center border-b border-gray-200 pb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {data.fullName || 'Full Name'}
            </h3>
            <p className="text-gray-600 text-sm mb-1">
              {data.title || 'Job Title'}
            </p>
            <p className="text-gray-500 text-xs">
              {data.location || 'Location'}
            </p>
          </div>

          {/* Company Section */}
          {data.companyName && (
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-semibold text-gray-800 text-sm mb-2">
                {data.companyName}
              </h4>
              {data.description && (
                <p className="text-gray-600 text-xs leading-relaxed">
                  {data.description}
                </p>
              )}
            </div>
          )}

          {/* Contact Section */}
          {(data.contact.phone || data.contact.email) && (
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-semibold text-gray-800 text-sm mb-2">Contact</h4>
              {data.contact.phone && (
                <p className="text-gray-600 text-xs mb-1">📱 {data.contact.phone}</p>
              )}
              {data.contact.email && (
                <p className="text-gray-600 text-xs">✉️ {data.contact.email}</p>
              )}
            </div>
          )}

          {/* Social Links */}
          {(data.socialLinks.instagram || data.socialLinks.facebook || data.socialLinks.twitter) && (
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-semibold text-gray-800 text-sm mb-2">Social Links</h4>
              <div className="flex gap-2">
                {data.socialLinks.instagram && (
                  <span className="text-blue-600 text-xs">Instagram</span>
                )}
                {data.socialLinks.facebook && (
                  <span className="text-blue-600 text-xs">Facebook</span>
                )}
                {data.socialLinks.twitter && (
                  <span className="text-blue-600 text-xs">Twitter</span>
                )}
              </div>
            </div>
          )}

          {/* Services */}
          {data.services.filter(s => s.trim()).length > 0 && (
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-semibold text-gray-800 text-sm mb-2">Services</h4>
              <ul className="text-gray-600 text-xs space-y-1">
                {data.services.filter(s => s.trim()).map((service, index) => (
                  <li key={index}>• {service}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Products */}
          {data.products.filter(p => p.trim()).length > 0 && (
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-semibold text-gray-800 text-sm mb-2">Products</h4>
              <ul className="text-gray-600 text-xs space-y-1">
                {data.products.filter(p => p.trim()).map((product, index) => (
                  <li key={index}>• {product}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Gallery */}
          {data.gallery.filter(g => g.trim()).length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 text-sm mb-2">Gallery</h4>
              <div className="grid grid-cols-2 gap-2">
                {data.gallery.filter(g => g.trim()).map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Image {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assigned To */}
          {data.assignedTo && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-gray-500 text-xs">
                <span className="font-medium">Assigned to:</span> {data.assignedTo}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
