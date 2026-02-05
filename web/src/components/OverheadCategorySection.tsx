import { OverheadItem } from '../types/pottery'
import OverheadItemRow from './OverheadItemRow'

interface Props {
  title: string
  items: OverheadItem[]
  onChange: (items: OverheadItem[]) => void
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export default function OverheadCategorySection({ title, items, onChange }: Props) {
  const subtotal = items.reduce((sum, item) => sum + Math.max(0, item.amount), 0)

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
