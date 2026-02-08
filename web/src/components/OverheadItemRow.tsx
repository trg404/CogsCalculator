/**
 * OverheadItemRow — a single editable row for one overhead cost line item.
 * Renders a name input, a dollar amount input, and a delete button.
 * Used by OverheadCategorySection to build the list of items.
 */
import { OverheadItem } from '../types/pottery'

interface Props {
  /** The overhead item to display and edit */
  item: OverheadItem
  /** Called with the updated item when name or amount changes */
  onChange: (item: OverheadItem) => void
  /** Called with the item's id when the delete button is clicked */
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
