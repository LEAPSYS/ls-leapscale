import apiClient from './axiosService';

//validated

const activateHmi = async (hwId, activationKey) => {
  return await apiClient.jupiterApiClient.post('/api/hmi/v1/activate-device', {
    hwId: hwId,
    activationKey: activationKey
  });
};

const getAllDeviceUsers = async (hwId, activationKey) => {
  return await apiClient.jupiterApiClient.post(`/api/hmi/v1/get-all-device-users`, {
    hwId: hwId,
    activationKey: activationKey
  });
};

const loginWithPin = async (hwId, activationKey, username, pin) => {
  return await apiClient.jupiterApiClient.post(`/api/auth/v1/login-with-pin`, {
    hwId: hwId,
    activationKey: activationKey,
    username: username,
    pin: pin
  });
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

const storeToken = (token) => {
  localStorage.setItem('access_token', token);
};

const logout = () => {
  localStorage.removeItem('access_token');
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

const getDeviceSessionQr = async (hwId, activationKey) => {
  return await apiClient.jupiterApiClient.post(`/api/hmi/v1/generate-login-qr`, {
    hwId: hwId,
    activationKey: activationKey
  });
};

const verifyDeviceLogin = async (deviceSessionKey) => {
  return await apiClient.jupiterApiClient.post(`/api/hmi/v1/verify-device-login/${deviceSessionKey}`);
};

const setUserPin = async (deviceSessionKey, userPin) => {
  return await apiClient.jupiterApiClient.post(`/api/hmi/v1/set-user-pin/${deviceSessionKey}/${userPin}`);
};

export default {
  setUserPin,
  verifyDeviceLogin,
  getDeviceSessionQr,
  getAllDeviceUsers,
  getUsers,
  getUserById,
  createUser,
  loginWithPin,
  logout,
  storeToken,
  activateHmi,
  getIngredients
};
