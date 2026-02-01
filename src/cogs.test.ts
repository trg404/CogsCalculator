import { describe, it, expect } from 'vitest';
import { calculateCOGS, calculateLaborCost, calculateProductCost, calculateMultiProductCOGS, allocateLabor } from './cogs';

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

describe('calculateProductCost', () => {
  it('calculates cost from a single ingredient', () => {
    const result = calculateProductCost({
      name: 'Simple Item',
      ingredients: [
        { name: 'flour', quantity: 2, unitCost: 1.50 }
      ]
    });

    expect(result.totalCost).toBe(3);
  });

  it('calculates cost from multiple ingredients', () => {
    const result = calculateProductCost({
      name: 'Cookie',
      ingredients: [
        { name: 'flour', quantity: 2, unitCost: 1.50 },     // $3.00
        { name: 'sugar', quantity: 1, unitCost: 2.00 },     // $2.00
        { name: 'butter', quantity: 0.5, unitCost: 4.00 },  // $2.00
      ]
    });

    expect(result.totalCost).toBe(7);
    expect(result.productName).toBe('Cookie');
  });

  it('returns breakdown by ingredient', () => {
    const result = calculateProductCost({
      name: 'Cookie',
      ingredients: [
        { name: 'flour', quantity: 2, unitCost: 1.50 },
        { name: 'sugar', quantity: 1, unitCost: 2.00 },
      ]
    });

    expect(result.breakdown).toEqual({
      flour: 3,
      sugar: 2,
    });
  });

  it('handles decimal quantities and costs', () => {
    const result = calculateProductCost({
      name: 'Fancy Item',
      ingredients: [
        { name: 'gold flakes', quantity: 0.25, unitCost: 10.00 },
      ]
    });

    expect(result.totalCost).toBe(2.5);
  });

  it('calculates cost per unit when yield is provided', () => {
    const result = calculateProductCost({
      name: 'Cookie Batch',
      ingredients: [
        { name: 'flour', quantity: 5, unitCost: 1.50 },     // $7.50
        { name: 'sugar', quantity: 2, unitCost: 2.00 },     // $4.00
        { name: 'butter', quantity: 1, unitCost: 4.00 },    // $4.00
      ],
      yield: 24  // makes 24 cookies
    });

    // Total: $15.50, per cookie: $0.65 (rounded)
    expect(result.totalCost).toBe(15.5);
    expect(result.costPerUnit).toBe(0.65);
  });
});

describe('calculateMultiProductCOGS', () => {
  it('calculates COGS for multiple products', () => {
    const result = calculateMultiProductCOGS({
      products: [
        { name: 'Cookie', unitCost: 0.65, quantity: 100 },
        { name: 'Cake', unitCost: 5.00, quantity: 20 },
      ],
      shippingCost: 50,
      laborCost: 200,
    });

    // Products: (0.65 * 100) + (5 * 20) = 65 + 100 = 165
    // Total: 165 + 50 + 200 = 415
    expect(result.totalCOGS).toBe(415);
  });

  it('returns breakdown by product', () => {
    const result = calculateMultiProductCOGS({
      products: [
        { name: 'Cookie', unitCost: 1, quantity: 50 },
        { name: 'Cake', unitCost: 10, quantity: 10 },
      ],
      shippingCost: 20,
      laborCost: 80,
    });

    expect(result.byProduct).toEqual({
      Cookie: { quantity: 50, productCost: 50 },
      Cake: { quantity: 10, productCost: 100 },
    });
  });

  it('calculates cost per unit with shared costs distributed', () => {
    const result = calculateMultiProductCOGS({
      products: [
        { name: 'Cookie', unitCost: 0.50, quantity: 100 },
        { name: 'Muffin', unitCost: 0.75, quantity: 100 },
      ],
      shippingCost: 20,
      laborCost: 80,
    });

    // Products total: 50 + 75 = 125
    // Shared costs: 20 + 80 = 100
    // Total units: 200
    // Shared cost per unit: 100 / 200 = 0.50
    // Cookie total per unit: 0.50 + 0.50 = 1.00
    // Muffin total per unit: 0.75 + 0.50 = 1.25
    expect(result.costPerUnit).toEqual({
      Cookie: 1,
      Muffin: 1.25,
    });
  });

  it('integrates with calculateProductCost', () => {
    const cookie = calculateProductCost({
      name: 'Cookie',
      ingredients: [
        { name: 'flour', quantity: 1, unitCost: 1.50 },
        { name: 'sugar', quantity: 0.5, unitCost: 2.00 },
      ],
      yield: 12
    });

    const result = calculateMultiProductCOGS({
      products: [
        { name: cookie.productName, unitCost: cookie.costPerUnit!, quantity: 24 },
      ],
      shippingCost: 10,
      laborCost: 40,
    });

    // Cookie cost per unit: (1.50 + 1.00) / 12 = 0.21 (rounded)
    // Products: 0.21 * 24 = 5.04
    // Total: 5.04 + 10 + 40 = 55.04
    expect(result.totalCOGS).toBeCloseTo(55, 0);
  });

  it('handles empty products array', () => {
    const result = calculateMultiProductCOGS({
      products: [],
      shippingCost: 10,
      laborCost: 20,
    });

    expect(result.totalCOGS).toBe(30);
    expect(result.totalProductCost).toBe(0);
  });
});

