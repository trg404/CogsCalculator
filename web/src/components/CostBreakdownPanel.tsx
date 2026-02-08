/**
 * CostBreakdownPanel — a read-only display panel that shows the per-piece
 * COGS breakdown once a bisque piece is selected. It renders each cost
 * line item (bisque, labor by role, kiln, glaze, overhead) and the total.
 *
 * When no piece is selected it shows a placeholder prompt.
 */
import { COGSResult } from '../types/pottery'
import { formatCurrency } from '../utils/formatCurrency'

interface Props {
  /** Name of the currently selected bisque piece, or null if none selected */
  pieceName: string | null
  /** Calculated COGS result from the core library, or null if no piece selected */
  result: COGSResult | null
}

export default function CostBreakdownPanel({ pieceName, result }: Props) {
  if (!result || !pieceName) {
    return (
      <aside className="breakdown-panel">
        <p className="placeholder">Select a piece to see cost breakdown</p>
      </aside>
    )
  }

  const { breakdown, totalCOGS } = result

  return (
    <aside className="breakdown-panel">
      <h2>{pieceName} - Cost Breakdown</h2>

      <div className="breakdown-section">
        <div className="breakdown-row">
          <span>Bisque Cost</span>
          <span>{formatCurrency(breakdown.bisqueCost)}</span>
        </div>
      </div>

      <div className="breakdown-section">
        <h3>Labor</h3>
        {Object.entries(breakdown.laborByRole).map(([role, cost]) => (
          <div key={role} className="breakdown-row indent">
            <span>{role}</span>
            <span>{formatCurrency(cost)}</span>
          </div>
        ))}
        <div className="breakdown-row indent">
          <span>Kiln Labor</span>
          <span>{formatCurrency(breakdown.kilnCost)}</span>
        </div>
      </div>

      <div className="breakdown-section">
        <div className="breakdown-row">
          <span>Glaze/Supplies</span>
          <span>{formatCurrency(breakdown.glazeCost)}</span>
        </div>
        <div className="breakdown-row">
          <span>Overhead</span>
          <span>{formatCurrency(breakdown.overheadCost)}</span>
        </div>
      </div>

      <div className="breakdown-total">
        <span>TOTAL COGS</span>
        <span>{formatCurrency(totalCOGS)}</span>
      </div>
    </aside>
  )
}
