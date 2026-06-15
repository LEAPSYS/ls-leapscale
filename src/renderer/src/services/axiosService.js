import axios from 'axios';

const backendApiClient = axios.create({
  baseURL: 'https://backend.leapsys.in',
  timeout: 30000,
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

const jupiterApiClient = axios.create({
  // baseURL: 'https://service.leapsys.in/jupiter-prd',
  // baseURL: 'https://service.leapsys.in/jupiter-uat',
  baseURL: 'http://localhost:8888/jupiter-local',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

jupiterApiClient.interceptors.request.use(
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

// jupiterApiClient.interceptors.response.use(
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

export default { backendApiClient, jupiterApiClient };
