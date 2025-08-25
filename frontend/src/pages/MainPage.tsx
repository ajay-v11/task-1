import MainCard from '../components/Card/Maincard';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Placeholder from '../components/Placeholdersection';

export default function PageComponent() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8'>
        <div className='flex flex-col lg:flex-row gap-4 sm:gap-6'>
          {/* Main Card */}
          <div className='w-full lg:w-[65%]'>
            <MainCard />
          </div>

          {/* Placeholder Section */}
          <div className='w-full lg:w-[35%]'>
            <Placeholder />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
