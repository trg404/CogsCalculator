# Overhead Breakdown Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Break down the single Monthly Overhead field into itemized Fixed/Variable cost categories with editable line items.

**Architecture:** Add `OverheadItem` and `OverheadSettings` types. Replace `monthlyOverhead: number` with `overhead: OverheadSettings` in `StudioSettings`. The form gets collapsible sections for Fixed/Variable costs with add/delete/edit for line items. Calculation sums all items then divides by pieces per month.

**Tech Stack:** React, TypeScript, Vitest, CSS

---

### Task 1: Add OverheadItem and OverheadSettings Types

**Files:**
- Modify: `web/src/types/pottery.ts`

**Step 1: Add the new types**

Add after `KilnSettings` interface (around line 20):

```typescript
export interface OverheadItem {
  id: string
  name: string
  amount: number
}

export interface OverheadSettings {
  fixedCosts: OverheadItem[]
  variableCosts: OverheadItem[]
}
```

**Step 2: Update StudioSettings interface**

Replace:
```typescript
export interface StudioSettings {
  monthlyOverhead: number
  piecesPerMonth: number
```

With:
```typescript
export interface StudioSettings {
  overhead: OverheadSettings
  piecesPerMonth: number
```

**Step 3: Commit**

```bash
git add web/src/types/pottery.ts
git commit -m "feat(types): add OverheadItem and OverheadSettings types"
```

---

### Task 2: Add Overhead Utility Functions

**Files:**
- Modify: `src/pottery.ts`
- Modify: `src/pottery.test.ts`

**Step 1: Write failing test for sumOverheadItems**

Add to `src/pottery.test.ts` after the `calculateOverheadCost` describe block:

```typescript
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
```

Update import at top:
```typescript
import {
  calculateStaffLaborCost,
  calculateKilnLaborCost,
  calculateOverheadCost,
  calculatePieceCOGS,
  sumOverheadItems,
} from './pottery'
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/trog/Desktop/CogsCalculator && npm test -- --run`

Expected: FAIL - `sumOverheadItems` is not exported

**Step 3: Implement sumOverheadItems**

Add to `src/pottery.ts` before `calculateOverheadCost`:

```typescript
interface OverheadItem {
  id: string
  name: string
  amount: number
}

export function sumOverheadItems(items: OverheadItem[]): number {
  return items.reduce((sum, item) => sum + Math.max(0, item.amount), 0)
}
```

**Step 4: Run test to verify it passes**

Run: `cd /Users/trog/Desktop/CogsCalculator && npm test -- --run`

Expected: PASS

**Step 5: Write failing test for calculateTotalOverhead**

Add to `src/pottery.test.ts`:

```typescript
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
})
```

Update import:
```typescript
import {
  calculateStaffLaborCost,
  calculateKilnLaborCost,
  calculateOverheadCost,
  calculatePieceCOGS,
  sumOverheadItems,
  calculateTotalOverhead,
} from './pottery'
```

**Step 6: Run test to verify it fails**

Run: `cd /Users/trog/Desktop/CogsCalculator && npm test -- --run`

Expected: FAIL

**Step 7: Implement calculateTotalOverhead**

Add to `src/pottery.ts`:

```typescript
interface OverheadSettings {
  fixedCosts: OverheadItem[]
  variableCosts: OverheadItem[]
}

export function calculateTotalOverhead(overhead: OverheadSettings): number {
  return sumOverheadItems(overhead.fixedCosts) + sumOverheadItems(overhead.variableCosts)
}
```

**Step 8: Run tests**

Run: `cd /Users/trog/Desktop/CogsCalculator && npm test -- --run`

Expected: PASS

**Step 9: Commit**

```bash
git add src/pottery.ts src/pottery.test.ts
git commit -m "feat(pottery): add sumOverheadItems and calculateTotalOverhead"
```

---

### Task 3: Update App Default Settings and Calculation

