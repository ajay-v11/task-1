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
    <div className='hidden lg:block space-y-4'>
      {placeholderCards.map((card, index) => (
        <div key={index} className='bg-white rounded-xl shadow-md p-6 max-w-sm'>
          <div className='flex items-start space-x-4 mb-4'>
            <div className='p-2 bg-gray-100 rounded-lg'>{card.icon}</div>
            <div className='flex-1'>
              <h3 className='font-semibold text-gray-900 text-sm mb-1'>
                {card.title}
              </h3>
              <p className='text-xs text-gray-600'>{card.description}</p>
            </div>
          </div>
          <button className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors'>
            {card.buttonText}
          </button>
        </div>
      ))}

      {/* Learn More Button */}
      <div className='text-center mt-6'>
        <button className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-sm font-medium flex items-center space-x-2 mx-auto transition-colors'>
          <span>Learn More</span>
          <ArrowRight className='h-4 w-4' />
        </button>
      </div>

      {/* Business Tracker Ad */}
      <div className='bg-white rounded-xl shadow-md p-6 max-w-sm mt-6'>
        <div className='flex items-center space-x-4 mb-4'>
          <div className='flex-1'>
            <h3 className='font-bold text-gray-900 text-lg mb-2'>
              Simplify Your Business Accounts with Khata Tracker!
            </h3>
            <p className='text-sm text-gray-600 mb-4'>
              From expenses to income - manage it all with Khata Tracker.
            </p>
            <button className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'>
              Start 7 days free trial
            </button>
          </div>
          <div className='w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center'>
            <Building className='h-8 w-8 text-blue-600' />
          </div>
        </div>
      </div>
    </div>
  );
}
