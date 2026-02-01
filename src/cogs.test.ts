import { describe, it, expect } from 'vitest';
import { calculateCOGS, calculateLaborCost } from './cogs';

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

describe('calculateLaborCost', () => {
  it('calculates labor cost for a single employee', () => {
    const result = calculateLaborCost({
      employees: [
        { hourlyRate: 15, hoursWorked: 8 }
      ]
    });

    expect(result.totalLaborCost).toBe(120);
  });

  it('calculates labor cost for multiple employees at same rate', () => {
    const result = calculateLaborCost({
      employees: [
        { hourlyRate: 15, hoursWorked: 8 },
        { hourlyRate: 15, hoursWorked: 8 },
        { hourlyRate: 15, hoursWorked: 8 }
      ]
    });

    expect(result.totalLaborCost).toBe(360);
    expect(result.employeeCount).toBe(3);
  });

  it('calculates labor cost for employees at different pay scales', () => {
    const result = calculateLaborCost({
      employees: [
        { hourlyRate: 12, hoursWorked: 8, role: 'stocker' },
        { hourlyRate: 18, hoursWorked: 8, role: 'cashier' },
        { hourlyRate: 25, hoursWorked: 8, role: 'supervisor' }
      ]
    });

    // 12*8 + 18*8 + 25*8 = 96 + 144 + 200 = 440
    expect(result.totalLaborCost).toBe(440);
  });

  it('returns breakdown by role', () => {
    const result = calculateLaborCost({
      employees: [
        { hourlyRate: 12, hoursWorked: 8, role: 'stocker' },
        { hourlyRate: 12, hoursWorked: 8, role: 'stocker' },
        { hourlyRate: 18, hoursWorked: 8, role: 'cashier' }
      ]
    });

    expect(result.byRole).toEqual({
      stocker: { count: 2, totalCost: 192 },
      cashier: { count: 1, totalCost: 144 }
    });
  });

  it('calculates staff on duty for a given shift', () => {
    const result = calculateLaborCost({
      employees: [
        { hourlyRate: 15, hoursWorked: 8, shift: 'morning' },
        { hourlyRate: 15, hoursWorked: 8, shift: 'morning' },
        { hourlyRate: 15, hoursWorked: 8, shift: 'evening' }
      ]
    });

    expect(result.byShift).toEqual({
      morning: { count: 2, totalCost: 240 },
      evening: { count: 1, totalCost: 120 }
    });
  });

  it('returns zero for empty employees array', () => {
    const result = calculateLaborCost({
      employees: []
    });

    expect(result.totalLaborCost).toBe(0);
    expect(result.employeeCount).toBe(0);
  });

  it('handles part-time hours correctly', () => {
    const result = calculateLaborCost({
      employees: [
        { hourlyRate: 15, hoursWorked: 4 },
        { hourlyRate: 15, hoursWorked: 6 }
      ]
    });

    // 15*4 + 15*6 = 60 + 90 = 150
    expect(result.totalLaborCost).toBe(150);
  });

  it('handles decimal hourly rates', () => {
    const result = calculateLaborCost({
      employees: [
        { hourlyRate: 15.50, hoursWorked: 8 }
      ]
    });

    expect(result.totalLaborCost).toBe(124);
  });

  it('calculates average cost per employee', () => {
    const result = calculateLaborCost({
      employees: [
        { hourlyRate: 10, hoursWorked: 8 },
        { hourlyRate: 20, hoursWorked: 8 }
      ]
    });

    // (80 + 160) / 2 = 120
    expect(result.averageCostPerEmployee).toBe(120);
  });

  it('groups employees without role as unassigned when others have roles', () => {
    const result = calculateLaborCost({
      employees: [
        { hourlyRate: 15, hoursWorked: 8, role: 'cashier' },
        { hourlyRate: 12, hoursWorked: 8 }
      ]
    });

    expect(result.byRole).toEqual({
      cashier: { count: 1, totalCost: 120 },
      unassigned: { count: 1, totalCost: 96 }
    });
  });

  it('integrates with calculateCOGS', () => {
    const laborResult = calculateLaborCost({
      employees: [
        { hourlyRate: 15, hoursWorked: 8 },
        { hourlyRate: 15, hoursWorked: 8 }
      ]
    });

    const cogsResult = calculateCOGS({
      purchaseCost: 500,
      shippingCost: 50,
      laborCost: laborResult.totalLaborCost,
      quantity: 100
    });

    // 500 + 50 + 240 = 790, per unit = 7.90
    expect(cogsResult.totalCOGS).toBe(790);
    expect(cogsResult.costPerUnit).toBe(7.9);
  });
});
