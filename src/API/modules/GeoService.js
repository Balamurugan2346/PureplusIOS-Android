import http from '../http';
import endpoints from '../endpoints';

/**
 * Serviceability + geocoding (CUS-07). Geocoding routes through the BACKEND
 * (Google Maps), not Geoapify. Serviceability is live today; reverse-geocode
 * lights up when the backend Maps endpoints land — fall back to manual pincode.
 */
class GeoService {
  /** pincode -> serving store, or "not serviceable". */
  resolveServiceability(pincode) {
    return http.get(endpoints.geo.serviceabilityResolve(pincode));
  }
}

export default new GeoService();
