import { describe, it, expect } from 'vitest'
import {
  calculateStaffLaborCost,
  calculateKilnLaborCost,
  calculateOverheadCost,
  calculatePieceCOGS,
  sumOverheadItems,
  calculateTotalOverhead,
} from './pottery'

describe('calculateStaffLaborCost', () => {
  it('calculates glazing guide cost per piece with simultaneous customers', () => {
    const result = calculateStaffLaborCost({
      hourlyRate: 15,
      minutesPerCustomer: 20,
      customersSimultaneous: 4,
    })

    // ($15 × 20min / 60) / 4 = $1.25
    expect(result).toBe(1.25)
  })

  it('returns 0 when customersSimultaneous is 0 (avoids division by zero)', () => {
    const result = calculateStaffLaborCost({
      hourlyRate: 15,
      minutesPerCustomer: 20,
      customersSimultaneous: 0,
    })

    expect(result).toBe(0)
  })

  it('returns 0 when hourlyRate is negative', () => {
    const result = calculateStaffLaborCost({
      hourlyRate: -15,
      minutesPerCustomer: 20,
      customersSimultaneous: 4,
    })

    expect(result).toBe(0)
  })

  it('returns 0 when minutesPerCustomer is negative', () => {
    const result = calculateStaffLaborCost({
      hourlyRate: 15,
      minutesPerCustomer: -20,
      customersSimultaneous: 4,
    })

    expect(result).toBe(0)
  })

  it('returns 0 when customersSimultaneous is negative', () => {
    const result = calculateStaffLaborCost({
      hourlyRate: 15,
      minutesPerCustomer: 20,
      customersSimultaneous: -1,
    })

    expect(result).toBe(0)
  })
})

describe('calculateKilnLaborCost', () => {
  it('calculates kiln worker cost per piece from batch', () => {
    const result = calculateKilnLaborCost({
      hourlyRate: 17,
      minutesPerFiring: 30,
      kilnWorkerCount: 2,
      piecesPerFiring: 20,
    })

    // ($17 × 30min / 60 × 2 workers) / 20 pieces = $0.85
    expect(result).toBe(0.85)
  })

  it('returns 0 when piecesPerFiring is 0 (avoids division by zero)', () => {
    const result = calculateKilnLaborCost({
      hourlyRate: 17,
      minutesPerFiring: 30,
      kilnWorkerCount: 2,
      piecesPerFiring: 0,
    })

    expect(result).toBe(0)
  })

  it('returns 0 when hourlyRate is negative', () => {
    const result = calculateKilnLaborCost({
      hourlyRate: -17,
      minutesPerFiring: 30,
      kilnWorkerCount: 2,
      piecesPerFiring: 20,
    })

    expect(result).toBe(0)
  })

  it('returns 0 when kilnWorkerCount is negative', () => {
    const result = calculateKilnLaborCost({
      hourlyRate: 17,
      minutesPerFiring: 30,
      kilnWorkerCount: -2,
      piecesPerFiring: 20,
    })

    expect(result).toBe(0)
  })

  it('returns 0 when minutesPerFiring is negative', () => {
    const result = calculateKilnLaborCost({
      hourlyRate: 17,
      minutesPerFiring: -30,
      kilnWorkerCount: 2,
      piecesPerFiring: 20,
    })

    expect(result).toBe(0)
  })

  it('returns 0 when piecesPerFiring is negative', () => {
    const result = calculateKilnLaborCost({
      hourlyRate: 17,
      minutesPerFiring: 30,
      kilnWorkerCount: 2,
      piecesPerFiring: -5,
    })

    expect(result).toBe(0)
  })
})

describe('calculateOverheadCost', () => {
  it('calculates overhead per piece from monthly totals', () => {
    const result = calculateOverheadCost({
      monthlyOverhead: 6000,
      piecesPerMonth: 400,
    })

    // $6000 / 400 = $15.00
    expect(result).toBe(15)
  })

  it('handles decimal results', () => {
    const result = calculateOverheadCost({
      monthlyOverhead: 5000,
      piecesPerMonth: 300,
    })

    // $5000 / 300 = $16.67 (rounded)
    expect(result).toBe(16.67)
  })

  it('returns 0 when monthlyOverhead is negative', () => {
    const result = calculateOverheadCost({
      monthlyOverhead: -6000,
      piecesPerMonth: 400,
    })

    expect(result).toBe(0)
  })

  it('returns 0 when piecesPerMonth is 0 (avoids division by zero)', () => {
    const result = calculateOverheadCost({
      monthlyOverhead: 6000,
      piecesPerMonth: 0,
    })

    expect(result).toBe(0)
  })

  it('returns 0 when piecesPerMonth is negative', () => {
    const result = calculateOverheadCost({
      monthlyOverhead: 6000,
      piecesPerMonth: -100,
    })

    expect(result).toBe(0)
  })
})

describe('sumOverheadItems', () => {
  it('sums all item amounts', () => {
    const items = [
      { id: '1', name: 'Rent', amount: 2000 },
      { id: '2', name: 'Insurance', amount: 300 },
    ]
    const result = sumOverheadItems(items)
    expect(result).toBe(2300)
  })

  it('returns 0 for empty array', () => {
    const result = sumOverheadItems([])
    expect(result).toBe(0)
  })

  it('ignores negative amounts', () => {
    const items = [
      { id: '1', name: 'Rent', amount: 2000 },
      { id: '2', name: 'Bad', amount: -500 },
    ]
    const result = sumOverheadItems(items)
    expect(result).toBe(2000)
  })
})

