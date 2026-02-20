import apiClient from './axiosService';

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

export default {
  login,
  logout,
  storeToken
};
