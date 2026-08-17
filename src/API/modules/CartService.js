import http from '../http';
import endpoints from '../endpoints';

/** Cart (CUS-12). */
class CartService {
  get() { return http.get(endpoints.cart.get); }
  count() { return http.get(endpoints.cart.count); }
  add(payload) { return http.post(endpoints.cart.add, payload); }
  updateQty(payload) { return http.post(endpoints.cart.updateQty, payload); }
  validate(payload) { return http.post(endpoints.cart.validate, payload); }
  applyFirstOffer(payload) { return http.post(endpoints.cart.applyFirstOffer, payload); }
  remove(id) { return http.delete(endpoints.cart.remove(id)); }
}

export default new CartService();
