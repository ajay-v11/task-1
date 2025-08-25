import MainCard from '../components/Card/Maincard';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';


export default function PageComponent() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex justify-center'>
          <div className='w-full lg:w-[70%]'>
            <MainCard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
