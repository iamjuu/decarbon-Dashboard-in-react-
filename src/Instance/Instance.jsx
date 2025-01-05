import axios from "axios";

const Instance = axios.create({
  baseURL: "http://localhost:7000", 
  timeout: 20000,
  withCredentials: true
});

// Add a request interceptor to include the tokena
Instance.interceptors.request.use(
  (config) => {
    // Retrieve token from localStorage (or any other storage method)
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.authorization = `Bearer ${token}`;
     
    }
     
    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

export default Instance;
