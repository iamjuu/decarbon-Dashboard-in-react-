import React from 'react';
import { useNavigate } from 'react-router-dom';
import p404 from "./../assets/404.jpg"

const NotFound = () => {
  const navigate = useNavigate();

  // Redirect user to the home page after a few seconds (optional)
  setTimeout(() => {
    navigate('/login');
  }, 5000);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="text-center p-8 rounded-lg bg-gray-700 bg-opacity-50 shadow-2xl">
        <div className="mb-6 flex justify-center items-center">
          {/* Replace with a 404 GIF or image */}
          <img
            src={p404} // Replace this with your preferred 404 image URL
            alt="404 Error"
            className="w-64 h-64 object-contain rounded-lg border-4 border-gray-600"
          />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-100 mb-4">
          404: Page Not Found
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          Sorry, the page you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 transition"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
