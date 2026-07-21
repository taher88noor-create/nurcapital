/**
 * Nür Capital — Formatting Utilities
 */

/**
 * Format a price with correct currency for the ticker.
 * LSE-listed ETFs (.L suffix) — Yahoo returns pounds, so display in £.
 */
export function formatPrice(price: number, ticker: string): string {
  const isLse = ticker.endsWith(".L");
  if (isLse) {
    return `£${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
