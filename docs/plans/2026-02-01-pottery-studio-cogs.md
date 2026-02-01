# Pottery Studio COGS Calculator - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the generic COGS calculator with a pottery-studio-specific version that calculates the true cost per bisque piece including labor, supplies, and overhead.

**Architecture:** New calculation module (`src/pottery.ts`) with studio-specific formulas. New React components replace the generic forms. localStorage persists catalog and settings.

**Tech Stack:** TypeScript, React 19, Vite, Vitest, @testing-library/react

---

## Task 1: Create Pottery COGS Calculation Module

**Files:**
- Create: `src/pottery.ts`
- Create: `src/pottery.test.ts`

**Step 1: Write failing test for labor cost calculation**

```typescript
// src/pottery.test.ts
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
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/pottery.test.ts`
Expected: FAIL with "calculateStaffLaborCost is not exported"

**Step 3: Write minimal implementation**

```typescript
// src/pottery.ts
interface StaffLaborInput {
  hourlyRate: number
  minutesPerCustomer: number
  customersSimultaneous: number
}

export function calculateStaffLaborCost(input: StaffLaborInput): number {
  const { hourlyRate, minutesPerCustomer, customersSimultaneous } = input
  const cost = (hourlyRate * minutesPerCustomer / 60) / customersSimultaneous
  return Math.round(cost * 100) / 100
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/pottery.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/pottery.ts src/pottery.test.ts
git commit -m "feat(pottery): add staff labor cost calculation"
```

---

## Task 2: Add Kiln Labor Cost Calculation

**Files:**
- Modify: `src/pottery.ts`
- Modify: `src/pottery.test.ts`

**Step 1: Write failing test for kiln labor**

```typescript
// Add to src/pottery.test.ts
import { calculateStaffLaborCost, calculateKilnLaborCost } from './pottery'

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
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/pottery.test.ts`
Expected: FAIL with "calculateKilnLaborCost is not exported"

**Step 3: Write minimal implementation**

```typescript
// Add to src/pottery.ts
interface KilnLaborInput {
  hourlyRate: number
  minutesPerFiring: number
  kilnWorkerCount: number
  piecesPerFiring: number
}

export function calculateKilnLaborCost(input: KilnLaborInput): number {
  const { hourlyRate, minutesPerFiring, kilnWorkerCount, piecesPerFiring } = input
  const totalLaborCost = (hourlyRate * minutesPerFiring / 60) * kilnWorkerCount
  const costPerPiece = totalLaborCost / piecesPerFiring
  return Math.round(costPerPiece * 100) / 100
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/pottery.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/pottery.ts src/pottery.test.ts
git commit -m "feat(pottery): add kiln labor cost calculation"
```

---

## Task 3: Add Overhead Cost Calculation

**Files:**
- Modify: `src/pottery.ts`
- Modify: `src/pottery.test.ts`

**Step 1: Write failing test for overhead**

```typescript
// Add to src/pottery.test.ts
import { calculateStaffLaborCost, calculateKilnLaborCost, calculateOverheadCost } from './pottery'

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
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/pottery.test.ts`
Expected: FAIL with "calculateOverheadCost is not exported"

**Step 3: Write minimal implementation**

```typescript
// Add to src/pottery.ts
interface OverheadInput {
  monthlyOverhead: number
  piecesPerMonth: number
}

export function calculateOverheadCost(input: OverheadInput): number {
  const { monthlyOverhead, piecesPerMonth } = input
  if (piecesPerMonth === 0) return 0
  const costPerPiece = monthlyOverhead / piecesPerMonth
  return Math.round(costPerPiece * 100) / 100
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/pottery.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/pottery.ts src/pottery.test.ts
git commit -m "feat(pottery): add overhead cost calculation"
```

---

## Task 4: Add Full Piece COGS Calculation

**Files:**
- Modify: `src/pottery.ts`
- Modify: `src/pottery.test.ts`

**Step 1: Write failing test for full COGS**

```typescript
// Add to src/pottery.test.ts
import {
  calculateStaffLaborCost,
  calculateKilnLaborCost,
  calculateOverheadCost,
  calculatePieceCOGS,
} from './pottery'

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
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/pottery.test.ts`
Expected: FAIL with "calculatePieceCOGS is not exported"

**Step 3: Write minimal implementation**

