import http from '../http';
import endpoints from '../endpoints';
import TokenStore from '../../Utils/TokenStore';

/**
 * AuthService (class) — the migration target for the auth screens (Phase 2).
 * The legacy functional AuthService still lives at src/API/Services/AuthService.js
 * and is what the current screens import; point them here when reworking auth.
 */
class AuthService {
  /** Throws ApiError with isRateLimit=true on HTTP 429. */
  sendOtp(mobileNumber) {
    return http.post(endpoints.auth.sendOtp, { mobileNumber });
  }

  async verifyOtp(mobileNumber, otp) {
    // /api/customer/auth/verify-otp returns a full JWT (`token`) + `isNewUser` even
    // for new users — there is no preAuthToken in this flow (that was the legacy
    // /api/auth two-step signup). Persist the token; profile creation is authorized.
    const data = await http.post(endpoints.auth.verifyOtp, { mobileNumber, otp });
    if (data?.token) await TokenStore.setAccessToken(data.token);
    return data;
  }

  createProfile(fullName, email) {
    return http.post(endpoints.profile.create, { fullName, email });
  }

  logout() {
    return TokenStore.clear();
  }
}

export default new AuthService();