**Files:**
- Modify: `web/src/App.tsx`

**Step 1: Update default overhead presets**

Replace:
```typescript
const defaultSettings: StudioSettings = {
  monthlyOverhead: 6000,
  piecesPerMonth: 400,
```

With:
```typescript
const defaultSettings: StudioSettings = {
  overhead: {
    fixedCosts: [
      { id: '1', name: 'Rent', amount: 0 },
      { id: '2', name: 'Insurance', amount: 0 },
      { id: '3', name: 'Property Taxes', amount: 0 },
    ],
    variableCosts: [
      { id: '4', name: 'Utilities', amount: 0 },
      { id: '5', name: 'Supplies', amount: 0 },
    ],
  },
  piecesPerMonth: 400,
```

**Step 2: Update imports**

Add `calculateTotalOverhead` to imports:
```typescript
import { calculateStaffLaborCost, calculateKilnLaborCost, calculateOverheadCost, calculateTotalOverhead } from '../../src/pottery'
```

**Step 3: Update overhead calculation in useMemo**

Replace:
```typescript
const overheadCost = calculateOverheadCost({
  monthlyOverhead: settings.monthlyOverhead,
  piecesPerMonth: settings.piecesPerMonth,
})
```

With:
```typescript
const monthlyOverhead = calculateTotalOverhead(settings.overhead)
const overheadCost = calculateOverheadCost({
  monthlyOverhead,
  piecesPerMonth: settings.piecesPerMonth,
})
```

**Step 4: Commit**

```bash
git add web/src/App.tsx
git commit -m "feat(app): update default settings to use itemized overhead"
```

---

### Task 4: Create OverheadItemRow Component

**Files:**
- Create: `web/src/components/OverheadItemRow.tsx`
- Create: `web/src/components/OverheadItemRow.test.tsx`

**Step 1: Write the failing test**

Create `web/src/components/OverheadItemRow.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OverheadItemRow from './OverheadItemRow'

describe('OverheadItemRow', () => {
  const item = { id: '1', name: 'Rent', amount: 2000 }

  it('renders item name input', () => {
    render(<OverheadItemRow item={item} onChange={() => {}} onDelete={() => {}} />)
    expect(screen.getByDisplayValue('Rent')).toBeInTheDocument()
  })

  it('renders item amount input', () => {
    render(<OverheadItemRow item={item} onChange={() => {}} onDelete={() => {}} />)
    expect(screen.getByDisplayValue('2000')).toBeInTheDocument()
  })

  it('calls onChange when name changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<OverheadItemRow item={item} onChange={onChange} onDelete={() => {}} />)

    const nameInput = screen.getByDisplayValue('Rent')
    await user.clear(nameInput)
    await user.type(nameInput, 'Mortgage')

    expect(onChange).toHaveBeenCalled()
  })

  it('calls onDelete when delete button clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<OverheadItemRow item={item} onChange={() => {}} onDelete={onDelete} />)

    await user.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).toHaveBeenCalledWith('1')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/trog/Desktop/CogsCalculator && npm test -- --run`

Expected: FAIL - module not found

**Step 3: Implement OverheadItemRow**

Create `web/src/components/OverheadItemRow.tsx`:

```typescript
import { OverheadItem } from '../types/pottery'

interface Props {
  item: OverheadItem
  onChange: (item: OverheadItem) => void
  onDelete: (id: string) => void
}

export default function OverheadItemRow({ item, onChange, onDelete }: Props) {
  return (
    <div className="overhead-item-row">
      <input
        type="text"
        value={item.name}
        onChange={(e) => onChange({ ...item, name: e.target.value })}
        placeholder="Item name"
      />
      <input
        type="number"
        step="0.01"
        min="0"
        value={item.amount || ''}
        onChange={(e) => onChange({ ...item, amount: parseFloat(e.target.value) || 0 })}
        placeholder="0.00"
      />
      <button type="button" onClick={() => onDelete(item.id)} aria-label="Delete item">
        ×
      </button>
    </div>
  )
}
```

