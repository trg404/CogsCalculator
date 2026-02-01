# Pottery Studio COGS Calculator - Design

## Overview

A COGS calculator tailored for paint-your-own pottery studios. Managers enter a bisque piece and instantly see the true cost including labor, supplies, and overhead.

## Business Context

- ~10 employees: 2 kiln workers ($17/hr), glazing guides ($15/hr), 1 manager ($20/hr)
- ~30 bisque piece types, ~120 glazes (similar pricing)
- Customers select a piece, use 4-5 glazes, spend 1-2 hours painting, leave piece for firing

## Data Model

### Studio Settings (saved, editable)
| Field | Description |
|-------|-------------|
| Monthly Overhead | Combined rent, utilities, taxes, insurance |
| Pieces per Month | Average monthly volume |
| Glaze Cost per Piece | Flat rate for supplies per customer |

### Kiln Settings
| Field | Description |
|-------|-------------|
| Pieces per Firing | Batch size |
| Minutes per Firing | Time to load, fire, unload |
| Kiln Workers | Count and hourly rate ($17/hr default) |

### Staff Roles (adjustable per calculation)
| Role | Hourly Rate | Minutes per Customer | Customers Served Simultaneously |
|------|-------------|---------------------|--------------------------------|
| Glazing Guide | $15 | configurable | configurable |
| Manager | $20 | configurable | configurable |
| Kiln Worker | $17 | calculated from batch | n/a (batch-based) |

### Bisque Catalog
Saved list of ~30 pieces with name and wholesale cost.

## Calculation Formulas

### Labor - Glazing Guide / Manager
```
cost = (hourlyRate × minutesPerCustomer / 60) / customersServedSimultaneously
```

### Labor - Kiln Workers
```
cost = (hourlyRate × minutesPerFiring / 60 × numberOfKilnWorkers) / piecesPerFiring
```

### Overhead
```
overheadPerPiece = monthlyOverhead / piecesPerMonth
```

### Total COGS
```
totalCOGS = bisqueCost
          + glazingGuideCost
          + managerCost
          + kilnCost
          + glazeSupplyCost
          + overheadPerPiece
```

## User Workflow

### Main Screen
1. Select bisque piece from dropdown (catalog)
2. See instant COGS breakdown with all components itemized
3. Adjust staff settings in side panel for what-if scenarios

### Example Output
```
Frosty Snowman Globe - Cost Breakdown
─────────────────────────────────────
Bisque Cost                    $4.50

Labor
  Glazing Guide (20min ÷ 4)    $1.25
  Manager (5min ÷ 3)           $0.56
  Kiln Worker (per batch)      $0.71
Labor Subtotal                 $2.52

Glaze/Supplies                 $0.75
Overhead                       $1.50
═════════════════════════════════════
TOTAL COGS                     $9.27
```

### Settings/Catalog Management
- Add/edit/delete bisque pieces
- Update default staff rates and times
- Update overhead and volume numbers

## Technical Approach

### New Components
- `BisqueCatalogManager` - CRUD for bisque pieces
- `StudioSettingsForm` - overhead and kiln configuration
- `StaffConfigForm` - roles with adjustable values
- `CostCalculator` - main piece selection and breakdown view
- `CostBreakdownPanel` - itemized result display

### Storage
- Browser localStorage for catalog and default settings
- What-if adjustments are temporary unless explicitly saved

### Removed from Generic Calculator
- Ingredients/products concepts
- Shipping cost field
- Multi-product allocation complexity

## Future Enhancements
- Itemized overhead breakdown (rent, utilities, taxes, insurance separately)
