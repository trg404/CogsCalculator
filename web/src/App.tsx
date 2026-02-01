import { useState, useMemo } from 'react'
import BisqueCatalogManager from './components/BisqueCatalogManager'
import StudioSettingsForm from './components/StudioSettingsForm'
import StaffConfigForm from './components/StaffConfigForm'
import CostBreakdownPanel from './components/CostBreakdownPanel'
import { useLocalStorage } from './hooks/useLocalStorage'
import { BisquePiece, StudioSettings, StaffRole, COGSResult } from './types/pottery'
import { calculateStaffLaborCost, calculateKilnLaborCost, calculateOverheadCost } from '../../src/pottery'
import { roundCents } from '../../src/utils'
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

function App() {
  const [catalog, setCatalog] = useLocalStorage<BisquePiece[]>('pottery-catalog', [
    { id: '1', name: '', wholesaleCost: 0 },
  ])
  const [settings, setSettings] = useLocalStorage<StudioSettings>('pottery-settings', defaultSettings)
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

    const overheadCost = calculateOverheadCost({
      monthlyOverhead: settings.monthlyOverhead,
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
