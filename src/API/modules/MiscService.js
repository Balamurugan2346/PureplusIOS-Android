import http from '../http';
import endpoints from '../endpoints';

/** Certification/trust (CUS-30), refill (CUS-25 area), deposit, support. */
class CertificationService {
  byStore(storeId) { return http.get(endpoints.certification.byStore(storeId)); }
}
export const certificationService = new CertificationService();

class RefillService {
  balance() { return http.get(endpoints.refill.balance); }
  validate(payload) { return http.post(endpoints.refill.validate, payload); }
  place(payload) { return http.post(endpoints.refill.place, payload); }
}
export const refillService = new RefillService();

class DepositService {
  calculate(payload) { return http.post(endpoints.deposit.calculate, payload); }
}
export const depositService = new DepositService();

class SupportService {
  get() { return http.get(endpoints.support.get); }
}
export const supportService = new SupportService();
