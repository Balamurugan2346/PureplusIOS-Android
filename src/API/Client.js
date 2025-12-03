import axios from 'axios';
import EndPoint from './EndPoint';
// import { API_BASE_URL } from '../constants/config';
// import { getToken } from '../utils/storage';


const API_BASE_URL = "https://pureplus-backend.onrender.com/api"


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const AUTH_WHITELIST = [EndPoint.SENDOTP, EndPoint.VERIFYOTP,EndPoint.CREATEPROFILE];

apiClient.interceptors.request.use(
  async (config) => {
    // check if request is NOT in whitelist
    if (!AUTH_WHITELIST.some(path => config.url.includes(path))) {
      const token =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjE4IiwidHlwZSI6ImF1dGgiLCJleHAiOjE3NjQ3ODQ5NjEsImlzcyI6IlB1cmVQbHVzQVBJIiwiYXVkIjoiUHVyZVBsdXNDbGllbnQifQ.js5Za3Y9BvsqZ8IPYTh37S-XyUo_VhTJM7OhcmJ4Nw8"
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    console.log("config url",config.url)
    return config;
  },
  (error) => Promise.reject(error)
);


apiClient.interceptors.request.use(req => {
  console.log("AXIOS REQUEST:", JSON.stringify({
    url: req.url,
    baseURL:req.baseURL,
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
