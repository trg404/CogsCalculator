import { describe, it, expect } from 'vitest'
import { calculateStaffLaborCost } from './pottery'

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
