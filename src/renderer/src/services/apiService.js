import apiClient from './axiosService';

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

const login = async (username, userpin) => {
  return await apiClient.jupiterApiClient.post(`/api/hmi/v1/login-with-user-pin/${userpin}/${username}`);
};

const storeToken = (token) => {
  localStorage.setItem('access_token', token);
};

const logout = () => {
  localStorage.removeItem('access_token');
};

const activateHmi = async (hwId, activationKey) => {
  return await apiClient.jupiterApiClient.post('/api/hmi/v1/activate-device', {
    hwId: hwId,
    activationKey: activationKey
  });
};

const getWorkStationDetails = async (hwId) => {
  const response = await apiClient.jupiterApiClient.get(`/api/v1/workstation-details`);
  return response.data;
};

const getWorkOrders = async (workStationId) => {
  const response = await apiClient.jupiterApiClient.get(`/api/v1/work-orders/${workStationId}`);
  return response.data;
};

const getIngredients = async (workOrderId) => {
  const response = await apiClient.jupiterApiClient.get(`/api/v1/ingredients/${workOrderId}`);
  return response.data;
};

const loadSavedUSers = async (hwId, activationKey) => {
  return await apiClient.jupiterApiClient.post(`/api/hmi/v1/get-saved-hmi-users`, {
    hwId: hwId,
    activationKey: activationKey,
    hwCode: null
  });
};

const getDeviceSessionQr = async (hwId, activationKey) => {
  return await apiClient.jupiterApiClient.post(`/api/hmi/v1/generate-login-qr`, {
    hwId: hwId,
    activationKey: activationKey
  }
  );
};

const verifyDeviceLogin = async (deviceSessionKey) => {
  return await apiClient.jupiterApiClient.post(`/api/hmi/v1/verify-device-login/${deviceSessionKey}`);
};

const setUserPin = async (deviceSessionKey, userPin) => {
  return await apiClient.jupiterApiClient.post(`/api/hmi/v1/set-user-pin/${deviceSessionKey}/${userPin}`);
}

export default {
  setUserPin,
  verifyDeviceLogin,
  getDeviceSessionQr,
  loadSavedUSers,
  getUsers,
  getUserById,
  createUser,
  login,
  logout,
  storeToken,
  activateHmi,
  getIngredients
};
