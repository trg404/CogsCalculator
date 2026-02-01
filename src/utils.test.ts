import { describe, it, expect } from 'vitest'
import { roundCents } from './utils'

describe('roundCents', () => {
  it('rounds to 2 decimal places', () => {
    expect(roundCents(1.234)).toBe(1.23)
    expect(roundCents(1.235)).toBe(1.24)
    expect(roundCents(1.999)).toBe(2)
  })

  it('handles whole numbers', () => {
    expect(roundCents(5)).toBe(5)
    expect(roundCents(100)).toBe(100)
  })

  it('handles negative numbers', () => {
    expect(roundCents(-1.234)).toBe(-1.23)
    expect(roundCents(-1.235)).toBe(-1.24)
  })

  it('handles zero', () => {
    expect(roundCents(0)).toBe(0)
  })
})
