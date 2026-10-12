import http from '../http';
import endpoints from '../endpoints';

/**
 * Serviceability + geocoding (CUS-07).
 *
 * - Serviceability is LIVE today: a pincode -> serving-store DB lookup (no Google call).
 * - Geocoding (reverse/forward) is designed to route through the BACKEND (Google Maps, metered),
 *   NOT Geoapify. The methods below are complete and ready, but are currently DORMANT:
 *     • the backend endpoints `/api/customer/geo/{reverse,forward}` are not built yet, and
 *     • there is no paid Google plan.
 *   So the demo keeps using Geoapify in `src/API/Services/LocationService.js`.
 *
 * Response contract (per projectdocuments/04_Google_Maps_Geocoding.md):
 *   success -> { lat, lng, formattedAddress, pincode, city, state, success: true }
 *   failure -> { success: false, fallback: 'manual_entry' }  // show manual pincode/address entry
 *
 * TO ACTIVATE: once the backend endpoints + a Google key exist, call these from LocationService
 * (see the commented "GOOGLE BACKEND SWAP" block there), remove the Geoapify key, and delete MapClient.
 */
class GeoService {
  /** pincode -> serving store, or "not serviceable". LIVE. */
  resolveServiceability(pincode) {
    return http.get(endpoints.geo.serviceabilityResolve(pincode));
  }

  /**
   * Reverse geocode a map pin: lat/lng -> formatted address + pincode. DORMANT (backend not built).
   * Debounce the caller (only fire when the pin settles) to protect the Google free tier.
   */
  reverseGeocode(lat, lng) {
    return http.get(endpoints.geo.reverseGeocode(lat, lng));
  }

  /** Forward geocode typed/confirmed address text -> coordinates + pincode. DORMANT (backend not built). */
  forwardGeocode(address) {
    return http.get(endpoints.geo.forwardGeocode(address));
  }
}

export default new GeoService();
