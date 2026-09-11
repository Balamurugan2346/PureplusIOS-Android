import apiClient from '../API/Client';

/**
 * Typed API error. Every service call rejects with one of these, so screens
 * can branch on `err.status` / `err.isRateLimit` instead of digging into axios.
 */
export class ApiError extends Error {
  constructor(message, { status = 0, data = null, isRateLimit = false } = {}) {
    super(message || 'Something went wrong');
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.isRateLimit = isRateLimit;
  }
}

/**
 * The backend returns one of TWO envelopes:
 *   A) { success, data, message }              — most controllers
 *   B) { status, message, data }               — Refill + Subscription only
 * This unwraps both so callers get `data` directly, and normalizes every
 * failure into an ApiError.
 *
 * Handles 429 (OTP rate limit) distinctly via `err.isRateLimit`.
 */
function unwrap(promise) {
  return promise.then(
    (res) => {
      const body = res?.data;
      // Envelope A: { success, data, message }
      if (body && typeof body === 'object' && 'success' in body) {
        if (body.success === false) {
          throw new ApiError(body.message || 'Request failed', {
            status: res.status,
            data: body,
          });
        }
        return body.data !== undefined ? body.data : body;
      }
      // Envelope B: { status: <int>, message, data } — Refill + Subscription.
      // A create returns { status, message, subscriptionId } with no `data`, so
      // fall back to the whole body when `data` is absent (callers read subscriptionId).
      if (body && typeof body === 'object' && typeof body.status === 'number' && 'message' in body) {
        if (body.status >= 400) {
          throw new ApiError(body.message || 'Request failed', {
            status: body.status,
            data: body,
          });
        }
        return body.data !== undefined ? body.data : body;
      }
      // Non-enveloped endpoint — return raw body
      return body;
    },
    (error) => {
      const status = error?.response?.status ?? 0;
      const data = error?.response?.data ?? null;
      const message =
        data?.message ||
        (status === 429 ? 'Too many attempts. Please wait and try again.' : null) ||
        error?.message ||
        'Network error';
      throw new ApiError(message, {
        status,
        data,
        isRateLimit: status === 429,
      });
    },
  );
}

/** Thin verb wrapper around the shared axios client. Services call these only. */
const http = {
  get: (url, config) => unwrap(apiClient.get(url, config)),
  post: (url, body, config) => unwrap(apiClient.post(url, body, config)),
  put: (url, body, config) => unwrap(apiClient.put(url, body, config)),
  patch: (url, body, config) => unwrap(apiClient.patch(url, body, config)),
  delete: (url, config) => unwrap(apiClient.delete(url, config)),
};

export default http;
