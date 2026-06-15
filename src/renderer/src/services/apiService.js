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

const activateHmi = async (hwId, activationKey) => {
  return await apiClient.jupiterApiClient.post('/api/scale/v1/activate-leapscale', {
    hwId: hwId,
    activationKey: activationKey
  });
};



//getting work station details by hwId
const getWorkStationDetails = async (hwId) => {
  const response = await apiClient.orionApiClient.get(`/api/v1/workstation-details`);
  return response.data;
};


//getting work orders from specific workstation
const getWorkOrders=async (workStationId)=>{
  const response = await apiClient.orionApiClient.get(`/api/v1/work-orders/${workStationId}`);
  return response.data;
}

//getting Ingrediants of weighing
const getIngredients=async (workOrderId) => {
  
     const response = await apiClient.orionApiClient.get(`/api/v1/ingredients/${workOrderId}`);
  return response.data;
 
  
}

export default {
  getUsers,
  getUserById,
  createUser,
  login,
  logout,
  storeToken,
  activateHmi,
  getIngredients,
};
