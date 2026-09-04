import axios from 'axios';

const backendApiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
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

const orbitApiClient = axios.create({
    baseURL: import.meta.env.VITE_ORBIT_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

orbitApiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (!config.url.includes('/auth/login')) {
            if (token) {
                console.log(`access token: ${token}`);
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// orbitApiClient.interceptors.response.use(
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

export default { backendApiClient, orbitApiClient };
