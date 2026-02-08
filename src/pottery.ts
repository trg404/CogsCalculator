import { roundCents } from './utils'

interface StaffLaborInput {
  hourlyRate: number
  minutesPerCustomer: number
  customersSimultaneous: number
}

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

export function calculateStaffLaborCost(input: StaffLaborInput): number {
  const { hourlyRate, minutesPerCustomer, customersSimultaneous } = input
  if (customersSimultaneous <= 0 || hourlyRate < 0 || minutesPerCustomer < 0) {
    return 0
  }
  const cost = (hourlyRate * minutesPerCustomer / 60) / customersSimultaneous
  return roundCents(cost)
}

interface KilnLaborInput {
  hourlyRate: number
  minutesPerFiring: number
  kilnWorkerCount: number
  piecesPerFiring: number
}

export function calculateKilnLaborCost(input: KilnLaborInput): number {
  const { hourlyRate, minutesPerFiring, kilnWorkerCount, piecesPerFiring } = input
  if (piecesPerFiring <= 0 || hourlyRate < 0 || kilnWorkerCount < 0 || minutesPerFiring < 0) {
    return 0
  }
  const totalLaborCost = (hourlyRate * minutesPerFiring / 60) * kilnWorkerCount
  const costPerPiece = totalLaborCost / piecesPerFiring
  return roundCents(costPerPiece)
}

interface OverheadInput {
  monthlyOverhead: number
  piecesPerMonth: number
}

export interface OverheadItem {
  id: string
  name: string
  amount: number
}

export function sumOverheadItems(items: OverheadItem[]): number {
  return items.reduce((sum, item) => sum + Math.max(0, item.amount), 0)
}

export interface OverheadSettings {
  fixedCosts: OverheadItem[]
  variableCosts: OverheadItem[]
}

export function calculateTotalOverhead(overhead: OverheadSettings): number {
  return sumOverheadItems(overhead.fixedCosts) + sumOverheadItems(overhead.variableCosts)
}

export function calculateOverheadCost(input: OverheadInput): number {
  const { monthlyOverhead, piecesPerMonth } = input
  if (piecesPerMonth <= 0 || monthlyOverhead < 0) return 0
  const costPerPiece = monthlyOverhead / piecesPerMonth
  return roundCents(costPerPiece)
}

export function calculatePieceCOGS(input: PieceCOGSInput): COGSResult {
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

  laborTotal = roundCents(laborTotal)

  const kilnCost = calculateKilnLaborCost(kiln)
  const overheadCost = calculateOverheadCost(overhead)

  const totalCOGS = roundCents(
    bisqueCost + glazeCostPerPiece + laborTotal + kilnCost + overheadCost
  )

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
