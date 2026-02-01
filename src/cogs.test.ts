import { describe, it, expect } from 'vitest';
import { calculateCOGS } from './cogs';

describe('calculateCOGS', () => {
  it('calculates total COGS from purchase cost, shipping, and labor', () => {
    const result = calculateCOGS({
      purchaseCost: 100,
      shippingCost: 15,
      laborCost: 25,
    });

    expect(result.totalCOGS).toBe(140);
  });

  it('calculates cost per unit when quantity is provided', () => {
    const result = calculateCOGS({
      purchaseCost: 100,
      shippingCost: 20,
      laborCost: 30,
      quantity: 10,
    });

    expect(result.totalCOGS).toBe(150);
    expect(result.costPerUnit).toBe(15);
  });

  it('handles decimal values correctly', () => {
    const result = calculateCOGS({
      purchaseCost: 99.99,
      shippingCost: 12.50,
      laborCost: 7.51,
    });

    expect(result.totalCOGS).toBe(120);
  });

  it('returns itemized breakdown of costs', () => {
    const result = calculateCOGS({
      purchaseCost: 50,
      shippingCost: 10,
      laborCost: 5,
    });

    expect(result.breakdown).toEqual({
      purchaseCost: 50,
      shippingCost: 10,
      laborCost: 5,
    });
  });
});
