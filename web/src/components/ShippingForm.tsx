interface ShippingFormProps {
  shippingCost: number
  onChange: (cost: number) => void
}

export default function ShippingForm({ shippingCost, onChange }: ShippingFormProps) {
  return (
    <div className="form-section">
      <h2>Shipping</h2>
      <div className="form-group">
        <label htmlFor="shippingCost">Shipping Cost</label>
        <input
          type="number"
          id="shippingCost"
          value={shippingCost || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min="0"
          step="0.01"
          placeholder="0.00"
        />
      </div>
    </div>
  )
}
