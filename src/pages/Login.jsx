import React, { useState } from 'react';
import Axios from './../Instance/Instance';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Make the login request to the backend API
      const response = await Axios.post('/login', {
        email,
        password,
      });

      // If the login is successful, store the token and redirect
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Store the token in localStorage
        navigate('/'); // Redirect to the home page
      }
    } catch (error) {
     
      
      Swal.fire({
        icon: 'error',
        title:"Error",
        text: error.response ? error.response.data.message : 'An error occurred',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg bg-gray-700 text-white focus:ring focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg bg-gray-700 text-white focus:ring focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-300"
            >
              Login
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <p>
            Don't have an account?{' '}
            <a href="/register" className="text-blue-400 hover:text-blue-500">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
