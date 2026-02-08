/**
 * Pottery Studio COGS (Cost of Goods Sold) Calculator
 *
 * COGS is the total cost to produce a single piece that a customer paints.
 * Knowing this number helps a studio owner set prices that cover costs and
 * turn a profit. This module calculates per-piece COGS by adding up:
 *
 *   1. Bisque cost     – the unpainted ceramic piece purchased from a supplier
 *   2. Glaze cost      – paint, brushes, and other supplies used per piece
 *   3. Staff labor     – wages for each employee role, split across customers
 *   4. Kiln labor      – wages for workers who load/unload and fire the kiln
 *   5. Studio overhead – rent, utilities, insurance, etc. spread across pieces
 */
import { roundCents } from './utils'

/** Input needed to calculate one staff role's labor cost per customer piece. */
interface StaffLaborInput {
  /** How much this employee is paid per hour (e.g. $15/hr) */
  hourlyRate: number
  /** How many minutes this employee spends helping one customer */
  minutesPerCustomer: number
  /** How many customers this employee helps at the same time (shared attention) */
  customersSimultaneous: number
}

/** A named staff position with its labor cost parameters. */
interface StaffRole {
  /** Display name for this role (e.g. "Glazing Guide", "Manager") */
  name: string
  hourlyRate: number
  minutesPerCustomer: number
  customersSimultaneous: number
}

/** All the inputs needed to calculate the full COGS for a single piece. */
interface PieceCOGSInput {
  /** Wholesale cost of the unpainted ceramic piece */
  bisqueCost: number
  /** Cost of glaze, brushes, and supplies consumed per piece */
  glazeCostPerPiece: number
  /** Each staff role that contributes labor to a customer's piece */
  staffRoles: StaffRole[]
  /** Kiln firing labor details */
  kiln: KilnLaborInput
  /** Monthly overhead and production volume for per-piece allocation */
  overhead: OverheadInput
}

/** A detailed breakdown showing where every dollar of COGS comes from. */
export interface COGSBreakdown {
  bisqueCost: number
  glazeCost: number
  /** Labor cost keyed by role name (e.g. { "Glazing Guide": 1.25 }) */
  laborByRole: Record<string, number>
  /** Sum of all staff role labor costs */
  laborTotal: number
  kilnCost: number
  overheadCost: number
}

/** The final result: total COGS plus a line-by-line breakdown. */
export interface COGSResult {
  totalCOGS: number
  breakdown: COGSBreakdown
}

/**
 * Calculates how much one staff member's labor costs per customer piece.
 *
 * Formula:  (hourlyRate x minutesPerCustomer / 60) / customersSimultaneous
 *
 * Example: A Glazing Guide earns $15/hr, spends 20 min per customer,
 * and helps 4 customers at once:
 *   ($15 x 20 / 60) / 4 = $5.00 / 4 = $1.25 per piece
 *
 * The divide-by-60 converts minutes into a fraction of an hour so we can
 * multiply by the hourly rate. Dividing by customersSimultaneous splits
 * the cost because the employee's time is shared across multiple customers.
 */
export function calculateStaffLaborCost(input: StaffLaborInput): number {
  const { hourlyRate, minutesPerCustomer, customersSimultaneous } = input

  // Guard: return $0 if inputs are invalid (can't divide by zero customers,
  // and negative rates/times don't make sense)
  if (customersSimultaneous <= 0 || hourlyRate < 0 || minutesPerCustomer < 0) {
    return 0
  }

  const cost = (hourlyRate * minutesPerCustomer / 60) / customersSimultaneous
  return roundCents(cost)
}

/** Input needed to calculate kiln labor cost per piece. */
interface KilnLaborInput {
  /** Hourly wage of a kiln worker */
  hourlyRate: number
  /** How long a single kiln firing takes in minutes (loading + firing + unloading) */
  minutesPerFiring: number
  /** How many workers are involved in each firing */
  kilnWorkerCount: number
  /** How many customer pieces fit in the kiln per firing */
  piecesPerFiring: number
}