```typescript
// Add to src/pottery.ts
interface StaffRole {
  name: string
  hourlyRate: number
  minutesPerCustomer: number
  customersSimultaneous: number
}

interface PieceCOGSInput {
  bisqueCost: number
  glazeCostPerPiece: number
  staffRoles: StaffRole[]
  kiln: KilnLaborInput
  overhead: OverheadInput
}

interface PieceCOGSBreakdown {
  bisqueCost: number
  glazeCost: number
  laborByRole: Record<string, number>
  laborTotal: number
  kilnCost: number
  overheadCost: number
}

interface PieceCOGSResult {
  totalCOGS: number
  breakdown: PieceCOGSBreakdown
}

export function calculatePieceCOGS(input: PieceCOGSInput): PieceCOGSResult {
  const { bisqueCost, glazeCostPerPiece, staffRoles, kiln, overhead } = input

  const laborByRole: Record<string, number> = {}
  let laborTotal = 0

  for (const role of staffRoles) {
    const cost = calculateStaffLaborCost({
      hourlyRate: role.hourlyRate,
      minutesPerCustomer: role.minutesPerCustomer,
      customersSimultaneous: role.customersSimultaneous,
    })
    laborByRole[role.name] = cost
    laborTotal += cost
  }

  laborTotal = Math.round(laborTotal * 100) / 100

  const kilnCost = calculateKilnLaborCost(kiln)
  const overheadCost = calculateOverheadCost(overhead)

  const totalCOGS = Math.round(
    (bisqueCost + glazeCostPerPiece + laborTotal + kilnCost + overheadCost) * 100
  ) / 100

  return {
    totalCOGS,
    breakdown: {
      bisqueCost,
      glazeCost: glazeCostPerPiece,
      laborByRole,
      laborTotal,
      kilnCost,
      overheadCost,
    },
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/pottery.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/pottery.ts src/pottery.test.ts
git commit -m "feat(pottery): add full piece COGS calculation with breakdown"
```

---

## Task 5: Add TypeScript Types for UI State

**Files:**
- Create: `web/src/types/pottery.ts`

**Step 1: Create types file**

```typescript
// web/src/types/pottery.ts
export interface BisquePiece {
  id: string
  name: string
  wholesaleCost: number
}

export interface StaffRole {
  id: string
  name: string
  hourlyRate: number
  minutesPerCustomer: number
  customersSimultaneous: number
}

export interface KilnSettings {
  hourlyRate: number
  minutesPerFiring: number
  kilnWorkerCount: number
  piecesPerFiring: number
}

export interface StudioSettings {
  monthlyOverhead: number
  piecesPerMonth: number
  glazeCostPerPiece: number
  kiln: KilnSettings
  staffRoles: StaffRole[]
}

export interface COGSBreakdown {
  bisqueCost: number
  glazeCost: number
  laborByRole: Record<string, number>
  laborTotal: number
  kilnCost: number
  overheadCost: number
}

export interface COGSResult {
  totalCOGS: number
  breakdown: COGSBreakdown
}
```

**Step 2: Commit**

```bash
git add web/src/types/pottery.ts
git commit -m "feat(pottery): add TypeScript types for UI state"
```

---

## Task 6: Create BisqueCatalogManager Component

**Files:**
- Create: `web/src/components/BisqueCatalogManager.tsx`
- Create: `web/src/components/BisqueCatalogManager.test.tsx`

**Step 1: Write failing test for rendering**

```typescript
// web/src/components/BisqueCatalogManager.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BisqueCatalogManager from './BisqueCatalogManager'
import { BisquePiece } from '../types/pottery'

describe('BisqueCatalogManager', () => {
  const emptyPiece: BisquePiece = { id: '1', name: '', wholesaleCost: 0 }

  it('renders add piece button', () => {
    render(<BisqueCatalogManager pieces={[]} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /add piece/i })).toBeInTheDocument()
  })

  it('renders piece name and cost inputs', () => {
    render(<BisqueCatalogManager pieces={[emptyPiece]} onChange={() => {}} />)
    expect(screen.getByLabelText('Piece Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Wholesale Cost')).toBeInTheDocument()
  })

  it('calls onChange when piece name changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<BisqueCatalogManager pieces={[emptyPiece]} onChange={onChange} />)

    await user.type(screen.getByLabelText('Piece Name'), 'Snowman')
    expect(onChange).toHaveBeenCalled()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd web && npm test -- src/components/BisqueCatalogManager.test.tsx`
Expected: FAIL with "Cannot find module"

**Step 3: Write minimal implementation**

```typescript
// web/src/components/BisqueCatalogManager.tsx
import { BisquePiece } from '../types/pottery'

interface Props {
  pieces: BisquePiece[]
  onChange: (pieces: BisquePiece[]) => void
}

export default function BisqueCatalogManager({ pieces, onChange }: Props) {
  const addPiece = () => {
    onChange([...pieces, { id: crypto.randomUUID(), name: '', wholesaleCost: 0 }])
  }

  const updatePiece = (id: string, field: keyof BisquePiece, value: string | number) => {
    onChange(
      pieces.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    )
  }

  const removePiece = (id: string) => {
    onChange(pieces.filter((p) => p.id !== id))
  }

  return (
    <section className="form-section">
      <h2>Bisque Catalog</h2>
      {pieces.map((piece) => (
        <div key={piece.id} className="piece-row">
          <label>
            Piece Name
            <input
              type="text"
              value={piece.name}
              onChange={(e) => updatePiece(piece.id, 'name', e.target.value)}
            />
          </label>
          <label>
            Wholesale Cost
            <input
              type="number"
              step="0.01"
              min="0"
              value={piece.wholesaleCost || ''}
              onChange={(e) => updatePiece(piece.id, 'wholesaleCost', parseFloat(e.target.value) || 0)}
            />
          </label>
          {pieces.length > 1 && (
            <button type="button" onClick={() => removePiece(piece.id)}>×</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addPiece}>Add Piece</button>
    </section>
  )
}
```

