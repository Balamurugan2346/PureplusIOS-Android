import http from '../http';
import endpoints from '../endpoints';

class ChargesService {
  /** GET /api/customer/charges/info — optional query params for worked amounts */
  info(params = {}) {
    return http.get(endpoints.charges.info, { params });
  }

  /** GET /api/customer/orders/{id}/charges — owner-checked per-order breakdown */
  orderCharges(orderId) {
    return http.get(endpoints.charges.orderCharges(orderId));
  }
}

export default new ChargesService();