**Step 4: Run tests**

Run: `cd /Users/trog/Desktop/CogsCalculator && npm test -- --run`

Expected: PASS

**Step 5: Commit**

```bash
git add web/src/components/OverheadItemRow.tsx web/src/components/OverheadItemRow.test.tsx
git commit -m "feat(components): add OverheadItemRow component"
```

---

### Task 5: Create OverheadCategorySection Component

**Files:**
- Create: `web/src/components/OverheadCategorySection.tsx`
- Create: `web/src/components/OverheadCategorySection.test.tsx`

**Step 1: Write the failing test**

Create `web/src/components/OverheadCategorySection.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OverheadCategorySection from './OverheadCategorySection'

describe('OverheadCategorySection', () => {
  const items = [
    { id: '1', name: 'Rent', amount: 2000 },
    { id: '2', name: 'Insurance', amount: 300 },
  ]

  it('renders category title', () => {
    render(
      <OverheadCategorySection
        title="Fixed Costs"
        items={items}
        onChange={() => {}}
      />
    )
    expect(screen.getByText('Fixed Costs')).toBeInTheDocument()
  })

  it('renders all items', () => {
    render(
      <OverheadCategorySection
        title="Fixed Costs"
        items={items}
        onChange={() => {}}
      />
    )
    expect(screen.getByDisplayValue('Rent')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Insurance')).toBeInTheDocument()
  })

  it('displays subtotal', () => {
    render(
      <OverheadCategorySection
        title="Fixed Costs"
        items={items}
        onChange={() => {}}
      />
    )
    expect(screen.getByText('Subtotal: $2,300.00')).toBeInTheDocument()
  })

  it('renders Add Item button', () => {
    render(
      <OverheadCategorySection
        title="Fixed Costs"
        items={items}
        onChange={() => {}}
      />
    )
    expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument()
  })

  it('calls onChange with new item when Add Item clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <OverheadCategorySection
        title="Fixed Costs"
        items={items}
        onChange={onChange}
      />
    )

    await user.click(screen.getByRole('button', { name: /add item/i }))

    expect(onChange).toHaveBeenCalled()
    const newItems = onChange.mock.calls[0][0]
    expect(newItems).toHaveLength(3)
    expect(newItems[2].name).toBe('')
    expect(newItems[2].amount).toBe(0)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/trog/Desktop/CogsCalculator && npm test -- --run`

Expected: FAIL

**Step 3: Implement OverheadCategorySection**

Create `web/src/components/OverheadCategorySection.tsx`:

```typescript
import { OverheadItem } from '../types/pottery'
import OverheadItemRow from './OverheadItemRow'

interface Props {
  title: string
  items: OverheadItem[]
  onChange: (items: OverheadItem[]) => void
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export default function OverheadCategorySection({ title, items, onChange }: Props) {
  const subtotal = items.reduce((sum, item) => sum + Math.max(0, item.amount), 0)

  const handleItemChange = (updatedItem: OverheadItem) => {
    onChange(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
  }

  const handleDelete = (id: string) => {
    onChange(items.filter((item) => item.id !== id))
  }

  const handleAdd = () => {
    onChange([...items, { id: generateId(), name: '', amount: 0 }])
  }

  return (
    <div className="overhead-category">
      <h4>{title}</h4>
      <div className="overhead-items">
        {items.map((item) => (
          <OverheadItemRow
            key={item.id}
            item={item}
            onChange={handleItemChange}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <button type="button" onClick={handleAdd} className="add-item-btn">
        + Add Item
      </button>
      <div className="overhead-subtotal">
        Subtotal: {formatCurrency(subtotal)}
      </div>
    </div>
  )
}
```

**Step 4: Run tests**

Run: `cd /Users/trog/Desktop/CogsCalculator && npm test -- --run`

