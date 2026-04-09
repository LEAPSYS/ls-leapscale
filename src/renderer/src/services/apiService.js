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

const login = async (username, password) => {
  return await apiClient.backendApiClient.post('/auth/login', {
    email: username,
    password: password
  });
};

const storeToken = (token) => {
  localStorage.setItem('access_token', token);
};

const logout = () => {
  localStorage.removeItem('access_token');
};

const activateHmi = async () => {
  return await apiClient.orionApiClient.post('')


}

export default {
  getUsers,
  getUserById,
  createUser,
  login,
  logout,
  storeToken,
  activateHmi
};
