/**
 * Order status helpers — single source for mapping the backend order to a human timeline.
 *
 * The order-detail / current-order API returns:
 *   - deliveryStatus: canonical UPPER_SNAKE (PLACED | ASSIGNED | OUT_FOR_DELIVERY | DELIVERED | CANCELLED | FAILED)
 *   - history: [{ status, updatedAt, remarks }]   ← the authoritative, dynamic timeline
 * Older rows may carry legacy spellings (e.g. "Pending"); map, never hard-match one literal (W-07).
 */

const CANON = [
  { key: 'PLACED', title: 'Order Placed' },
  { key: 'ASSIGNED', title: 'Delivery Partner Assigned' },
  { key: 'OUT_FOR_DELIVERY', title: 'Out for Delivery' },
  { key: 'DELIVERED', title: 'Delivered' },
];

/** Map any backend status string → a friendly label. */
export const statusLabel = (raw) => {
  const s = String(raw ?? '').toUpperCase().replace(/\s+/g, '_');
  if (s.includes('CANCEL')) return 'Cancelled';
  if (s.includes('FAIL')) return 'Delivery Failed';
  if (s.includes('OUT_FOR') || s === 'OUT') return 'Out for Delivery';
  if (s.includes('DELIVERED') || s.includes('COMPLETE')) return 'Delivered';
  if (s.includes('ASSIGN') || s.includes('LOAD')) return 'Delivery Partner Assigned';
  if (s.includes('PLACED') || s.includes('PENDING')) return 'Order Placed';
  return raw || 'Order Placed';
};

/**
 * Build a dynamic timeline from an order.
 * Prefers `order.history` (real events). Falls back to the canonical progression derived
 * from `deliveryStatus` when history isn't present. Returns [] when there's no order.
 * Each step: { key, title, time, remarks, completed }.
 */
export const buildTimeline = (order) => {
  if (!order || (!order.history && !order.deliveryStatus && !order.status)) return [];

  const history = Array.isArray(order.history) ? order.history : [];
  if (history.length) {
    return history.map((h, i) => ({
      key: String(i),
      title: statusLabel(h?.status),
      time: h?.updatedAt ?? h?.updatedat ?? null,
      remarks: h?.remarks ?? null,
      completed: true,
    }));
  }

  const cur = String(order.deliveryStatus ?? order.status ?? '').toUpperCase().replace(/\s+/g, '_');
  const idx = CANON.findIndex((c) => cur.includes(c.key));
  return CANON.map((c, i) => ({
    key: c.key,
    title: c.title,
    time: i === 0 ? (order.orderDate ?? null) : null,
    remarks: null,
    completed: idx >= 0 ? i <= idx : i === 0,
  }));
};

export const formatOrderTime = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? String(value) : d.toLocaleString();
};
