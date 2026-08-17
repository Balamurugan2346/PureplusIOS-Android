import http from '../http';
import endpoints from '../endpoints';

/** In-app notification center (CUS-34). Every push also lands here. */
class NotificationService {
  list() { return http.get(endpoints.notifications.list); }
  unreadCount() { return http.get(endpoints.notifications.unreadCount); }
  markRead(id) { return http.post(endpoints.notifications.markRead(id)); }
  readAll() { return http.post(endpoints.notifications.readAll); }
}

export default new NotificationService();
