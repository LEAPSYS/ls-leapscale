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
    hwId: hwId,
    activationKey: activationKey
  });
};

const getAllDeviceUsers = async (hwId, activationKey) => {
  return await apiClient.orbitApiClient.post(`/api/hmi/v1/get-all-device-users`, {
    hwId: hwId,
    activationKey: activationKey
  });
};

const loginWithPin = async (hwId, activationKey, username, pin) => {
  return await apiClient.orbitApiClient.post(`/api/auth/v1/login-with-pin`, {
    hwId: hwId,
    activationKey: activationKey,
    username: username,
    pin: pin
  });
};

const getDeviceSessionQr = async (hwId, activationKey) => {
  return await apiClient.orbitApiClient.post(`/api/hmi/v1/generate-login-qr`, {
    hwId: hwId,
    activationKey: activationKey
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
      hwId: hwId,
      activationKey: activationKey
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response;
};

const getWorkOrders = async (hwId, activationKey, location) => {
  const token = getAccessToken();
  const response = await apiClient.orbitApiClient.post(
    `/api/hmi/v1/get-work-orders`,
    {
      hwId: hwId,
      activationKey: activationKey,
      location: location
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response;
};

const executeSp = async (params) => {
  return await apiClient.orbitApiClient.post('/api/horizon/v1/execute-sp', params);
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
  executeSp,
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
