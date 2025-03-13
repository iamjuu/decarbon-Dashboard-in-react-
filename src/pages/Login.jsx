import React, { useState, useEffect } from 'react';
import Axios from "../Instance/Instance"
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // useEffect to check existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        if (decodedToken.exp * 1000 > Date.now()) {
          // Token is valid, navigate to home
          navigate('/home');
        } else {
          // Token is expired, remove it
          localStorage.removeItem('token');
          Swal.fire({
            icon: 'info',
            title: 'Session Expired',
            text: 'Please log in again.',
          });
        }
      } catch (error) {
        localStorage.removeItem('token'); // Remove invalid token
        console.error('Error decoding token:', error);
      }
    }
  }, [navigate]);

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Make the login request to the backend API
	 
      const response = await Axios.post("/login", {
        email,
        password,
      });

      // If login is successful, store the token and redirect
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/home');
      }
    } catch (error) {

console.log(error)
	    Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || 'An error occurred. Please try again.',
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-100 px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-bold mb-6">
          <p className="inline text-red-500">Nso2</p> Login
        </h2>

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
      </div>
    </div>
  );
};

export default Login;