Expected: PASS

**Step 5: Commit**

```bash
git add web/src/components/OverheadCategorySection.tsx web/src/components/OverheadCategorySection.test.tsx
git commit -m "feat(components): add OverheadCategorySection component"
```

---

### Task 6: Update StudioSettingsForm with Overhead Sections

**Files:**
- Modify: `web/src/components/StudioSettingsForm.tsx`
- Modify: `web/src/components/StudioSettingsForm.test.tsx`

**Step 1: Update the tests**

Replace content of `web/src/components/StudioSettingsForm.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudioSettingsForm from './StudioSettingsForm'
import { StudioSettings } from '../types/pottery'

const defaultSettings: StudioSettings = {
  overhead: {
    fixedCosts: [
      { id: '1', name: 'Rent', amount: 2000 },
    ],
    variableCosts: [
      { id: '2', name: 'Utilities', amount: 400 },
    ],
  },
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

describe('StudioSettingsForm', () => {
  it('renders Fixed Costs section', () => {
    render(<StudioSettingsForm settings={defaultSettings} onChange={() => {}} />)
    expect(screen.getByText('Fixed Costs')).toBeInTheDocument()
  })

  it('renders Variable Costs section', () => {
    render(<StudioSettingsForm settings={defaultSettings} onChange={() => {}} />)
    expect(screen.getByText('Variable Costs')).toBeInTheDocument()
  })

  it('displays monthly overhead total', () => {
    render(<StudioSettingsForm settings={defaultSettings} onChange={() => {}} />)
    expect(screen.getByText(/Monthly Overhead Total/)).toBeInTheDocument()
    expect(screen.getByText('$2,400.00')).toBeInTheDocument()
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

  it('calls onChange when pieces per month changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StudioSettingsForm settings={defaultSettings} onChange={onChange} />)

    await user.clear(screen.getByLabelText('Pieces per Month'))
    await user.type(screen.getByLabelText('Pieces per Month'), '500')
    expect(onChange).toHaveBeenCalled()
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `cd /Users/trog/Desktop/CogsCalculator && npm test -- --run`

Expected: FAIL - old tests expect `monthlyOverhead`

**Step 3: Update StudioSettingsForm component**

Replace content of `web/src/components/StudioSettingsForm.tsx`:

```typescript
import { StudioSettings, OverheadItem } from '../types/pottery'
import OverheadCategorySection from './OverheadCategorySection'

interface Props {
  settings: StudioSettings
  onChange: (settings: StudioSettings) => void
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
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

  const updateFixedCosts = (fixedCosts: OverheadItem[]) => {
    onChange({ ...settings, overhead: { ...settings.overhead, fixedCosts } })
  }

  const updateVariableCosts = (variableCosts: OverheadItem[]) => {
    onChange({ ...settings, overhead: { ...settings.overhead, variableCosts } })
  }

  const fixedTotal = settings.overhead.fixedCosts.reduce((sum, item) => sum + Math.max(0, item.amount), 0)
  const variableTotal = settings.overhead.variableCosts.reduce((sum, item) => sum + Math.max(0, item.amount), 0)
  const monthlyTotal = fixedTotal + variableTotal

