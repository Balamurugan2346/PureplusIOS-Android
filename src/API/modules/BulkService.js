import http from '../http';
import endpoints from '../endpoints';

/** B2B / Event bulk requests (CUS-26/27). A request, not an instant order. */
class BulkService {
  create(payload) { return http.post(endpoints.bulk.create, payload); }
  list() { return http.get(endpoints.bulk.list); }
  byId(id) { return http.get(endpoints.bulk.byId(id)); }
  acceptCounter(id) { return http.post(endpoints.bulk.acceptCounter(id)); }
  payAdvance(id, payload) { return http.post(endpoints.bulk.advance(id), payload); }
  confirm(id) { return http.post(endpoints.bulk.confirm(id)); }
  cancel(id) { return http.post(endpoints.bulk.cancel(id)); }
}

export default new BulkService();
