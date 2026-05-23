import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Send cookies with requests
});

// Response interceptor for handling 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: Clear user state or redirect to login
      // We will handle this in the AuthContext mostly, but it's good practice
      console.log('Unauthorized access. Please login.');
    }
    return Promise.reject(error);
  }
);

export default api;
