import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4005/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config:any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response:any) => response,
  (error:any) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;