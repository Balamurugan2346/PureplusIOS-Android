import http from '../http';
import endpoints from '../endpoints';

/**
 * B2B / Event bulk requests (CUS-26/27). A request, not an instant order.
 *
 * Backend: CustomerBulkRequestController (`api/customer/bulk-requests`).
 * The customer id is taken from the JWT — a customer only ever acts on their own request.
 *
 * Every method below returns Envelope A `{ success, data }`; http.js unwraps it and resolves
 * to the `data` payload. For byId / acceptCounter / payAdvance / confirm / cancel that payload
 * is a **BulkRequestDto** (camelCase on the wire) with these key fields:
 *   id, customerId, requestType ("B2B" | "EVENT"), productId, quantity, requestedDate,
 *   addressId, gstin, eventDetails, status, estimatedAmount, advanceAmount, advancePaid,
 *   advanceForfeited, counterDate, counterQuantity, counterNote, reviewNote, escalated,
 *   storeId, assignedDriverId, assignedVehicleId, scheduledDeliveryDate, createdAt,
 *   allowedTransitions[].
 */
class BulkService {
  /**
   * Create a bulk request (CUS-26).
   * POST api/customer/bulk-requests
   * @param {{requestType:("B2B"|"EVENT"), productId:number, quantity:number, requestedDate:string, addressId?:number, gstin?:string, eventDetails?:string}} payload
   * @returns {Promise<Object>} the created BulkRequestDto
   */
  create(payload) { return http.post(endpoints.bulk.create, payload); }

  /**
   * List the signed-in customer's bulk requests (CUS-27).
   * GET api/customer/bulk-requests
   * @returns {Promise<Object[]>} array of BulkRequestDto
   */
  list() { return http.get(endpoints.bulk.list); }

  /**
   * Fetch one bulk request by id (CUS-27 detail).
   * GET api/customer/bulk-requests/{id}
   * @param {number} id
   * @returns {Promise<Object>} BulkRequestDto (see class doc for fields)
   */
  byId(id) { return http.get(endpoints.bulk.byId(id)); }

  /**
   * Accept the store's counter-offer (counterDate / counterQuantity).
   * POST api/customer/bulk-requests/{id}/accept-counter — NO request body.
   * @param {number} id
   * @returns {Promise<Object>} the updated BulkRequestDto
   */
  acceptCounter(id) { return http.post(endpoints.bulk.acceptCounter(id)); }

  /**
   * Pay the advance on an APPROVED EVENT request (EVENT-only, APPROVED-only).
   * POST api/customer/bulk-requests/{id}/advance
   * Body MUST be `{ amount: <number> }` (maps to backend PayAdvanceRequest.Amount).
   * @param {number} id
   * @param {{amount:number}} payload
   * @returns {Promise<Object>} the updated BulkRequestDto (advancePaid reflects the payment)
   */
  payAdvance(id, payload) { return http.post(endpoints.bulk.advance(id), payload); }

  /**
   * Confirm the request (accept the quoted estimate / lock the batch).
   * POST api/customer/bulk-requests/{id}/confirm — NO request body.
   * @param {number} id
   * @returns {Promise<Object>} the updated BulkRequestDto
   */
  confirm(id) { return http.post(endpoints.bulk.confirm(id)); }

  /**
   * Cancel the request.
   * POST api/customer/bulk-requests/{id}/cancel — NO request body.
   * @param {number} id
   * @returns {Promise<Object>} the updated BulkRequestDto
   */
  cancel(id) { return http.post(endpoints.bulk.cancel(id)); }
}

export default new BulkService();
