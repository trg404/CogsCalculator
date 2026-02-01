interface ProductResult {
  name: string
  totalCost: number
  costPerUnit: number
}

interface RoleBreakdown {
  count: number
  totalCost: number
}

interface ResultsPanelProps {
  results: {
    totalCOGS: number
    totalProductCost: number
    totalLaborCost: number
    shippingCost: number
    products: ProductResult[]
    laborByRole: Record<string, RoleBreakdown>
    costPerUnit: Record<string, number>
  }
}

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}

export default function ResultsPanel({ results }: ResultsPanelProps) {
  return (
    <div className="results-panel">
      <h2>Results</h2>

      {results.products.length > 0 && (
        <div className="results-section">
          <h3>Products</h3>
          {results.products.map((product) => (
            <div key={product.name} className="result-item">
              <span>{product.name}</span>
              <span>{formatCurrency(product.totalCost)}</span>
            </div>
          ))}
        </div>
      )}

      {Object.keys(results.laborByRole).length > 0 && (
        <div className="results-section">
          <h3>Labor by Role</h3>
          {Object.entries(results.laborByRole).map(([role, data]) => (
            <div key={role} className="result-item">
              <span>{role}</span>
              <span>{data.count} employees</span>
              <span>{formatCurrency(data.totalCost)}</span>
            </div>
          ))}
        </div>
      )}

      {Object.keys(results.costPerUnit).length > 0 && (
        <div className="results-section">
          <h3>Cost per Unit (with shared costs)</h3>
          {Object.entries(results.costPerUnit).map(([name, cost]) => (
            <div key={name} className="result-item">
              <span>{name}</span>
              <span>{formatCurrency(cost)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="results-summary">
        <div className="result-item">
          <span>Product Cost:</span>
          <span>{formatCurrency(results.totalProductCost)}</span>
        </div>
        <div className="result-item">
          <span>Labor Cost:</span>
          <span>{formatCurrency(results.totalLaborCost)}</span>
        </div>
        <div className="result-item">
          <span>Shipping Cost:</span>
          <span>{formatCurrency(results.shippingCost)}</span>
        </div>
        <div className="result-item total">
          <span>Total COGS:</span>
          <span>{formatCurrency(results.totalCOGS)}</span>
        </div>
      </div>
    </div>
  )
}
