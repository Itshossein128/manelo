export default function Unauthorized() {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <h1 className='text-2xl font-bold'>Unauthorized</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }