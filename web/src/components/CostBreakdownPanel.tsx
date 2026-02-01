import { COGSResult } from '../types/pottery'

interface Props {
  pieceName: string | null
  result: COGSResult | null
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`
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
