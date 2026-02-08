/**
 * Rounds a dollar amount to the nearest cent (two decimal places).
 *
 * JavaScript floating-point math can produce results like 1.005000000000001,
 * so we multiply by 100, round to a whole number, then divide back by 100
 * to get a clean dollar-and-cents value (e.g. 1.01).
 */
export function roundCents(value: number): number {
  return Math.round(value * 100) / 100
}
