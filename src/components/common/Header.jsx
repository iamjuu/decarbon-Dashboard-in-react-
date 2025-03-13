import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto flex justify-between py-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-300">{title}</h1>
        <button
          onClick={handleLogout}
          className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-300 focus:ring focus:ring-red-300"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