**Step 4: Run test to verify it passes**

Run: `cd web && npm test -- src/components/BisqueCatalogManager.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add web/src/components/BisqueCatalogManager.tsx web/src/components/BisqueCatalogManager.test.tsx
git commit -m "feat(pottery): add BisqueCatalogManager component"
```

---

## Task 7: Create StudioSettingsForm Component

**Files:**
- Create: `web/src/components/StudioSettingsForm.tsx`
- Create: `web/src/components/StudioSettingsForm.test.tsx`

**Step 1: Write failing test**

```typescript
// web/src/components/StudioSettingsForm.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudioSettingsForm from './StudioSettingsForm'
import { StudioSettings } from '../types/pottery'

const defaultSettings: StudioSettings = {
  monthlyOverhead: 0,
  piecesPerMonth: 0,
  glazeCostPerPiece: 0,
  kiln: {
    hourlyRate: 17,
    minutesPerFiring: 30,
    kilnWorkerCount: 2,
    piecesPerFiring: 20,
  },
  staffRoles: [],
}

describe('StudioSettingsForm', () => {
  it('renders overhead input', () => {
    render(<StudioSettingsForm settings={defaultSettings} onChange={() => {}} />)
    expect(screen.getByLabelText('Monthly Overhead ($)')).toBeInTheDocument()
  })

  it('renders pieces per month input', () => {
    render(<StudioSettingsForm settings={defaultSettings} onChange={() => {}} />)
    expect(screen.getByLabelText('Pieces per Month')).toBeInTheDocument()
  })

  it('renders glaze cost input', () => {
    render(<StudioSettingsForm settings={defaultSettings} onChange={() => {}} />)
    expect(screen.getByLabelText('Glaze Cost per Piece ($)')).toBeInTheDocument()
  })

  it('renders kiln settings', () => {
    render(<StudioSettingsForm settings={defaultSettings} onChange={() => {}} />)
    expect(screen.getByLabelText('Kiln Worker Rate ($/hr)')).toBeInTheDocument()
    expect(screen.getByLabelText('Minutes per Firing')).toBeInTheDocument()
    expect(screen.getByLabelText('Kiln Workers')).toBeInTheDocument()
    expect(screen.getByLabelText('Pieces per Firing')).toBeInTheDocument()
  })

  it('calls onChange when overhead changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StudioSettingsForm settings={defaultSettings} onChange={onChange} />)

    await user.type(screen.getByLabelText('Monthly Overhead ($)'), '5000')
    expect(onChange).toHaveBeenCalled()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd web && npm test -- src/components/StudioSettingsForm.test.tsx`
Expected: FAIL with "Cannot find module"

**Step 3: Write minimal implementation**

```typescript
// web/src/components/StudioSettingsForm.tsx
import { StudioSettings } from '../types/pottery'

interface Props {
  settings: StudioSettings
  onChange: (settings: StudioSettings) => void
}

export default function StudioSettingsForm({ settings, onChange }: Props) {
  const updateField = <K extends keyof StudioSettings>(field: K, value: StudioSettings[K]) => {
    onChange({ ...settings, [field]: value })
  }

  const updateKiln = <K extends keyof StudioSettings['kiln']>(
    field: K,
    value: StudioSettings['kiln'][K]
  ) => {
    onChange({ ...settings, kiln: { ...settings.kiln, [field]: value } })
  }

  return (
    <section className="form-section">
      <h2>Studio Settings</h2>

      <div className="settings-group">
        <h3>Overhead & Volume</h3>
        <label>
          Monthly Overhead ($)
          <input
            type="number"
            step="0.01"
            min="0"
            value={settings.monthlyOverhead || ''}
            onChange={(e) => updateField('monthlyOverhead', parseFloat(e.target.value) || 0)}
          />
        </label>
        <label>
          Pieces per Month
          <input
            type="number"
            min="0"
            value={settings.piecesPerMonth || ''}
            onChange={(e) => updateField('piecesPerMonth', parseInt(e.target.value) || 0)}
          />
        </label>
        <label>
          Glaze Cost per Piece ($)
          <input
            type="number"
            step="0.01"
            min="0"
            value={settings.glazeCostPerPiece || ''}
            onChange={(e) => updateField('glazeCostPerPiece', parseFloat(e.target.value) || 0)}
          />
        </label>
      </div>

      <div className="settings-group">
        <h3>Kiln Settings</h3>
        <label>
          Kiln Worker Rate ($/hr)
          <input
            type="number"
            step="0.01"
            min="0"
            value={settings.kiln.hourlyRate || ''}
            onChange={(e) => updateKiln('hourlyRate', parseFloat(e.target.value) || 0)}
          />
        </label>
        <label>
          Minutes per Firing
          <input
            type="number"
            min="0"
            value={settings.kiln.minutesPerFiring || ''}
            onChange={(e) => updateKiln('minutesPerFiring', parseInt(e.target.value) || 0)}
          />
        </label>
        <label>
          Kiln Workers
          <input
            type="number"
            min="1"
            value={settings.kiln.kilnWorkerCount || ''}
            onChange={(e) => updateKiln('kilnWorkerCount', parseInt(e.target.value) || 0)}
          />
        </label>
        <label>
          Pieces per Firing
          <input
            type="number"
            min="1"
            value={settings.kiln.piecesPerFiring || ''}
            onChange={(e) => updateKiln('piecesPerFiring', parseInt(e.target.value) || 0)}
          />
        </label>
      </div>
    </section>
  )
}
```

