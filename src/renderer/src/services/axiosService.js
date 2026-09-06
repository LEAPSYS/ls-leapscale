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

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

const onTokenRefreshed = (newToken) => {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
};

orbitApiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth/v1/refresh')
        ) {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh((newToken) => {
                        if (!newToken) {
                            reject(error);
                            return;
                        }
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        resolve(orbitApiClient(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await orbitApiClient.post('/api/auth/v1/refresh', {
                    refresh_token: refreshToken
                });
                const newAccessToken = data?.access_token;
                const newRefreshToken = data?.refresh_token;

                localStorage.setItem('access_token', newAccessToken);
                if (newRefreshToken) {
                    localStorage.setItem('refresh_token', newRefreshToken);
                }

                onTokenRefreshed(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return orbitApiClient(originalRequest);
            } catch (refreshError) {
                onTokenRefreshed(null);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default { backendApiClient, orbitApiClient };
