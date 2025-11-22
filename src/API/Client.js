import axios from 'axios';
// import { API_BASE_URL } from '../constants/config';
// import { getToken } from '../utils/storage';


const API_BASE_URL = "https://pureplus-backend.onrender.com/api"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Add token automatically
// apiClient.interceptors.request.use(async (config) => {
//   const token = await getToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });


export default apiClient;
