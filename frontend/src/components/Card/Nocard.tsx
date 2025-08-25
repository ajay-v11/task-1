import {Plus} from 'lucide-react';

interface NoCardMessageProps {
  userRole: 'user' | 'manager' | 'admin';
}

export default function NoCardMessage({userRole}: NoCardMessageProps) {
  const isManagerOrAdmin = userRole === 'manager' || userRole === 'admin';
  const message = isManagerOrAdmin
    ? 'You do not have a card created yet.'
    : 'No business card has been assigned to you.';
  const buttonText = isManagerOrAdmin ? 'Create a Card' : null;

  return (
    <div className='bg-white rounded-2xl shadow-lg w-full h-full flex flex-col items-center justify-center p-8 text-center'>
      <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
        <Plus className='h-12 w-12 text-gray-400' />
      </div>
      <h2 className='text-xl font-semibold text-gray-800 mb-2'>
        Card Not Found
      </h2>
      <p className='text-gray-600 mb-4'>{message}</p>
      {buttonText && (
        <button className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors'>
          <Plus className='h-4 w-4' />
          <span>{buttonText}</span>
        </button>
      )}
    </div>
  );
}
