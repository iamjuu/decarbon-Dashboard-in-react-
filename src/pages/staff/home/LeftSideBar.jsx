import React from 'react';
import { Link } from 'react-router-dom';

const LeftSideBar = () => {
  return (
    <div className="w-full md:w-1/1 bg-gray-800 text-white flex flex-col items-center p-4 md:p-8">
      <Link to="/shaff">
        <p className="text-lg md:text-xl mb-4 hover:bg-gray-700 hover:text-blue-400 px-4 py-2 rounded-lg transition-all duration-300">
          Shaff
        </p>
      </Link>
      <Link to="/userList">
        <p className="text-lg md:text-xl mb-4 hover:bg-gray-700 hover:text-blue-400 px-4 py-2 rounded-lg transition-all duration-300">
          Total Users
        </p>
      </Link>
      <Link to="/staffs-bill-form">
        <p className="text-lg md:text-xl mb-4 hover:bg-gray-700 hover:text-pink-400 px-4 py-2 rounded-lg transition-all duration-300">
          Client Bill Form
        </p>
      </Link>
    </div>
  );
};

export default LeftSideBar;