/**
 * Calculates the kiln labor cost allocated to a single piece.
 *
 * Formula:  (hourlyRate x minutesPerFiring / 60) x kilnWorkerCount / piecesPerFiring
 *
 * First we figure out the total labor cost for one firing (rate x time x workers),
 * then divide by the number of pieces in that firing to get the per-piece share.
 *
 * Example: 2 workers at $17/hr, 30-minute firing, 20 pieces per kiln load:
 *   Total firing labor = ($17 x 30/60) x 2 = $8.50 x 2 = $17.00
 *   Per piece = $17.00 / 20 = $0.85
 */
export function calculateKilnLaborCost(input: KilnLaborInput): number {
  const { hourlyRate, minutesPerFiring, kilnWorkerCount, piecesPerFiring } = input

  // Guard: return $0 for invalid inputs (can't divide by zero pieces, etc.)
  if (piecesPerFiring <= 0 || hourlyRate < 0 || kilnWorkerCount < 0 || minutesPerFiring < 0) {
    return 0
  }

  const totalLaborCost = (hourlyRate * minutesPerFiring / 60) * kilnWorkerCount
  const costPerPiece = totalLaborCost / piecesPerFiring
  return roundCents(costPerPiece)
}

/**
 * Overhead is all the ongoing costs of running the studio that aren't tied
 * to a specific piece — rent, utilities, insurance, software subscriptions, etc.
 * We spread these costs evenly across every piece produced in a month.
 */
interface OverheadInput {
  /** Total monthly overhead in dollars (sum of all fixed + variable costs) */
  monthlyOverhead: number
  /** Estimated number of customer pieces produced per month */
  piecesPerMonth: number
}

/** A single overhead line item (e.g. "Rent" = $2000, "Insurance" = $150). */
export interface OverheadItem {
  id: string
  name: string
  /** Monthly dollar amount for this cost */
  amount: number
}

/** Adds up a list of overhead items, treating any negative amounts as $0. */
export function sumOverheadItems(items: OverheadItem[]): number {
  return items.reduce((sum, item) => sum + Math.max(0, item.amount), 0)
}

/**
 * Overhead is split into two categories:
 *   - Fixed costs:    don't change with volume (rent, insurance, subscriptions)
 *   - Variable costs: scale with production (extra supplies, packaging, etc.)
 */
export interface OverheadSettings {
  fixedCosts: OverheadItem[]
  variableCosts: OverheadItem[]
}

/** Returns the combined monthly total of all fixed and variable overhead items. */
export function calculateTotalOverhead(overhead: OverheadSettings): number {
  return sumOverheadItems(overhead.fixedCosts) + sumOverheadItems(overhead.variableCosts)
}

/**
 * Calculates the overhead cost allocated to a single piece.
 *
 * Formula:  monthlyOverhead / piecesPerMonth
 *
 * Example: $6,000/month overhead with 400 pieces/month = $15.00 per piece
 */
export function calculateOverheadCost(input: OverheadInput): number {
  const { monthlyOverhead, piecesPerMonth } = input
  if (piecesPerMonth <= 0 || monthlyOverhead < 0) return 0
  const costPerPiece = monthlyOverhead / piecesPerMonth
  return roundCents(costPerPiece)
}

/**
 * The main entry point — calculates the total COGS for a single customer piece.
 *
 * It brings together every cost component:
 *   bisque + glaze + staff labor + kiln labor + overhead = total COGS
 *
 * Returns both the grand total and a detailed breakdown so the studio owner
 * can see exactly where their costs are coming from.
 */
export function calculatePieceCOGS(input: PieceCOGSInput): COGSResult {
  const { bisqueCost, glazeCostPerPiece, staffRoles, kiln, overhead } = input

  // Calculate labor cost for each staff role and keep a running total
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

  // Round after summing to avoid accumulated floating-point drift
  laborTotal = roundCents(laborTotal)

  const kilnCost = calculateKilnLaborCost(kiln)
  const overheadCost = calculateOverheadCost(overhead)

  // Sum all cost components into the final per-piece COGS
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
