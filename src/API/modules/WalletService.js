import http from '../http';
import endpoints from '../endpoints';

/** Wallet (CUS-24). Holds floor-overcharge credit; auto-applies to orders. */
class WalletService {
  get() { return http.get(endpoints.wallet.get); }
  coverage(amount) { return http.get(endpoints.wallet.coverage(amount)); }
}

export default new WalletService();
