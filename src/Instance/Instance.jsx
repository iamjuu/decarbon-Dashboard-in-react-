import axios from "axios";

const Instance = axios.create({
  baseURL: "http://localhost:7000", // Your backend API base URL
  timeout: 20000,
  withCredentials: true,
});

// Request interceptor to add token
Instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration and redirect
Instance.interceptors.response.use(
  (response) => {
    return response; // Return successful response
  },
  (error) => {
    // Check if the error is a 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Clear token from localStorage
      localStorage.removeItem("token");
      
      // Redirect to login page
      alert("Session expired. Please log in again.");
      window.location.href = "/login"; // Or use React Router to navigate
    }
    return Promise.reject(error);
  }
);

export default Instance;
