import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OverheadItemRow from './OverheadItemRow'

describe('OverheadItemRow', () => {
  const item = { id: '1', name: 'Rent', amount: 2000 }

  it('renders item name input', () => {
    render(<OverheadItemRow item={item} onChange={() => {}} onDelete={() => {}} />)
    expect(screen.getByDisplayValue('Rent')).toBeInTheDocument()
  })

  it('renders item amount input', () => {
    render(<OverheadItemRow item={item} onChange={() => {}} onDelete={() => {}} />)
    expect(screen.getByDisplayValue('2000')).toBeInTheDocument()
  })

  it('calls onChange when name changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<OverheadItemRow item={item} onChange={onChange} onDelete={() => {}} />)

    const nameInput = screen.getByDisplayValue('Rent')
    await user.clear(nameInput)
    await user.type(nameInput, 'Mortgage')

    expect(onChange).toHaveBeenCalled()
  })

  it('calls onDelete when delete button clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<OverheadItemRow item={item} onChange={() => {}} onDelete={onDelete} />)

    await user.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('calls onChange with amount field when amount input is typed into', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<OverheadItemRow item={item} onChange={onChange} onDelete={() => {}} />)

    const amountInput = screen.getByDisplayValue('2000')
    await user.type(amountInput, '5')

    // Verify onChange was called and the call includes an amount field
    expect(onChange).toHaveBeenCalled()
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall).toHaveProperty('amount')
    expect(lastCall).toHaveProperty('id', '1')
    expect(lastCall).toHaveProperty('name', 'Rent')
  })

  it('falls back to 0 when amount is cleared', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<OverheadItemRow item={item} onChange={onChange} onDelete={() => {}} />)

    const amountInput = screen.getByDisplayValue('2000')
    await user.clear(amountInput)

    expect(onChange).toHaveBeenCalled()
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall).toHaveProperty('amount', 0)
  })
})
