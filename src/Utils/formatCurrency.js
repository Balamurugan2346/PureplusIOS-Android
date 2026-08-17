/**
 * Format a number as Indian Rupees. Single source so ₹ formatting is uniform.
 *   formatCurrency(1240)      -> "₹1,240.00"
 *   formatCurrency(1240, {compact:true}) -> "₹1,240"
 */
export default function formatCurrency(value, { compact = false } = {}) {
  const n = Number(value);
  if (Number.isNaN(n)) return '₹0';
  const fixed = compact ? Math.round(n).toString() : n.toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  // Indian grouping (last 3, then pairs)
  const lastThree = intPart.slice(-3);
  const other = intPart.slice(0, -3);
  const grouped = other
    ? other.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
    : lastThree;
  return decPart ? `₹${grouped}.${decPart}` : `₹${grouped}`;
}
