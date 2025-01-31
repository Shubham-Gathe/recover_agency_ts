import axios from 'axios';
import { store } from 'src/store/store';
import { logout } from 'src/store/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// **Attach token to requests**
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Token'] = `${token}`;
  }
  return config;
});

// **Handle expired tokens (401 Unauthorized)**
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Token expired, logging out...');
      store.dispatch(logout()); // Dispatch logout action
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirect user to login

    }
    return Promise.reject(error);
  }
);

export default api;
