import axios from 'axios';
import EndPoint from './EndPoint';
// import { API_BASE_URL } from '../constants/config';
import { getData , storeData } from '../OfflineStore/OfflineStore';


const API_BASE_URL = "https://pureplusapp.in"


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const AUTH_WHITELIST = [
  EndPoint.GETOTP,
  EndPoint.VERIFYOTP,
  EndPoint.REFRESHTOKEN
];


let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.request.use(
  async (config) => {

    if (AUTH_WHITELIST.some((path) => config.url.includes(path))) {
      return config;
    }
    const token =  await getData('accessToken')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
  response => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getData('accessToken');

        const refreshResponse = await refreshClient.post(
          EndPoint.REFRESHTOKEN,
          { refreshToken }
        );

        const newAccessToken = refreshResponse.data.token;

        // 1️⃣ Store new token
        await storeData('accessToken', newAccessToken);

        // 2️⃣ Update header for this retry
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;


            console.log("REFRESH AXIOS REQUEST:", originalRequest);

        // 3️⃣ Retry original request automatically
        return apiClient(originalRequest);

      } catch (refreshError) {
        // logout user here
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

//for log purpose only 
apiClient.interceptors.request.use(req => {
  console.log("AXIOS REQUEST:", JSON.stringify({
    url: req.url,
    baseURL: req.baseURL,
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



export default apiClient
