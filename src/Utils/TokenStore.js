import { getData, storeData, removeData } from '../OfflineStore/OfflineStore';

/**
 * One place for auth token persistence. Keys are centralized so the refresh
 * flow and the auth guard never disagree on where the token lives.
 *
 * The backend currently returns a single `token` (JWT) from verify-otp and
 * refreshes by that same token. `preAuthToken` is returned for brand-new users
 * who must complete profile creation before a full session exists.
 */
const KEYS = {
  ACCESS: 'accessToken',
  PRE_AUTH: 'preAuthToken',
};

const TokenStore = {
  getAccessToken: () => getData(KEYS.ACCESS),
  setAccessToken: (token) => storeData(KEYS.ACCESS, token),

  getPreAuthToken: () => getData(KEYS.PRE_AUTH),
  setPreAuthToken: (token) => storeData(KEYS.PRE_AUTH, token),

  clear: async () => {
    await removeData(KEYS.ACCESS);
    await removeData(KEYS.PRE_AUTH);
  },

  isLoggedIn: async () => !!(await getData(KEYS.ACCESS)),
};

export default TokenStore;
