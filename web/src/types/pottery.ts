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

export interface OverheadItem {
  id: string
  name: string
  amount: number
}

export interface OverheadSettings {
  fixedCosts: OverheadItem[]
  variableCosts: OverheadItem[]
}

export interface StudioSettings {
  overhead: OverheadSettings
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
