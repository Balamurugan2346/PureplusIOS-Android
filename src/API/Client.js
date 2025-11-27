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

apiClient.interceptors.request.use(req => {
  console.log("AXIOS REQUEST:", JSON.stringify({
    url: req.url,
    method: req.method,
    headers: req.headers,
    data: req.data
  }, null, 2));
  return req;
});

apiClient.interceptors.response.use(
  res => {
    console.log("AXIOS RESPONSE:", res.data);
    return res;
  },
  err => {
    console.log("AXIOS ERROR:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);



export default apiClient;
