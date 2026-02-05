import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OverheadCategorySection from './OverheadCategorySection'

describe('OverheadCategorySection', () => {
  const items = [
    { id: '1', name: 'Rent', amount: 2000 },
    { id: '2', name: 'Insurance', amount: 300 },
  ]

  it('renders category title', () => {
    render(
      <OverheadCategorySection
        title="Fixed Costs"
        items={items}
        onChange={() => {}}
      />
    )
    expect(screen.getByText('Fixed Costs')).toBeInTheDocument()
  })

  it('renders all items', () => {
    render(
      <OverheadCategorySection
        title="Fixed Costs"
        items={items}
        onChange={() => {}}
      />
    )
    expect(screen.getByDisplayValue('Rent')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Insurance')).toBeInTheDocument()
  })

  it('displays subtotal', () => {
    render(
      <OverheadCategorySection
        title="Fixed Costs"
        items={items}
        onChange={() => {}}
      />
    )
    expect(screen.getByText('Subtotal: $2,300.00')).toBeInTheDocument()
  })

  it('renders Add Item button', () => {
    render(
      <OverheadCategorySection
        title="Fixed Costs"
        items={items}
        onChange={() => {}}
      />
    )
    expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument()
  })

  it('calls onChange with new item when Add Item clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <OverheadCategorySection
        title="Fixed Costs"
        items={items}
        onChange={onChange}
      />
    )

    await user.click(screen.getByRole('button', { name: /add item/i }))

    expect(onChange).toHaveBeenCalled()
    const newItems = onChange.mock.calls[0][0]
    expect(newItems).toHaveLength(3)
    expect(newItems[2].name).toBe('')
    expect(newItems[2].amount).toBe(0)
  })

  it('calls onChange with item removed when delete clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <OverheadCategorySection
        title="Fixed Costs"
        items={items}
        onChange={onChange}
      />
    )

    // Click first delete button
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    expect(onChange).toHaveBeenCalled()
    const newItems = onChange.mock.calls[0][0]
    expect(newItems).toHaveLength(1)
    expect(newItems[0].name).toBe('Insurance') // First item (Rent) was deleted
  })

  it('calls onChange with updated item when item is edited', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <OverheadCategorySection
        title="Fixed Costs"
        items={items}
        onChange={onChange}
      />
    )

    // Type in the first item's name input to trigger onChange
    const nameInput = screen.getByDisplayValue('Rent')
    await user.type(nameInput, 'X')

    expect(onChange).toHaveBeenCalled()
    // Check the call has the updated item with appended character
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall[0].name).toBe('RentX')
    expect(lastCall[0].id).toBe('1') // Same item was updated
  })
})