**Step 4: Run test to verify it passes**

Run: `cd web && npm test -- src/components/StudioSettingsForm.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add web/src/components/StudioSettingsForm.tsx web/src/components/StudioSettingsForm.test.tsx
git commit -m "feat(pottery): add StudioSettingsForm component"
```

---

## Task 8: Create StaffConfigForm Component

**Files:**
- Create: `web/src/components/StaffConfigForm.tsx`
- Create: `web/src/components/StaffConfigForm.test.tsx`

**Step 1: Write failing test**

```typescript
// web/src/components/StaffConfigForm.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StaffConfigForm from './StaffConfigForm'
import { StaffRole } from '../types/pottery'

const defaultRole: StaffRole = {
  id: '1',
  name: 'Glazing Guide',
  hourlyRate: 15,
  minutesPerCustomer: 20,
  customersSimultaneous: 4,
}

describe('StaffConfigForm', () => {
  it('renders role name input', () => {
    render(<StaffConfigForm roles={[defaultRole]} onChange={() => {}} />)
    expect(screen.getByLabelText('Role Name')).toBeInTheDocument()
  })

  it('renders hourly rate input', () => {
    render(<StaffConfigForm roles={[defaultRole]} onChange={() => {}} />)
    expect(screen.getByLabelText('Hourly Rate ($)')).toBeInTheDocument()
  })

  it('renders minutes per customer input', () => {
    render(<StaffConfigForm roles={[defaultRole]} onChange={() => {}} />)
    expect(screen.getByLabelText('Minutes per Customer')).toBeInTheDocument()
  })

  it('renders customers simultaneous input', () => {
    render(<StaffConfigForm roles={[defaultRole]} onChange={() => {}} />)
    expect(screen.getByLabelText('Customers at Once')).toBeInTheDocument()
  })

  it('has add role button', () => {
    render(<StaffConfigForm roles={[defaultRole]} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /add role/i })).toBeInTheDocument()
  })

  it('calls onChange when hourly rate changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StaffConfigForm roles={[defaultRole]} onChange={onChange} />)

    const input = screen.getByLabelText('Hourly Rate ($)')
    await user.clear(input)
    await user.type(input, '18')
    expect(onChange).toHaveBeenCalled()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd web && npm test -- src/components/StaffConfigForm.test.tsx`
Expected: FAIL with "Cannot find module"

**Step 3: Write minimal implementation**

```typescript
// web/src/components/StaffConfigForm.tsx
import { StaffRole } from '../types/pottery'

interface Props {
  roles: StaffRole[]
  onChange: (roles: StaffRole[]) => void
}

export default function StaffConfigForm({ roles, onChange }: Props) {
  const addRole = () => {
    onChange([
      ...roles,
      {
        id: crypto.randomUUID(),
        name: '',
        hourlyRate: 15,
        minutesPerCustomer: 15,
        customersSimultaneous: 1,
      },
    ])
  }

  const updateRole = (id: string, field: keyof StaffRole, value: string | number) => {
    onChange(roles.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  const removeRole = (id: string) => {
    onChange(roles.filter((r) => r.id !== id))
  }

  return (
    <section className="form-section">
      <h2>Staff Roles</h2>
      {roles.map((role) => (
        <div key={role.id} className="role-row">
          <label>
            Role Name
            <input
              type="text"
              value={role.name}
              onChange={(e) => updateRole(role.id, 'name', e.target.value)}
            />
          </label>
          <label>
            Hourly Rate ($)
            <input
              type="number"
              step="0.01"
              min="0"
              value={role.hourlyRate || ''}
              onChange={(e) => updateRole(role.id, 'hourlyRate', parseFloat(e.target.value) || 0)}
            />
          </label>
          <label>
            Minutes per Customer
            <input
              type="number"
              min="0"
              value={role.minutesPerCustomer || ''}
              onChange={(e) => updateRole(role.id, 'minutesPerCustomer', parseInt(e.target.value) || 0)}
            />
          </label>
          <label>
            Customers at Once
            <input
              type="number"
              min="1"
              value={role.customersSimultaneous || ''}
              onChange={(e) => updateRole(role.id, 'customersSimultaneous', parseInt(e.target.value) || 1)}
            />
          </label>
          {roles.length > 1 && (
            <button type="button" onClick={() => removeRole(role.id)}>×</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addRole}>Add Role</button>
    </section>
  )
}
```

