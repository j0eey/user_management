import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6">The page you're looking for doesn't exist.</p>
      <Link 
        to="/dashboard" 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-800 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};