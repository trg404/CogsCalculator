import { useState, useMemo } from 'react'
import BisqueCatalogManager from './components/BisqueCatalogManager'
import StudioSettingsForm from './components/StudioSettingsForm'
import StaffConfigForm from './components/StaffConfigForm'
import CostBreakdownPanel from './components/CostBreakdownPanel'
import { useLocalStorage } from './hooks/useLocalStorage'
import { BisquePiece, StudioSettings, StaffRole, COGSResult } from './types/pottery'
import { calculateStaffLaborCost, calculateKilnLaborCost, calculateOverheadCost, calculateTotalOverhead } from '../../src/pottery'
import { roundCents } from '../../src/utils'
import './App.css'

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

function App() {
  const [catalog, setCatalog] = useLocalStorage<BisquePiece[]>('pottery-catalog', [
    { id: '1', name: '', wholesaleCost: 0 },
  ])
  const [settings, setSettings] = useLocalStorage<StudioSettings>(
    'pottery-settings',
    defaultSettings,
    migrateSettings
  )
  const [staffRoles, setStaffRoles] = useState<StaffRole[]>(defaultStaffRoles)
  const [selectedPieceName, setSelectedPieceName] = useState<string | null>(null)

  const selectedPiece = catalog.find((p) => p.name === selectedPieceName) || null
  const validPieces = catalog.filter((p) => p.name.trim())

  const result: COGSResult | null = useMemo(() => {
    if (!selectedPiece || !selectedPiece.name.trim()) return null

    const laborByRole: Record<string, number> = {}
    let laborTotal = 0

    for (const role of staffRoles) {
      if (role.name.trim()) {
        const cost = calculateStaffLaborCost({
          hourlyRate: role.hourlyRate,
          minutesPerCustomer: role.minutesPerCustomer,
          customersSimultaneous: role.customersSimultaneous,
        })
        laborByRole[role.name] = cost
        laborTotal += cost
      }
    }

    laborTotal = roundCents(laborTotal)

    const kilnCost = calculateKilnLaborCost({
      hourlyRate: settings.kiln.hourlyRate,
      minutesPerFiring: settings.kiln.minutesPerFiring,
      kilnWorkerCount: settings.kiln.kilnWorkerCount,
      piecesPerFiring: settings.kiln.piecesPerFiring,
    })

    const monthlyOverhead = calculateTotalOverhead(settings.overhead)
    const overheadCost = calculateOverheadCost({
      monthlyOverhead,
      piecesPerMonth: settings.piecesPerMonth,
    })

    const totalCOGS = roundCents(
      selectedPiece.wholesaleCost + settings.glazeCostPerPiece + laborTotal + kilnCost + overheadCost
    )

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
              value={selectedPieceName || ''}
              onChange={(e) => setSelectedPieceName(e.target.value || null)}
            >
              <option value="">-- Select a piece --</option>
              {validPieces.map((piece) => (
                <option key={piece.id} value={piece.name}>
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
