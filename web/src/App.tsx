import { useMemo, useState } from 'react'
import BisqueCatalogManager from './components/BisqueCatalogManager'
import StudioSettingsForm from './components/StudioSettingsForm'
import StaffConfigForm from './components/StaffConfigForm'
import CostBreakdownPanel from './components/CostBreakdownPanel'
import { useLocalStorage } from './hooks/useLocalStorage'
import { BisquePiece, StudioSettings, StaffRole } from './types/pottery'
import { calculatePieceCOGS, calculateTotalOverhead } from '../../src/pottery'
import './App.css'

/** Shape of settings data saved by earlier versions of the app (before overhead categories). */
interface LegacyStudioSettings {
  monthlyOverhead?: number
  piecesPerMonth: number
  glazeCostPerPiece: number
  kiln: StudioSettings['kiln']
}

/**
 * Migrates settings saved by older versions of the app.
 *
 * Legacy format had a single `monthlyOverhead` number. The current format
 * uses categorized overhead with separate fixed and variable cost line items.
 * This function converts the old shape into the new one so existing users
 * don't lose their saved data after an update.
 */
export function migrateSettings(stored: LegacyStudioSettings | StudioSettings): StudioSettings {
  // Already in current format — nothing to do
  if ('overhead' in stored && stored.overhead) {
    return stored as StudioSettings
  }

  // Convert legacy single-number overhead into a categorized format
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
  }
}

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
  glazeCostPerPiece: 0.75,
  kiln: {
    // Typical pottery studio defaults: 2 workers at $17/hr for a 30-minute
    // kiln cycle that holds 20 pieces
    hourlyRate: 17,
    minutesPerFiring: 30,
    kilnWorkerCount: 2,
    piecesPerFiring: 20,
  },
}

/** Starter staff roles for first-time users. Typical paint-your-own pottery
 *  studios have a guide helping customers paint ($15/hr) and a manager ($20/hr). */
const defaultStaffRoles: StaffRole[] = [
  { id: '1', name: 'Glazing Guide', hourlyRate: 15, minutesPerCustomer: 20, customersSimultaneous: 4 },
  { id: '2', name: 'Manager', hourlyRate: 20, minutesPerCustomer: 5, customersSimultaneous: 3 },
]

/**
 * Root application component. Manages three pieces of persisted state:
 *   - catalog:    the bisque pieces the studio sells
 *   - settings:   overhead, kiln, glaze, and production volume config
 *   - staffRoles: employee roles and their labor cost parameters
 *
 * When the user selects a piece, the COGS is recalculated in real time.
 */
function App() {
  // Each useLocalStorage call persists to its own key so data is independent
  const [catalog, setCatalog] = useLocalStorage<BisquePiece[]>('pottery-catalog', [
    { id: '1', name: '', wholesaleCost: 0 },
  ])
  const [settings, setSettings] = useLocalStorage<StudioSettings>(
    'pottery-settings',
    defaultSettings,
    migrateSettings  // handles legacy data from before the overhead categories feature
  )
  const [staffRoles, setStaffRoles] = useLocalStorage<StaffRole[]>('pottery-staff-roles', defaultStaffRoles)
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null)

  const selectedPiece = catalog.find((p) => p.id === selectedPieceId) || null
  // Only show pieces with a name in the dropdown — blank entries are in-progress
  const validPieces = catalog.filter((p) => p.name.trim())

  // Recalculate COGS whenever the selected piece, staff roles, or settings change
  const result = useMemo(() => {
    if (!selectedPiece || !selectedPiece.name.trim()) return null

    // Exclude unnamed roles — they're placeholders the user hasn't filled in yet
    const validRoles = staffRoles.filter(r => r.name.trim())
    const monthlyOverhead = calculateTotalOverhead(settings.overhead)

    return calculatePieceCOGS({
      bisqueCost: selectedPiece.wholesaleCost,
      glazeCostPerPiece: settings.glazeCostPerPiece,
      staffRoles: validRoles,
      kiln: settings.kiln,
      overhead: { monthlyOverhead, piecesPerMonth: settings.piecesPerMonth },
    })
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
