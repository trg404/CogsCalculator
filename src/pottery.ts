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

interface PieceCOGSBreakdown {
  bisqueCost: number
  glazeCost: number
  laborByRole: Record<string, number>
  laborTotal: number
  kilnCost: number
  overheadCost: number
}

interface PieceCOGSResult {
  totalCOGS: number
  breakdown: PieceCOGSBreakdown
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

export function calculatePieceCOGS(input: PieceCOGSInput): PieceCOGSResult {
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

  laborTotal = Math.round(laborTotal * 100) / 100

  const kilnCost = calculateKilnLaborCost(kiln)
  const overheadCost = calculateOverheadCost(overhead)

  const totalCOGS = Math.round(
    (bisqueCost + glazeCostPerPiece + laborTotal + kilnCost + overheadCost) * 100
  ) / 100

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
