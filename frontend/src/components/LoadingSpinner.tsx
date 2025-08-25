export default function LoadingSpinner() {
  return (
    <div className='flex justify-center items-center w-full h-full py-10'>
      <div className='relative w-12 h-12'>
        {/* Outer spinning ring */}
        <div className='absolute inset-0 rounded-full border-4 border-t-transparent border-blue-500 animate-spin'></div>
        {/* Inner pulse circle */}
        <div className='absolute inset-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse'></div>
      </div>
    </div>
  );
}
