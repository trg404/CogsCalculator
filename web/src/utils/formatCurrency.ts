/**
 * Formats a number as a US dollar string with commas and two decimal places.
 *
 * Examples:
 *   formatCurrency(1234.5)  => "$1,234.50"
 *   formatCurrency(0)       => "$0.00"
 *   formatCurrency(15)      => "$15.00"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}