describe('allocateLabor', () => {
  it('calculates pro-rated labor cost for a single product', () => {
    const result = allocateLabor({
      employees: [
        { hourlyRate: 15, hoursWorked: 8 }  // $120 total
      ],
      allocations: {
        'Cookie': [{ employeeIndex: 0, percentage: 25 }]  // 25% of shift
      }
    });

    // $120 * 25% = $30
    expect(result.laborByProduct['Cookie']).toBe(30);
  });

  it('calculates labor for multiple employees on one product', () => {
    const result = allocateLabor({
      employees: [
        { hourlyRate: 15, hoursWorked: 8 },  // $120 total
        { hourlyRate: 20, hoursWorked: 8 }   // $160 total
      ],
      allocations: {
        'Cookie': [
          { employeeIndex: 0, percentage: 50 },  // $60
          { employeeIndex: 1, percentage: 25 }   // $40
        ]
      }
    });

    // $60 + $40 = $100
    expect(result.laborByProduct['Cookie']).toBe(100);
  });

  it('calculates labor for multiple products', () => {
    const result = allocateLabor({
      employees: [
        { hourlyRate: 20, hoursWorked: 8 }  // $160 total
      ],
      allocations: {
        'Cookie': [{ employeeIndex: 0, percentage: 25 }],   // $40
        'Muffin': [{ employeeIndex: 0, percentage: 50 }]    // $80
      }
    });

    expect(result.laborByProduct['Cookie']).toBe(40);
    expect(result.laborByProduct['Muffin']).toBe(80);
    expect(result.totalAllocated).toBe(120);
  });

  it('tracks unallocated labor', () => {
    const result = allocateLabor({
      employees: [
        { hourlyRate: 20, hoursWorked: 8 }  // $160 total
      ],
      allocations: {
        'Cookie': [{ employeeIndex: 0, percentage: 25 }]  // $40 allocated
      }
    });

    // $160 total - $40 allocated = $120 unallocated
    expect(result.unallocatedLabor).toBe(120);
  });

  it('handles 100% allocation to single product', () => {
    const result = allocateLabor({
      employees: [
        { hourlyRate: 15, hoursWorked: 8 }
      ],
      allocations: {
        'Cookie': [{ employeeIndex: 0, percentage: 100 }]
      }
    });

    expect(result.laborByProduct['Cookie']).toBe(120);
    expect(result.unallocatedLabor).toBe(0);
  });

  it('returns breakdown by employee per product', () => {
    const result = allocateLabor({
      employees: [
        { hourlyRate: 15, hoursWorked: 8, role: 'baker' },
        { hourlyRate: 12, hoursWorked: 8, role: 'assistant' }
      ],
      allocations: {
        'Cookie': [
          { employeeIndex: 0, percentage: 50 },
          { employeeIndex: 1, percentage: 25 }
        ]
      }
    });

    expect(result.detailByProduct['Cookie']).toEqual([
      { role: 'baker', percentage: 50, cost: 60 },
      { role: 'assistant', percentage: 25, cost: 24 }
    ]);
  });

  it('handles empty allocations', () => {
    const result = allocateLabor({
      employees: [
        { hourlyRate: 15, hoursWorked: 8 }
      ],
      allocations: {}
    });

    expect(result.totalAllocated).toBe(0);
    expect(result.unallocatedLabor).toBe(120);
  });
});
