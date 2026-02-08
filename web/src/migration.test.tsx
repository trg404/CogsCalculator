import { describe, it, expect } from 'vitest'
import { migrateSettings } from './App'

describe('migrateSettings', () => {
  const legacyKiln = {
    hourlyRate: 17,
    minutesPerFiring: 30,
    kilnWorkerCount: 2,
    piecesPerFiring: 20,
  }

  it('returns already-migrated settings unchanged', () => {
    const alreadyMigrated = {
      overhead: {
        fixedCosts: [{ id: '1', name: 'Rent', amount: 2000 }],
        variableCosts: [{ id: '2', name: 'Utilities', amount: 400 }],
      },
      piecesPerMonth: 400,
      glazeCostPerPiece: 0.75,
      kiln: legacyKiln,
    }

    const result = migrateSettings(alreadyMigrated)

    expect(result).toEqual(alreadyMigrated)
    expect(result.overhead.fixedCosts[0].name).toBe('Rent')
  })

  it('migrates legacy monthlyOverhead to fixedCosts "Other" item', () => {
    const legacy = {
      monthlyOverhead: 6000,
      piecesPerMonth: 400,
      glazeCostPerPiece: 0.75,
      kiln: legacyKiln,
    }

    const result = migrateSettings(legacy)

    expect(result.overhead.fixedCosts).toHaveLength(1)
    expect(result.overhead.fixedCosts[0].name).toBe('Other')
    expect(result.overhead.fixedCosts[0].amount).toBe(6000)
    expect(result.overhead.variableCosts).toHaveLength(0)
  })

  it('handles legacy settings with zero monthlyOverhead', () => {
    const legacy = {
      monthlyOverhead: 0,
      piecesPerMonth: 400,
      glazeCostPerPiece: 0.75,
      kiln: legacyKiln,
    }

    const result = migrateSettings(legacy)

    expect(result.overhead.fixedCosts[0].amount).toBe(0)
  })

  it('handles legacy settings with undefined monthlyOverhead', () => {
    const legacy = {
      piecesPerMonth: 400,
      glazeCostPerPiece: 0.75,
      kiln: legacyKiln,
    }

    const result = migrateSettings(legacy)

    expect(result.overhead.fixedCosts[0].amount).toBe(0)
  })

  it('preserves all other settings during migration', () => {
    const legacy = {
      monthlyOverhead: 5000,
      piecesPerMonth: 300,
      glazeCostPerPiece: 1.25,
      kiln: {
        hourlyRate: 20,
        minutesPerFiring: 45,
        kilnWorkerCount: 3,
        piecesPerFiring: 25,
      },
    }

    const result = migrateSettings(legacy)

    expect(result.piecesPerMonth).toBe(300)
    expect(result.glazeCostPerPiece).toBe(1.25)
    expect(result.kiln.hourlyRate).toBe(20)
    expect(result.kiln.piecesPerFiring).toBe(25)
  })
})
