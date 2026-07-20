/**
 * Nür Capital — Formatting Utilities
 */

/**
 * Format a price with correct currency for the ticker.
 * LSE-listed ETFs (.L suffix) are priced in GBX (pence), not USD.
 */
export function formatPrice(price: number, ticker: string): string {
  const isLse = ticker.endsWith(".L");
  if (isLse) {
    return `GBX ${price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
