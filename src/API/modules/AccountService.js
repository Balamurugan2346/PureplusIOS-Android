import http from '../http';
import endpoints from '../endpoints';

/**
 * CUS-33 Account closure (dues-gated).
 * Backend soft-deactivates only when there are no blockers (outstanding postpaid /
 * held cans / active orders); otherwise DELETE returns 409 with the blockers. Closed
 * accounts are rejected at login. Financial/audit history is retained server-side.
 */
class AccountService {
  /** Preview whether the account can be closed + any blockers. */
  deletionCheck() {
    return http.get(endpoints.account.deletionCheck);
  }

  /** Close the account. Resolves on success; rejects with ApiError (409 carries blockers). */
  deleteAccount() {
    return http.delete(endpoints.account.remove);
  }
}

export default new AccountService();
