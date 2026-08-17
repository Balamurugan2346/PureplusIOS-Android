import http from '../http';
import endpoints from '../endpoints';

/** Orders + lifecycle (CUS-14..20). Pay-at-delivery: no payment call at place. */
class OrderService {
  place(payload) { return http.post(endpoints.order.place, payload); }
  list() { return http.get(endpoints.order.list); }
  current() { return http.get(endpoints.order.current); }
  byId(id) { return http.get(endpoints.order.byId(id)); }
  isFirst() { return http.get(endpoints.order.isFirst); }
  track(id) { return http.get(endpoints.order.track(id)); }
  eta(id) { return http.get(endpoints.order.eta(id)); }
  invoice(id) { return http.get(endpoints.order.invoice(id)); }
  canCancel(id) { return http.get(endpoints.order.canCancel(id)); }
  cancel(id) { return http.post(endpoints.order.cancel(id)); }
}

export default new OrderService();
