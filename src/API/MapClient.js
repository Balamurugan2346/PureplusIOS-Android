
import axios from 'axios';


// const MAP_BASE_URL = "https://geocode.maps.co"
const MAP_BASE_URL = "https://api.geoapify.com/v1/geocode/"

const mapApiClient = axios.create({
  baseURL: MAP_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});


mapApiClient.interceptors.request.use(req => {
  console.log("AXIOS REQUEST:", JSON.stringify({
    url: req.url,
    baseUrl:req.baseURL,
    method: req.method,
    headers: req.headers,
    data: req.data
  }, null, 2));
  return req;
});

mapApiClient.interceptors.response.use(
  res => {
    console.log("AXIOS RESPONSE:", res.data);
    return res;
  },
  err => {
    console.log("AXIOS ERROR:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default mapApiClient