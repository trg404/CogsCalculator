# Overhead Breakdown Design

## Overview

Break down the single "Monthly Overhead" field into itemized categories: Fixed Costs and Variable Costs. Users can see where their overhead money goes rather than entering a single total.

## Data Structure

```typescript
interface OverheadItem {
  id: string
  name: string
  amount: number
}

interface OverheadSettings {
  fixedCosts: OverheadItem[]    // Rent, Insurance, Property Taxes, etc.
  variableCosts: OverheadItem[] // Utilities, Supplies, etc.
}
```

Replaces the current `monthlyOverhead: number` field in `StudioSettings`.

Total monthly overhead = sum of all fixed items + sum of all variable items.

## Default Presets

New users start with these items at $0:

**Fixed Costs:**
- Rent
- Insurance
- Property Taxes

**Variable Costs:**
- Utilities
- Supplies

Users can edit names, change amounts, delete items, or add custom items.

## Form UI Changes

The "Overhead & Volume" section in StudioSettingsForm becomes:

```
Fixed Costs                              [collapse toggle]
  ┌─────────────────┬──────────┬───┐
  │ Rent            │ $2000.00 │ X │
  │ Insurance       │ $300.00  │ X │
  │ Property Taxes  │ $500.00  │ X │
  └─────────────────┴──────────┴───┘
  [+ Add Item]
  Fixed Total: $2,800.00

Variable Costs                           [collapse toggle]
  ┌─────────────────┬──────────┬───┐
  │ Utilities       │ $400.00  │ X │
  │ Supplies        │ $200.00  │ X │
  └─────────────────┴──────────┴───┘
  [+ Add Item]
  Variable Total: $600.00

Monthly Overhead Total: $3,400.00  (read-only, auto-calculated)

Pieces per Month: [400]  (unchanged)
```

Each line item has:
- Editable name input
- Editable amount input
- Delete button (X)

## Migration

Existing users with a saved `monthlyOverhead` value:
- Create a single "Other" item in Fixed Costs with that amount
- Variable Costs starts with presets at $0

This preserves their total overhead while letting them itemize later.

## Cost Breakdown Display

No changes. CostBreakdownPanel continues to show a single "Overhead: $X.XX" line (per-piece cost). The itemization exists only in the settings form.

## Calculation

Per-piece overhead calculation unchanged:

```
overheadCostPerPiece = totalMonthlyOverhead / piecesPerMonth
```

Where `totalMonthlyOverhead` = sum(fixedCosts) + sum(variableCosts)

## Files to Modify

1. `web/src/types/pottery.ts` - Add OverheadItem, OverheadSettings interfaces; update StudioSettings
2. `web/src/components/StudioSettingsForm.tsx` - New UI for itemized overhead
3. `web/src/App.tsx` - Update default settings, calculation to use new structure
4. `src/pottery.ts` - Update calculateOverheadCost if needed (may just need interface change)
