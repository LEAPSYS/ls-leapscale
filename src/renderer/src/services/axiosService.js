import axios from 'axios';

const backendApiClient = axios.create({
  baseURL: 'https://backend.leapsys.in',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

backendApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (!config.url.includes('/auth/login')) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// backendApiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.log('Unauthorized - redirect to login');
//       localStorage.removeItem('access_token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

const orionApiClient = axios.create({
  baseURL: 'https://service.leapsys.in/orion',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

orionApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (!config.url.includes('/auth/login')) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// orionApiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.log('Unauthorized - redirect to login');
//       localStorage.removeItem('access_token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

export default { backendApiClient, orionApiClient };
