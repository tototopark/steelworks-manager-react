import axios from 'axios';

// Create a configured Axios instance
const apiClient = axios.create({
  baseURL: '', // Empty base URL is routed through Next.js proxy/rewrites
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to attach JWT token to headers dynamically
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to manage global errors (like 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login'; // Redirect to login page upon token expiration
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
