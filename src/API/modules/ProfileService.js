import http from '../http';
import endpoints from '../endpoints';

/** Profile (CUS-05/33). Mobile number is not editable. */
class ProfileService {
  get() { return http.get(endpoints.profile.get); }
  create(payload) { return http.post(endpoints.profile.create, payload); }
  update(payload) { return http.put(endpoints.profile.update, payload); }
}

export default new ProfileService();
