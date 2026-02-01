interface StaffLaborInput {
  hourlyRate: number
  minutesPerCustomer: number
  customersSimultaneous: number
}

export function calculateStaffLaborCost(input: StaffLaborInput): number {
  const { hourlyRate, minutesPerCustomer, customersSimultaneous } = input
  const cost = (hourlyRate * minutesPerCustomer / 60) / customersSimultaneous
  return Math.round(cost * 100) / 100
}

interface KilnLaborInput {
  hourlyRate: number
  minutesPerFiring: number
  kilnWorkerCount: number
  piecesPerFiring: number
}

export function calculateKilnLaborCost(input: KilnLaborInput): number {
  const { hourlyRate, minutesPerFiring, kilnWorkerCount, piecesPerFiring } = input
  const totalLaborCost = (hourlyRate * minutesPerFiring / 60) * kilnWorkerCount
  const costPerPiece = totalLaborCost / piecesPerFiring
  return Math.round(costPerPiece * 100) / 100
}

interface OverheadInput {
  monthlyOverhead: number
  piecesPerMonth: number
}

export function calculateOverheadCost(input: OverheadInput): number {
  const { monthlyOverhead, piecesPerMonth } = input
  if (piecesPerMonth === 0) return 0
  const costPerPiece = monthlyOverhead / piecesPerMonth
  return Math.round(costPerPiece * 100) / 100
}
