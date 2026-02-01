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
  const [selectedPieceName, setSelectedPieceName] = useState<string | null>(null)

  const selectedPiece = catalog.find((p) => p.name === selectedPieceName) || null
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
