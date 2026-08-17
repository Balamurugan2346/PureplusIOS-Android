import http from '../http';
import endpoints from '../endpoints';

/** Service requests / tickets (CUS-31). */
class ServiceRequestService {
  create(payload) { return http.post(endpoints.serviceRequest.create, payload); }
  list() { return http.get(endpoints.serviceRequest.list); }
  byId(id) { return http.get(endpoints.serviceRequest.byId(id)); }
  cancel(id) { return http.post(endpoints.serviceRequest.cancel(id)); }
}

export default new ServiceRequestService();
