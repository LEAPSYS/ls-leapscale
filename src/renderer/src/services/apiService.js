import apiClient from './axiosService';

//validated

const storeTokens = (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
};

const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

const getAccessToken = () => {
    return localStorage.getItem('access_token');
};

const activateHmi = async (hwId, activationKey) => {
    return await apiClient.orbitApiClient.post('/api/hmi/v1/activate-device', {
        hwId: hwId
    });
};

const getAllDeviceUsers = async (hwId, activationKey) => {
    return await apiClient.orbitApiClient.post(`/api/hmi/v1/get-all-device-users`, {
        hwId: hwId
    });
};

const loginWithPin = async (hwId, activationKey, username, pin) => {
    return await apiClient.orbitApiClient.post(`/api/auth/v1/login-with-pin`, {
        hwId: hwId,
        username: username,
        pin: pin
    });
};

const getDeviceSessionQr = async (hwId, activationKey) => {
    return await apiClient.orbitApiClient.post(`/api/hmi/v1/generate-login-qr`, {
        hwId: hwId
    });
};

const loginWithQrSessionKey = async (deviceSessionKey) => {
    return await apiClient.orbitApiClient.post(`/api/auth/v1/login-with-qr-session-key`, {
        sessionKey: deviceSessionKey
    });
};

const getWorkStations = async (hwId, activationKey) => {
    const token = getAccessToken();
    const response = await apiClient.orbitApiClient.post(
        `/api/hmi/v1/get-workstations`,
        {
            hwId: hwId
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response;
};

const getWorkOrders = async (hwId, activationKey, workstation) => {
    const token = getAccessToken();
    const response = await apiClient.orbitApiClient.post(
        `/api/hmi/v1/get-work-orders`,
        {
            hwId: hwId
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response;
};

const getHmiData = async (params) => {
    return await apiClient.orbitApiClient.post('/api/hmi/v1/get-hmi-data', params);
};

//to be validated

const getUsers = async () => {
    const response = await apiClient.backendApiClient.get('/users');
    return response.data;
};

const getUserById = async (id) => {
    const response = await apiClient.backendApiClient.get(`/users/${id}`);
    return response.data;
};

const createUser = async (data) => {
    const response = await apiClient.backendApiClient.post('/users', data);
    return response.data;
};

const getIngredients = async (workOrderId) => {
    const response = await apiClient.orbitApiClient.get(`/api/v1/ingredients/${workOrderId}`);
    return response.data;
};

export default {
    getHmiData,
    getWorkOrders,
    getWorkStations,
    loginWithQrSessionKey,
    getDeviceSessionQr,
    getAllDeviceUsers,
    getUsers,
    getUserById,
    createUser,
    loginWithPin,
    logout,
    storeTokens,
    activateHmi,
    getIngredients
};
