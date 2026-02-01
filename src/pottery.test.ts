import { describe, it, expect } from 'vitest'
import { calculateStaffLaborCost, calculateKilnLaborCost } from './pottery'

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
})
