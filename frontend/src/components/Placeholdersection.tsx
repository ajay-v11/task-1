import {MapPin, Building, Users, Briefcase, ArrowRight} from 'lucide-react';

export default function Placeholder() {
  const placeholderCards = [
    {
      icon: <MapPin className='h-8 w-8 text-blue-600' />,
      title: 'Find Local Businesses',
      description: 'Discover Local Business Near you Quickly',
      buttonText: 'Explore More',
    },
    {
      icon: <Building className='h-8 w-8 text-orange-600' />,
      title: 'IT Market Place: Connect with companies',
      description: 'Discover top IT Services & products',
      buttonText: 'Explore More',
    },
    {
      icon: <Users className='h-8 w-8 text-green-600' />,
      title: 'Explore Professional Networking',
      description: 'Connect and Collaborate with professionals to grow',
      buttonText: 'Explore More',
    },
    {
      icon: <Briefcase className='h-8 w-8 text-blue-600' />,
      title: 'Offline Business Networking',
      description: 'Find Trusted Local Business Near you Quickly',
      buttonText: 'Explore More',
    },
  ];

  return (
    <div className='w-full h-full flex flex-col space-y-4 sm:space-y-6'>
      {/* Cards grid */}
      <div className='grid grid-cols-2 gap-3 sm:gap-4 flex-1'>
        {placeholderCards.map((card, index) => (
          <div
            key={index}
            className='bg-white rounded-xl shadow-md p-3 sm:p-4 flex flex-col h-full'>
            <div className='flex flex-col items-start mb-3 sm:mb-4 flex-1'>
              <div className='p-2 bg-gray-100 rounded-lg mb-2'>{card.icon}</div>
              <h3 className='font-semibold text-gray-900 text-xs sm:text-sm mb-2 line-clamp-2'>
                {card.title}
              </h3>
              <p className='text-xs text-gray-600 flex-1 line-clamp-2'>
                {card.description}
              </p>
            </div>
            <button className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors mt-auto'>
              {card.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Learn More Button */}
      <div className='text-center'>
        <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium flex items-center justify-center space-x-2 mx-auto transition-colors'>
          <span>Learn More</span>
          <ArrowRight className='h-3 w-3 sm:h-4 sm:w-4' />
        </button>
      </div>

      {/* Business Tracker Ad */}
      <div className='bg-white rounded-xl shadow-md p-4 sm:p-6'>
        <div className='flex items-start space-x-3 sm:space-x-4'>
          <div className='flex-1'>
            <h3 className='font-bold text-gray-900 text-sm sm:text-lg mb-2'>
              Simplify Your Business Accounts with Khata Tracker!
            </h3>
            <p className='text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4'>
              From expenses to income – manage it all with Khata Tracker.
            </p>
            <button className='bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors'>
              Start 7 days free trial
            </button>
          </div>
          <div className='w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0'>
            <Building className='h-6 w-6 sm:h-8 sm:w-8 text-blue-600' />
          </div>
        </div>
      </div>
    </div>
  );
}
