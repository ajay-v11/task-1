import {X, Download} from 'lucide-react';
import {QRCodeSVG} from 'qrcode.react'; // Corrected import
import {useEffect, useState} from 'react';

// Use the same CardType definition from MainCard
type CardType = {
  profilePicture?:
    | string
    | {
        data: {
          data: number[];
        };
        contentType: string;
      };
  fullName: string;
  title: string;
  companyName?: string;
  company?: {
    name?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
  };
};

type QrModalProps = {
  cardData: CardType;
  profileImageSrc: string;
  onClose: () => void;
};

export default function QrModal({
  cardData,
  profileImageSrc,
  onClose,
}: QrModalProps) {
  const [currentUrl, setCurrentUrl] = useState('');

  // Get the current window URL once the component mounts
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleDownloadVcf = () => {
    // vCard (VCF) format string
    const vcfContent = `BEGIN:VCARD
VERSION:3.0
FN:${cardData.fullName}
TITLE:${cardData.title}
ORG:${cardData.company?.name || cardData.companyName || ''}
TEL;TYPE=CELL:${cardData.contact?.phone || ''}
EMAIL:${cardData.contact?.email || ''}
END:VCARD`;

    // Create a Blob to hold the vCard data
    const blob = new Blob([vcfContent], {type: 'text/vcard;charset=utf-8'});

    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const sanitizedName = cardData.fullName.replace(/\s+/g, '_');
    link.download = `${sanitizedName}_contact.vcf`;

    // Append to body, click, and then remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href); // Clean up the URL object
  };

  return (
    // Modal Overlay
    <div
      className='fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4'
      onClick={onClose} // Close modal on overlay click
    >
      {/* Modal Content */}
      <div
        className='bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 text-center relative animate-fade-in-up'
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors'>
          <X size={24} />
        </button>

        {/* User Info */}
        <div className='mb-4'>
          <img
            src={profileImageSrc}
            alt={cardData.fullName}
            className='w-20 h-20 rounded-full border-4 border-gray-100 shadow-md object-cover mx-auto'
          />
          <h3 className='mt-3 text-lg font-bold text-gray-800'>
            {cardData.fullName}
          </h3>
          <p className='text-sm text-gray-500'>{cardData.title}</p>
        </div>

        {/* QR Code */}
        <div className='p-3 bg-gray-50 rounded-lg inline-block'>
          {currentUrl && (
            <QRCodeSVG
              value={currentUrl}
              size={192} // Adjust size as needed
              bgColor='#ffffff'
              fgColor='#000000'
              level='Q' // Error correction level
              includeMargin={false}
            />
          )}
        </div>
        <p className='text-xs text-gray-400 mt-2'>Scan to view this card</p>

        {/* Download Button */}
        <button
          onClick={handleDownloadVcf}
          className='mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-transform transform hover:scale-105'>
          <Download size={20} />
          <span>Download Contact</span>
        </button>
      </div>
    </div>
  );
}
