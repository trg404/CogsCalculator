import { describe, it, expect } from 'vitest'

// Import the migration function - we need to extract it or test via the component
// For now, let's create a focused test file

interface LegacyStudioSettings {
  monthlyOverhead?: number
  piecesPerMonth: number
  glazeCostPerPiece: number
  kiln: {
    hourlyRate: number
    minutesPerFiring: number
    kilnWorkerCount: number
    piecesPerFiring: number
  }
  staffRoles: Array<{
    id: string
    name: string
    hourlyRate: number
    minutesPerCustomer: number
    customersSimultaneous: number
  }>
}

interface OverheadSettings {
  fixedCosts: Array<{ id: string; name: string; amount: number }>
  variableCosts: Array<{ id: string; name: string; amount: number }>
}

interface StudioSettings {
  overhead: OverheadSettings
  piecesPerMonth: number
  glazeCostPerPiece: number
  kiln: LegacyStudioSettings['kiln']
  staffRoles: LegacyStudioSettings['staffRoles']
}

// Replicate the migration function for testing
function migrateSettings(stored: LegacyStudioSettings | StudioSettings): StudioSettings {
  if ('overhead' in stored && stored.overhead) {
    return stored as StudioSettings
  }

  const legacy = stored as LegacyStudioSettings
  return {
    overhead: {
      fixedCosts: [
        { id: '1', name: 'Other', amount: legacy.monthlyOverhead || 0 },
      ],
      variableCosts: [],
    },
    piecesPerMonth: legacy.piecesPerMonth,
    glazeCostPerPiece: legacy.glazeCostPerPiece,
    kiln: legacy.kiln,
    staffRoles: legacy.staffRoles,
  }
}

describe('migrateSettings', () => {
  const legacyKiln = {
    hourlyRate: 17,
    minutesPerFiring: 30,
    kilnWorkerCount: 2,
    piecesPerFiring: 20,
  }

  it('returns already-migrated settings unchanged', () => {
    const alreadyMigrated: StudioSettings = {
      overhead: {
        fixedCosts: [{ id: '1', name: 'Rent', amount: 2000 }],
        variableCosts: [{ id: '2', name: 'Utilities', amount: 400 }],
      },
      piecesPerMonth: 400,
      glazeCostPerPiece: 0.75,
      kiln: legacyKiln,
      staffRoles: [],
    }

    const result = migrateSettings(alreadyMigrated)

    expect(result).toEqual(alreadyMigrated)
    expect(result.overhead.fixedCosts[0].name).toBe('Rent')
  })

  it('migrates legacy monthlyOverhead to fixedCosts "Other" item', () => {
    const legacy: LegacyStudioSettings = {
      monthlyOverhead: 6000,
      piecesPerMonth: 400,
      glazeCostPerPiece: 0.75,
      kiln: legacyKiln,
      staffRoles: [],
    }

    const result = migrateSettings(legacy)

    expect(result.overhead.fixedCosts).toHaveLength(1)
    expect(result.overhead.fixedCosts[0].name).toBe('Other')
    expect(result.overhead.fixedCosts[0].amount).toBe(6000)
    expect(result.overhead.variableCosts).toHaveLength(0)
  })

  it('handles legacy settings with zero monthlyOverhead', () => {
    const legacy: LegacyStudioSettings = {
      monthlyOverhead: 0,
      piecesPerMonth: 400,
      glazeCostPerPiece: 0.75,
      kiln: legacyKiln,
      staffRoles: [],
    }

    const result = migrateSettings(legacy)

    expect(result.overhead.fixedCosts[0].amount).toBe(0)
  })

  it('handles legacy settings with undefined monthlyOverhead', () => {
    const legacy: LegacyStudioSettings = {
      piecesPerMonth: 400,
      glazeCostPerPiece: 0.75,
      kiln: legacyKiln,
      staffRoles: [],
    }

    const result = migrateSettings(legacy)

    expect(result.overhead.fixedCosts[0].amount).toBe(0)
  })

  it('preserves all other settings during migration', () => {
    const legacy: LegacyStudioSettings = {
      monthlyOverhead: 5000,
      piecesPerMonth: 300,
      glazeCostPerPiece: 1.25,
      kiln: {
        hourlyRate: 20,
        minutesPerFiring: 45,
        kilnWorkerCount: 3,
        piecesPerFiring: 25,
      },
      staffRoles: [
        { id: '1', name: 'Guide', hourlyRate: 15, minutesPerCustomer: 20, customersSimultaneous: 4 },
      ],
    }

    const result = migrateSettings(legacy)

    expect(result.piecesPerMonth).toBe(300)
    expect(result.glazeCostPerPiece).toBe(1.25)
    expect(result.kiln.hourlyRate).toBe(20)
    expect(result.kiln.piecesPerFiring).toBe(25)
    expect(result.staffRoles).toHaveLength(1)
    expect(result.staffRoles[0].name).toBe('Guide')
  })
})
