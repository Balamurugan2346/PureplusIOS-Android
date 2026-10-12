import http from '../http';
import endpoints from '../endpoints';

/** Certification/trust (CUS-30), refill (CUS-25 area), deposit, support. */
class CertificationService {
  byStore(storeId) { return http.get(endpoints.certification.byStore(storeId)); }
}
export const certificationService = new CertificationService();

class RefillService {
  /** GET → Data = ARRAY [{productId, productName, issued, returned, balance}] */
  balance() { return http.get(endpoints.refill.balance); }

  /**
   * POST api/customer/refill/validate?productId={id}  body {orderedQuantity}
   * → Data = {productId, isAllowed, shortage, depositRequired}
   * NOTE: productId is a QUERY PARAM ([FromQuery] on the controller), NOT in the body.
   */
  validate(productId, orderedQuantity) {
    return http.post(endpoints.refill.validate, { orderedQuantity }, { params: { productId } });
  }

  /**
   * POST api/customer/refill/place
   * body must be exactly {storeId, productId, quantity, paymentType, addressId, slotId}
   * (paymentType "COD"|"UPI"; slotId nullable) → Data = {orderId, productId, quantity}
   */
  place(payload) { return http.post(endpoints.refill.place, payload); }
}
export const refillService = new RefillService();

/** CUS-25 My Cans — dedicated held-cans endpoint (preferred over refill/balance for the My Cans screen). */
class CanService {
  held() { return http.get(endpoints.cans.get); }
}
export const canService = new CanService();

class DepositService {
  calculate(payload) { return http.post(endpoints.deposit.calculate, payload); }
}
export const depositService = new DepositService();

class SupportService {
  get() { return http.get(endpoints.support.get); }
}
export const supportService = new SupportService();
