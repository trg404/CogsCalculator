import { describe, it, expect } from 'vitest'
import {
  calculateStaffLaborCost,
  calculateKilnLaborCost,
  calculateOverheadCost,
  calculatePieceCOGS,
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
})