**Step 4: Run test to verify it passes**

Run: `cd web && npm test -- src/components/StaffConfigForm.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add web/src/components/StaffConfigForm.tsx web/src/components/StaffConfigForm.test.tsx
git commit -m "feat(pottery): add StaffConfigForm component"
```

---

## Task 9: Create CostBreakdownPanel Component

**Files:**
- Create: `web/src/components/CostBreakdownPanel.tsx`
- Create: `web/src/components/CostBreakdownPanel.test.tsx`

**Step 1: Write failing test**

```typescript
// web/src/components/CostBreakdownPanel.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CostBreakdownPanel from './CostBreakdownPanel'
import { COGSResult } from '../types/pottery'

const mockResult: COGSResult = {
  totalCOGS: 22.91,
  breakdown: {
    bisqueCost: 4.5,
    glazeCost: 0.75,
    laborByRole: {
      'Glazing Guide': 1.25,
      'Manager': 0.56,
    },
    laborTotal: 1.81,
    kilnCost: 0.85,
    overheadCost: 15,
  },
}

describe('CostBreakdownPanel', () => {
  it('renders piece name when provided', () => {
    render(<CostBreakdownPanel pieceName="Frosty Snowman" result={mockResult} />)
    expect(screen.getByText(/Frosty Snowman/)).toBeInTheDocument()
  })

  it('renders total COGS', () => {
    render(<CostBreakdownPanel pieceName="Test" result={mockResult} />)
    expect(screen.getByText('$22.91')).toBeInTheDocument()
  })

  it('renders bisque cost', () => {
    render(<CostBreakdownPanel pieceName="Test" result={mockResult} />)
    expect(screen.getByText('Bisque Cost')).toBeInTheDocument()
    expect(screen.getByText('$4.50')).toBeInTheDocument()
  })

  it('renders labor breakdown by role', () => {
    render(<CostBreakdownPanel pieceName="Test" result={mockResult} />)
    expect(screen.getByText('Glazing Guide')).toBeInTheDocument()
    expect(screen.getByText('$1.25')).toBeInTheDocument()
    expect(screen.getByText('Manager')).toBeInTheDocument()
    expect(screen.getByText('$0.56')).toBeInTheDocument()
  })

  it('renders kiln cost', () => {
    render(<CostBreakdownPanel pieceName="Test" result={mockResult} />)
    expect(screen.getByText('Kiln Labor')).toBeInTheDocument()
    expect(screen.getByText('$0.85')).toBeInTheDocument()
  })

  it('renders overhead cost', () => {
    render(<CostBreakdownPanel pieceName="Test" result={mockResult} />)
    expect(screen.getByText('Overhead')).toBeInTheDocument()
    expect(screen.getByText('$15.00')).toBeInTheDocument()
  })

  it('shows select piece message when no result', () => {
    render(<CostBreakdownPanel pieceName={null} result={null} />)
    expect(screen.getByText(/select a piece/i)).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd web && npm test -- src/components/CostBreakdownPanel.test.tsx`
Expected: FAIL with "Cannot find module"

**Step 3: Write minimal implementation**

```typescript
// web/src/components/CostBreakdownPanel.tsx
import { COGSResult } from '../types/pottery'

interface Props {
  pieceName: string | null
  result: COGSResult | null
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`
}

