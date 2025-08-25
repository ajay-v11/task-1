export default function Footer() {
  return (
    <footer className='bg-white py-12 mt-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Connecting{' '}
            <span className='bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent'>
              Businesses, People & Opportunities
            </span>
          </h2>
        </div>

        {/* Bottom section with logo */}
        <div className='mt-12 pt-8 border-t border-gray-200'>
          <div className='flex justify-center'>
            <h3 className='text-2xl font-bold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
              CONNECTREE
            </h3>
          </div>
        </div>
      </div>
    </footer>
  );
}
