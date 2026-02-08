import type { OverheadSettings } from '../../../src/pottery'

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

export type { COGSBreakdown, COGSResult, OverheadItem, OverheadSettings } from '../../../src/pottery'

export interface StudioSettings {
  overhead: OverheadSettings
  piecesPerMonth: number
  glazeCostPerPiece: number
  kiln: KilnSettings
  staffRoles: StaffRole[]
}
