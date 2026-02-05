import { OverheadItem } from '../types/pottery'

interface Props {
  item: OverheadItem
  onChange: (item: OverheadItem) => void
  onDelete: (id: string) => void
}

export default function OverheadItemRow({ item, onChange, onDelete }: Props) {
  return (
    <div className="overhead-item-row">
      <input
        type="text"
        value={item.name}
        onChange={(e) => onChange({ ...item, name: e.target.value })}
        placeholder="Item name"
      />
      <input
        type="number"
        step="0.01"
        min="0"
        value={item.amount || ''}
        onChange={(e) => onChange({ ...item, amount: parseFloat(e.target.value) || 0 })}
        placeholder="0.00"
      />
      <button type="button" onClick={() => onDelete(item.id)} aria-label="Delete item">
        ×
      </button>
    </div>
  )
}
