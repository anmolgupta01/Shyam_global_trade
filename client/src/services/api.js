import axios from 'axios';

// Create axios instance - Using only environment variable
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup interceptors
export const setupAxiosInterceptors = () => {
  // Request interceptor - Add auth token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/';
      }
      
      if (error.response?.status >= 500) {
        console.error('Server error:', error);
      }
      
      return Promise.reject(error);
    }
  );
};

export default api;