  return (
    <section className="form-section">
      <h2>Studio Settings</h2>

      <div className="settings-group">
        <h3>Overhead Costs</h3>

        <OverheadCategorySection
          title="Fixed Costs"
          items={settings.overhead.fixedCosts}
          onChange={updateFixedCosts}
        />

        <OverheadCategorySection
          title="Variable Costs"
          items={settings.overhead.variableCosts}
          onChange={updateVariableCosts}
        />

        <div className="overhead-total">
          <strong>Monthly Overhead Total:</strong> <span>{formatCurrency(monthlyTotal)}</span>
        </div>
      </div>

      <div className="settings-group">
        <h3>Production Volume</h3>
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

**Step 4: Run tests**

Run: `cd /Users/trog/Desktop/CogsCalculator && npm test -- --run`

Expected: PASS

**Step 5: Commit**

```bash
git add web/src/components/StudioSettingsForm.tsx web/src/components/StudioSettingsForm.test.tsx
git commit -m "feat(form): update StudioSettingsForm with itemized overhead sections"
```

---

### Task 7: Add CSS Styles for Overhead UI

**Files:**
- Modify: `web/src/App.css`

**Step 1: Add overhead styles**

Add before the `/* Breakdown Panel */` comment (around line 149):

```css
/* Overhead Categories */
.overhead-category {
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 4px;
}

.overhead-category h4 {
  margin: 0 0 10px 0;
  color: #555;
  font-size: 14px;
}

.overhead-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.overhead-item-row {
  display: grid;
  grid-template-columns: 1fr 120px auto;
  gap: 10px;
  align-items: center;
}

.overhead-item-row input[type="text"] {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.overhead-item-row input[type="number"] {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  text-align: right;
}

.overhead-item-row button {
  padding: 6px 10px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.overhead-item-row button:hover {
  background: #c0392b;
}

.add-item-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-item-btn:hover {
  background: #2980b9;
}

.overhead-subtotal {
  margin-top: 10px;
  text-align: right;
  color: #666;
  font-size: 14px;
}

.overhead-total {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background: #ecf0f1;
  border-radius: 4px;
  font-size: 16px;
}
```

**Step 2: Commit**

```bash
git add web/src/App.css
git commit -m "style: add CSS for overhead categories UI"
```

---

### Task 8: Add Migration for Existing localStorage Data

**Files:**
- Modify: `web/src/App.tsx`

**Step 1: Add migration function and update useLocalStorage call**

Add after imports, before `defaultSettings`:

```typescript
interface LegacyStudioSettings {
  monthlyOverhead?: number
  piecesPerMonth: number
  glazeCostPerPiece: number
  kiln: StudioSettings['kiln']
  staffRoles: StudioSettings['staffRoles']
}

function migrateSettings(stored: LegacyStudioSettings | StudioSettings): StudioSettings {
  // Already migrated
  if ('overhead' in stored && stored.overhead) {
    return stored as StudioSettings
  }

  // Migrate from legacy monthlyOverhead
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
```

Update the useLocalStorage hook with migration:

Find:
```typescript
const [settings, setSettings] = useLocalStorage<StudioSettings>('pottery-settings', defaultSettings)
```

Replace with:
```typescript
const [settings, setSettings] = useLocalStorage<StudioSettings>(
  'pottery-settings',
  defaultSettings,
  migrateSettings
)
```

**Step 2: Update useLocalStorage hook to accept migration function**

Read and update `web/src/hooks/useLocalStorage.ts` to accept an optional migration function parameter:

```typescript
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  migrate?: (stored: unknown) => T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        const parsed = JSON.parse(item)
        return migrate ? migrate(parsed) : parsed
      }
      return initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      // Ignore storage errors
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
```

**Step 3: Commit**

```bash
git add web/src/App.tsx web/src/hooks/useLocalStorage.ts
git commit -m "feat: add migration for legacy monthlyOverhead data"
```

---

### Task 9: Final Integration Test

**Files:**
- Run all tests and verify app works

**Step 1: Run all tests**

Run: `cd /Users/trog/Desktop/CogsCalculator && npm test -- --run`

Expected: All tests pass

**Step 2: Start dev server and verify manually**

Run: `cd /Users/trog/Desktop/CogsCalculator/web && npm run dev`

Verify:
- Fixed Costs section shows with Rent, Insurance, Property Taxes
- Variable Costs section shows with Utilities, Supplies
- Can add/edit/delete items
- Subtotals update correctly
- Monthly Overhead Total shows combined amount
- Cost breakdown still shows single Overhead line

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete overhead breakdown implementation"
```