export default function CostBreakdownPanel({ pieceName, result }: Props) {
  if (!result || !pieceName) {
    return (
      <aside className="breakdown-panel">
        <p className="placeholder">Select a piece to see cost breakdown</p>
      </aside>
    )
  }

  const { breakdown, totalCOGS } = result

  return (
    <aside className="breakdown-panel">
      <h2>{pieceName} - Cost Breakdown</h2>

      <div className="breakdown-section">
        <div className="breakdown-row">
          <span>Bisque Cost</span>
          <span>{formatCurrency(breakdown.bisqueCost)}</span>
        </div>
      </div>

      <div className="breakdown-section">
        <h3>Labor</h3>
        {Object.entries(breakdown.laborByRole).map(([role, cost]) => (
          <div key={role} className="breakdown-row indent">
            <span>{role}</span>
            <span>{formatCurrency(cost)}</span>
          </div>
        ))}
        <div className="breakdown-row indent">
          <span>Kiln Labor</span>
          <span>{formatCurrency(breakdown.kilnCost)}</span>
        </div>
      </div>

      <div className="breakdown-section">
        <div className="breakdown-row">
          <span>Glaze/Supplies</span>
          <span>{formatCurrency(breakdown.glazeCost)}</span>
        </div>
        <div className="breakdown-row">
          <span>Overhead</span>
          <span>{formatCurrency(breakdown.overheadCost)}</span>
        </div>
      </div>

      <div className="breakdown-total">
        <span>TOTAL COGS</span>
        <span>{formatCurrency(totalCOGS)}</span>
      </div>
    </aside>
  )
}
```

**Step 4: Run test to verify it passes**

Run: `cd web && npm test -- src/components/CostBreakdownPanel.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add web/src/components/CostBreakdownPanel.tsx web/src/components/CostBreakdownPanel.test.tsx
git commit -m "feat(pottery): add CostBreakdownPanel component"
```

---

## Task 10: Create localStorage Persistence Hook

**Files:**
- Create: `web/src/hooks/useLocalStorage.ts`
- Create: `web/src/hooks/useLocalStorage.test.ts`

**Step 1: Write failing test**

```typescript
// web/src/hooks/useLocalStorage.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))

    act(() => {
      result.current[1]('new value')
    })

    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new value'))
  })

  it('reads existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored value'))

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('stored value')
  })

  it('handles objects', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', { name: 'default' })
    )

    act(() => {
      result.current[1]({ name: 'updated' })
    })

    expect(result.current[0]).toEqual({ name: 'updated' })
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd web && npm test -- src/hooks/useLocalStorage.test.ts`
Expected: FAIL with "Cannot find module"

**Step 3: Write minimal implementation**

```typescript
// web/src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T) => {
    setStoredValue(value)
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore localStorage errors
    }
  }

  return [storedValue, setValue]
}
```

**Step 4: Run test to verify it passes**

Run: `cd web && npm test -- src/hooks/useLocalStorage.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add web/src/hooks/useLocalStorage.ts web/src/hooks/useLocalStorage.test.ts
git commit -m "feat(pottery): add useLocalStorage hook for persistence"
```

---

## Task 11: Integrate Components into New App

**Files:**
- Modify: `web/src/App.tsx`
- Modify: `web/src/App.test.tsx`

**Step 1: Write failing test for new App**

```typescript
// web/src/App.test.tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('Pottery Studio COGS Calculator', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders app title', () => {
    render(<App />)
    expect(screen.getByText('Pottery Studio COGS Calculator')).toBeInTheDocument()
  })

  it('renders bisque piece selector', () => {
    render(<App />)
    expect(screen.getByLabelText('Select Piece')).toBeInTheDocument()
  })

  it('renders settings section', () => {
    render(<App />)
    expect(screen.getByText('Studio Settings')).toBeInTheDocument()
  })

  it('renders staff roles section', () => {
    render(<App />)
    expect(screen.getByText('Staff Roles')).toBeInTheDocument()
  })

  it('renders bisque catalog section', () => {
    render(<App />)
    expect(screen.getByText('Bisque Catalog')).toBeInTheDocument()
  })

  it('shows cost breakdown when piece is selected', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Add a piece to catalog first
    await user.type(screen.getByLabelText('Piece Name'), 'Snowman')
    await user.type(screen.getByLabelText('Wholesale Cost'), '4.50')

    // Select the piece
    await user.selectOptions(screen.getByLabelText('Select Piece'), 'Snowman')

    expect(screen.getByText(/Snowman - Cost Breakdown/)).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd web && npm test -- src/App.test.tsx`
Expected: FAIL (old app doesn't have these elements)

**Step 3: Replace App.tsx with new implementation**

```typescript
// web/src/App.tsx
import { useState, useMemo } from 'react'
import BisqueCatalogManager from './components/BisqueCatalogManager'
import StudioSettingsForm from './components/StudioSettingsForm'
import StaffConfigForm from './components/StaffConfigForm'
import CostBreakdownPanel from './components/CostBreakdownPanel'
import { useLocalStorage } from './hooks/useLocalStorage'
import { BisquePiece, StudioSettings, StaffRole, COGSResult } from './types/pottery'
import './App.css'

const defaultSettings: StudioSettings = {
  monthlyOverhead: 6000,
  piecesPerMonth: 400,
  glazeCostPerPiece: 0.75,
  kiln: {
    hourlyRate: 17,
    minutesPerFiring: 30,
    kilnWorkerCount: 2,
    piecesPerFiring: 20,
  },
  staffRoles: [],
}

const defaultStaffRoles: StaffRole[] = [
  { id: '1', name: 'Glazing Guide', hourlyRate: 15, minutesPerCustomer: 20, customersSimultaneous: 4 },
  { id: '2', name: 'Manager', hourlyRate: 20, minutesPerCustomer: 5, customersSimultaneous: 3 },
]

function calculateStaffLaborCost(hourlyRate: number, minutesPerCustomer: number, customersSimultaneous: number): number {
  const cost = (hourlyRate * minutesPerCustomer / 60) / customersSimultaneous
  return Math.round(cost * 100) / 100
}

function calculateKilnLaborCost(hourlyRate: number, minutesPerFiring: number, kilnWorkerCount: number, piecesPerFiring: number): number {
  const totalLaborCost = (hourlyRate * minutesPerFiring / 60) * kilnWorkerCount
  const costPerPiece = totalLaborCost / piecesPerFiring
  return Math.round(costPerPiece * 100) / 100
}

function App() {
  const [catalog, setCatalog] = useLocalStorage<BisquePiece[]>('pottery-catalog', [
    { id: '1', name: '', wholesaleCost: 0 },
  ])
  const [settings, setSettings] = useLocalStorage<StudioSettings>('pottery-settings', defaultSettings)
  const [staffRoles, setStaffRoles] = useState<StaffRole[]>(defaultStaffRoles)
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null)

  const selectedPiece = catalog.find((p) => p.id === selectedPieceId) || null
  const validPieces = catalog.filter((p) => p.name.trim())

  const result: COGSResult | null = useMemo(() => {
    if (!selectedPiece || !selectedPiece.name.trim()) return null

    const laborByRole: Record<string, number> = {}
    let laborTotal = 0

    for (const role of staffRoles) {
      if (role.name.trim()) {
        const cost = calculateStaffLaborCost(
          role.hourlyRate,
          role.minutesPerCustomer,
          role.customersSimultaneous
        )
        laborByRole[role.name] = cost
        laborTotal += cost
      }
    }

    laborTotal = Math.round(laborTotal * 100) / 100

    const kilnCost = calculateKilnLaborCost(
      settings.kiln.hourlyRate,
      settings.kiln.minutesPerFiring,
      settings.kiln.kilnWorkerCount,
      settings.kiln.piecesPerFiring
    )

    const overheadCost = settings.piecesPerMonth > 0
      ? Math.round((settings.monthlyOverhead / settings.piecesPerMonth) * 100) / 100
      : 0

    const totalCOGS = Math.round(
      (selectedPiece.wholesaleCost + settings.glazeCostPerPiece + laborTotal + kilnCost + overheadCost) * 100
    ) / 100

    return {
      totalCOGS,
      breakdown: {
        bisqueCost: selectedPiece.wholesaleCost,
        glazeCost: settings.glazeCostPerPiece,
        laborByRole,
        laborTotal,
        kilnCost,
        overheadCost,
      },
    }
  }, [selectedPiece, staffRoles, settings])

  return (
    <div className="app">
      <header>
        <h1>Pottery Studio COGS Calculator</h1>
      </header>

      <main>
        <div className="calculator-section">
          <label>
            Select Piece
            <select
              value={selectedPieceId || ''}
              onChange={(e) => setSelectedPieceId(e.target.value || null)}
            >
              <option value="">-- Select a piece --</option>
              {validPieces.map((piece) => (
                <option key={piece.id} value={piece.id}>
                  {piece.name} (${piece.wholesaleCost.toFixed(2)})
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="forms-container">
          <StudioSettingsForm settings={settings} onChange={setSettings} />
          <StaffConfigForm roles={staffRoles} onChange={setStaffRoles} />
          <BisqueCatalogManager pieces={catalog} onChange={setCatalog} />
        </div>

        <CostBreakdownPanel pieceName={selectedPiece?.name || null} result={result} />
      </main>
    </div>
  )
}

export default App
```

**Step 4: Run test to verify it passes**

Run: `cd web && npm test -- src/App.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add web/src/App.tsx web/src/App.test.tsx
git commit -m "feat(pottery): integrate all components into new App"
```

---

## Task 12: Update CSS for Pottery Studio Layout

**Files:**
- Modify: `web/src/App.css`

**Step 1: Replace CSS**

```css
/* web/src/App.css */
* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
  background: #f5f5f5;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

header h1 {
  color: #2c3e50;
  margin: 0;
}

main {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 20px;
}

.calculator-section {
  grid-column: 1 / -1;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.calculator-section label {
  display: block;
  font-weight: bold;
  margin-bottom: 10px;
}

.calculator-section select {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.forms-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-section h2 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 18px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

.form-section h3 {
  margin: 15px 0 10px 0;
  color: #7f8c8d;
  font-size: 14px;
  text-transform: uppercase;
}

.settings-group {
  margin-bottom: 20px;
}

.form-section label {
  display: block;
  margin-bottom: 15px;
  color: #555;
  font-size: 14px;
}

.form-section input {
  display: block;
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-section input:focus {
  outline: none;
  border-color: #3498db;
}

.piece-row,
.role-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) auto;
  gap: 10px;
  align-items: end;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 10px;
}

.piece-row button,
.role-row button {
  padding: 8px 12px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.form-section > button {
  margin-top: 10px;
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.form-section > button:hover {
  background: #2980b9;
}

/* Breakdown Panel */
.breakdown-panel {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 20px;
  height: fit-content;
}

.breakdown-panel h2 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 18px;
}

.breakdown-panel .placeholder {
  color: #95a5a6;
  text-align: center;
  padding: 40px 20px;
}

.breakdown-section {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.breakdown-section h3 {
  margin: 0 0 10px 0;
  color: #7f8c8d;
  font-size: 12px;
  text-transform: uppercase;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  font-size: 14px;
}

.breakdown-row.indent {
  padding-left: 15px;
  color: #666;
}

.breakdown-total {
  display: flex;
  justify-content: space-between;
  padding-top: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  border-top: 2px solid #3498db;
}

@media (max-width: 800px) {
  main {
    grid-template-columns: 1fr;
  }

  .breakdown-panel {
    position: static;
  }
}
```

**Step 2: Commit**

```bash
git add web/src/App.css
git commit -m "style(pottery): update CSS for pottery studio layout"
```

---

## Task 13: Clean Up Old Generic Components

**Files:**
- Delete: `web/src/components/ProductForm.tsx`
- Delete: `web/src/components/ProductForm.test.tsx`
- Delete: `web/src/components/LaborForm.tsx`
- Delete: `web/src/components/LaborForm.test.tsx`
- Delete: `web/src/components/ShippingForm.tsx`
- Delete: `web/src/components/ShippingForm.test.tsx`
- Delete: `web/src/components/ResultsPanel.tsx`
- Delete: `web/src/components/ResultsPanel.test.tsx`

**Step 1: Remove old files**

```bash
rm web/src/components/ProductForm.tsx web/src/components/ProductForm.test.tsx
rm web/src/components/LaborForm.tsx web/src/components/LaborForm.test.tsx
rm web/src/components/ShippingForm.tsx web/src/components/ShippingForm.test.tsx
rm web/src/components/ResultsPanel.tsx web/src/components/ResultsPanel.test.tsx
```

**Step 2: Run all tests to verify nothing breaks**

Run: `cd web && npm test`
Expected: All tests pass

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove old generic COGS components"
```

---

## Task 14: Update CLI Script for Pottery Example

**Files:**
- Modify: `src/index.ts`

**Step 1: Replace CLI script**

```typescript
// src/index.ts
import { calculatePieceCOGS } from './pottery'

// ============================================
// POTTERY STUDIO COGS EXAMPLE
// ============================================

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

console.log('\n╔════════════════════════════════════════╗')
console.log('║   POTTERY STUDIO COGS CALCULATOR       ║')
console.log('╚════════════════════════════════════════╝')

console.log('\n=== FROSTY SNOWMAN GLOBE ===\n')
console.log('Cost Breakdown:')
console.log(`  ${'Bisque Cost'.padEnd(20)} $${result.breakdown.bisqueCost.toFixed(2)}`)
console.log(`  ${'Glaze/Supplies'.padEnd(20)} $${result.breakdown.glazeCost.toFixed(2)}`)
console.log('\nLabor:')
for (const [role, cost] of Object.entries(result.breakdown.laborByRole)) {
  console.log(`  ${role.padEnd(20)} $${cost.toFixed(2)}`)
}
console.log(`  ${'Kiln Labor'.padEnd(20)} $${result.breakdown.kilnCost.toFixed(2)}`)
console.log(`\n  ${'Overhead'.padEnd(20)} $${result.breakdown.overheadCost.toFixed(2)}`)
console.log(`  ${'─'.repeat(24)}`)
console.log(`  ${'TOTAL COGS'.padEnd(20)} $${result.totalCOGS.toFixed(2)}`)
console.log('')
```

**Step 2: Run to verify output**

Run: `npm start`
Expected: Shows pottery studio COGS breakdown

**Step 3: Commit**

```bash
git add src/index.ts
git commit -m "feat(pottery): update CLI script for pottery example"
```

---

## Task 15: Final Integration Test

**Step 1: Run all tests**

Run: `npm test && cd web && npm test`
Expected: All tests pass

**Step 2: Manual verification**

Run: `cd web && npm run dev`
- Open browser to localhost
- Verify pieces can be added to catalog
- Verify selecting a piece shows breakdown
- Verify adjusting staff rates updates calculation
- Verify data persists on page refresh

**Step 3: Final commit**

```bash
git add -A
git commit -m "test: verify full pottery studio COGS integration"
```

---

Plan complete and saved to `docs/plans/2026-02-01-pottery-studio-cogs.md`.

**Two execution options:**

1. **Subagent-Driven (this session)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

2. **Parallel Session (separate)** - Open a new session with executing-plans, batch execution with checkpoints

Which approach?