import axios from 'axios';
import { getData, storeData, clearDataBeforeLogout } from '../OfflineStore/OfflineStore';

/**
 * Central axios client for the PurePlus backend.
 *
 * Responsibilities:
 *  - attach the bearer token on every non-auth request
 *  - transparently refresh an expired token once (with a queue so concurrent
 *    401s trigger a single refresh, not N refreshes)
 *  - hand control back to the app on a hard auth failure (logout)
 *  - dev-only request/response logging with the Authorization header redacted
 */

const API_BASE_URL = 'https://pureplusapp.in';

// Endpoints that must NEVER carry a bearer token (they mint/refresh it).
const AUTH_WHITELIST = [
  'api/customer/auth/send-otp',
  'api/customer/auth/verify-otp',
  'api/customer/auth/refresh-token',
];

const isAuthEndpoint = (url = '') => AUTH_WHITELIST.some((p) => url.includes(p));

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// A bare client for the refresh call, so the refresh itself is never intercepted
// (which would recurse). This was referenced but never defined before — the bug
// that made the old refresh path throw a ReferenceError on the first 401.
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ---- optional app hook: called once when refresh fails (do a nav reset to Login) ----
let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

// ---- single-flight refresh queue ----
let isRefreshing = false;
let pendingQueue = [];

const flushQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
  pendingQueue = [];
};

async function refreshAccessToken() {
  // The backend refreshes by the current (expired) token: POST { token } -> { token }.
  const currentToken = await getData('accessToken');
  const res = await refreshClient.post('api/customer/auth/refresh-token', { token: currentToken });
  const newToken = res?.data?.data?.token ?? res?.data?.token;
  if (!newToken) throw new Error('No token in refresh response');
  await storeData('accessToken', newToken);
  return newToken;
}

// ---- request: attach token ----
apiClient.interceptors.request.use(
  async (config) => {
    if (!isAuthEndpoint(config.url)) {
      const token = await getData('accessToken');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    if (__DEV__) {
      // redact the token in logs
      const { Authorization, ...safeHeaders } = config.headers || {};
      console.log('➡️', (config.method || 'get').toUpperCase(), config.url, {
        headers: { ...safeHeaders, Authorization: Authorization ? 'Bearer •••' : undefined },
        data: config.data,
      });
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ---- response: unwrap logging + refresh-on-401 ----
apiClient.interceptors.response.use(
  (res) => {
    if (__DEV__) console.log('✅', res.config?.url, res.data);
    return res;
  },
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (__DEV__) console.log('⛔', original?.url, status, error.response?.data || error.message);

    // Only try refresh once per request, and never for the auth endpoints themselves.
    if (status === 401 && original && !original._retry && !isAuthEndpoint(original.url)) {
      if (isRefreshing) {
        // wait for the in-flight refresh, then replay
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (token) => {
              original.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(original));
            },
            reject,
          });
        });
      }

      original._retry = true;
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        flushQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      } catch (refreshError) {
        flushQueue(refreshError, null);
        await clearDataBeforeLogout();
        if (onUnauthorized) onUnauthorized(); // app resets to Login
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
