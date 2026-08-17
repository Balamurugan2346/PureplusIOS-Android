import http from '../http';
import endpoints from '../endpoints';

/** Checkout estimate — the honest price breakdown (CUS-12/14). */
class CheckoutService {
  estimate(payload) { return http.post(endpoints.checkout.estimate, payload); }
  estimateWithWallet(payload) { return http.post(endpoints.checkout.estimateWithWallet, payload); }
  slots() { return http.get(endpoints.delivery.slots); }
}

export default new CheckoutService();
