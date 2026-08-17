import http from '../http';
import endpoints from '../endpoints';

/** Address book (CUS-08/28). floor_no + lift drive floor charges. */
class AddressService {
  list() { return http.get(endpoints.address.list); }
  create(payload) { return http.post(endpoints.address.create, payload); }
  update(payload) { return http.put(endpoints.address.update, payload); }
  remove(id) { return http.delete(endpoints.address.remove(id)); }
}

export default new AddressService();
