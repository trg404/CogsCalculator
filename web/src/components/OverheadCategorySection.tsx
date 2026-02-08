/**
 * OverheadCategorySection — a reusable CRUD list for one category of
 * overhead costs (either "Fixed Costs" or "Variable Costs"). Each item
 * is a named expense with a dollar amount (e.g. "Rent" = $2000).
 *
 * Shows a running subtotal at the bottom using the core sumOverheadItems()
 * function to stay consistent with how the COGS calculator totals overhead.
 */
import { sumOverheadItems } from '../../../src/pottery'
import { OverheadItem } from '../types/pottery'
import { formatCurrency } from '../utils/formatCurrency'
import OverheadItemRow from './OverheadItemRow'

interface Props {
  /** Section heading (e.g. "Fixed Costs" or "Variable Costs") */
  title: string
  /** The overhead line items in this category */
  items: OverheadItem[]
  /** Called with the updated full array on any add, edit, or delete */
  onChange: (items: OverheadItem[]) => void
}

export default function OverheadCategorySection({ title, items, onChange }: Props) {
  const subtotal = sumOverheadItems(items)

  const handleItemChange = (updatedItem: OverheadItem) => {
    onChange(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
  }

  const handleDelete = (id: string) => {
    onChange(items.filter((item) => item.id !== id))
  }

  const handleAdd = () => {
    onChange([...items, { id: crypto.randomUUID(), name: '', amount: 0 }])
  }

  return (
    <div className="overhead-category">
      <h4>{title}</h4>
      <div className="overhead-items">
        {items.map((item) => (
          <OverheadItemRow
            key={item.id}
            item={item}
            onChange={handleItemChange}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <button type="button" onClick={handleAdd} className="add-item-btn">
        + Add Item
      </button>
      <div className="overhead-subtotal">
        Subtotal: {formatCurrency(subtotal)}
      </div>
    </div>
  )
}
