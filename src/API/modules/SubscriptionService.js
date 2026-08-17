import http from '../http';
import endpoints from '../endpoints';

/** Subscriptions (CUS-21/22). Postpaid opt-in; auto-pause on overdue. */
class SubscriptionService {
  list() { return http.get(endpoints.subscription.list); }
  create(payload) { return http.post(endpoints.subscription.create, payload); }
  pause(id) { return http.put(endpoints.subscription.pause(id)); }
  resume(id) { return http.put(endpoints.subscription.resume(id)); }
  cancel(id) { return http.put(endpoints.subscription.cancel(id)); }
}

export default new SubscriptionService();