describe('calculateTotalOverhead', () => {
  it('sums fixed and variable costs', () => {
    const overhead = {
      fixedCosts: [
        { id: '1', name: 'Rent', amount: 2000 },
        { id: '2', name: 'Insurance', amount: 300 },
      ],
      variableCosts: [
        { id: '3', name: 'Utilities', amount: 400 },
      ],
    }
    const result = calculateTotalOverhead(overhead)
    expect(result).toBe(2700)
  })

  it('returns 0 when both categories are empty', () => {
    const result = calculateTotalOverhead({ fixedCosts: [], variableCosts: [] })
    expect(result).toBe(0)
  })

  it('handles one empty category', () => {
    const result = calculateTotalOverhead({
      fixedCosts: [{ id: '1', name: 'Rent', amount: 2000 }],
      variableCosts: [],
    })
    expect(result).toBe(2000)
  })
})

describe('calculatePieceCOGS', () => {
  it('calculates total COGS for a piece with full breakdown', () => {
    const result = calculatePieceCOGS({
      bisqueCost: 4.50,
      glazeCostPerPiece: 0.75,
      staffRoles: [
        { name: 'Glazing Guide', hourlyRate: 15, minutesPerCustomer: 20, customersSimultaneous: 4 },
        { name: 'Manager', hourlyRate: 20, minutesPerCustomer: 5, customersSimultaneous: 3 },
      ],
      kiln: {
        hourlyRate: 17,
        minutesPerFiring: 30,
        kilnWorkerCount: 2,
        piecesPerFiring: 20,
      },
      overhead: {
        monthlyOverhead: 6000,
        piecesPerMonth: 400,
      },
    })

    // Bisque: $4.50
    // Glaze: $0.75
    // Glazing Guide: ($15 × 20 / 60) / 4 = $1.25
    // Manager: ($20 × 5 / 60) / 3 = $0.56
    // Kiln: ($17 × 30 / 60 × 2) / 20 = $0.85
    // Overhead: $6000 / 400 = $15.00
    // Total: 4.50 + 0.75 + 1.25 + 0.56 + 0.85 + 15.00 = $22.91

    expect(result.totalCOGS).toBe(22.91)
    expect(result.breakdown.bisqueCost).toBe(4.5)
    expect(result.breakdown.glazeCost).toBe(0.75)
    expect(result.breakdown.laborByRole['Glazing Guide']).toBe(1.25)
    expect(result.breakdown.laborByRole['Manager']).toBe(0.56)
    expect(result.breakdown.kilnCost).toBe(0.85)
    expect(result.breakdown.overheadCost).toBe(15)
  })

  it('handles empty staffRoles array (no staff labor)', () => {
    const result = calculatePieceCOGS({
      bisqueCost: 4.50,
      glazeCostPerPiece: 0.75,
      staffRoles: [],
      kiln: {
        hourlyRate: 17,
        minutesPerFiring: 30,
        kilnWorkerCount: 2,
        piecesPerFiring: 20,
      },
      overhead: {
        monthlyOverhead: 6000,
        piecesPerMonth: 400,
      },
    })

    // No staff labor, so total = bisque + glaze + kiln + overhead
    // 4.50 + 0.75 + 0.85 + 15.00 = $21.10
    expect(result.totalCOGS).toBe(21.10)
    expect(result.breakdown.laborTotal).toBe(0)
    expect(Object.keys(result.breakdown.laborByRole)).toHaveLength(0)
  })

  it('handles all-zero inputs', () => {
    const result = calculatePieceCOGS({
      bisqueCost: 0,
      glazeCostPerPiece: 0,
      staffRoles: [],
      kiln: {
        hourlyRate: 0,
        minutesPerFiring: 0,
        kilnWorkerCount: 0,
        piecesPerFiring: 1,
      },
      overhead: {
        monthlyOverhead: 0,
        piecesPerMonth: 1,
      },
    })

    expect(result.totalCOGS).toBe(0)
  })

  it('works with a single staff role', () => {
    const result = calculatePieceCOGS({
      bisqueCost: 3.00,
      glazeCostPerPiece: 0.50,
      staffRoles: [
        { name: 'Guide', hourlyRate: 15, minutesPerCustomer: 30, customersSimultaneous: 3 },
      ],
      kiln: {
        hourlyRate: 17,
        minutesPerFiring: 30,
        kilnWorkerCount: 1,
        piecesPerFiring: 10,
      },
      overhead: {
        monthlyOverhead: 3000,
        piecesPerMonth: 200,
      },
    })

    // Guide: ($15 × 30/60) / 3 = $2.50
    // Kiln: ($17 × 30/60) × 1 / 10 = $0.85
    // Overhead: $3000 / 200 = $15.00
    // Total: 3.00 + 0.50 + 2.50 + 0.85 + 15.00 = $21.85
    expect(result.totalCOGS).toBe(21.85)
    expect(result.breakdown.laborByRole['Guide']).toBe(2.50)
  })

  it('handles duplicate role names (last one wins in laborByRole)', () => {
    const result = calculatePieceCOGS({
      bisqueCost: 0,
      glazeCostPerPiece: 0,
      staffRoles: [
        { name: 'Guide', hourlyRate: 15, minutesPerCustomer: 60, customersSimultaneous: 1 },
        { name: 'Guide', hourlyRate: 20, minutesPerCustomer: 60, customersSimultaneous: 1 },
      ],
      kiln: { hourlyRate: 0, minutesPerFiring: 0, kilnWorkerCount: 0, piecesPerFiring: 1 },
      overhead: { monthlyOverhead: 0, piecesPerMonth: 1 },
    })

    // Both roles contribute to laborTotal even though they share a name
    // First Guide: $15, Second Guide: $20, total labor: $35
    expect(result.breakdown.laborTotal).toBe(35)
    // laborByRole only keeps the last value for a duplicate key
    expect(result.breakdown.laborByRole['Guide']).toBe(20)
  })
})
