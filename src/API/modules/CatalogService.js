import http from '../http';
import endpoints from '../endpoints';

/** Store-scoped catalog (CUS-10/11). */
class CatalogService {
  products() { return http.get(endpoints.catalog.products); }
  allProducts() { return http.get(endpoints.catalog.allProducts); }
  productById(id) { return http.get(endpoints.catalog.productById(id)); }
  banners() { return http.get(endpoints.catalog.banners); }
}

export default new CatalogService();
