import axios from 'axios';
import EndPoint from './EndPoint';
// import { API_BASE_URL } from '../constants/config';
import { getData } from '../OfflineStore/OfflineStore';


const API_BASE_URL = "https://pureplusapp.in/api"


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const AUTH_WHITELIST = [
  EndPoint.SENDOTP,
  EndPoint.VERIFYOTP,
  EndPoint.CREATEPROFILE
];

apiClient.interceptors.request.use(
  async (config) => {

    const isCreateProfile = config.url.includes(EndPoint.CREATEPROFILE);

    // 1️⃣ CREATEPROFILE → use preAuth header only
    if (isCreateProfile) {
      const preAuthToken = await getData('preAuthToken')
      config.headers['preAuth'] = preAuthToken;
      console.log("Using preAuth header for CREATEPROFILE",preAuthToken);
      return config;
    }

    // 2️⃣ Other whitelist APIs → skip token
    if (AUTH_WHITELIST.some((path) => config.url.includes(path))) {
      console.log("Whitelist API, skipping Authorization:", config.url);
      return config;
    }

    // 3️⃣ All other APIs → attach Authorization
    const token =  await getData('accessToken') // your token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("token",token)
    }

    console.log("Normal API → Added Authorization:", config.url);
    return config;
  },

  (error) => Promise.reject(error)
);



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
