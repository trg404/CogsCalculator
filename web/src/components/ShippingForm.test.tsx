import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ShippingForm from './ShippingForm'

describe('ShippingForm', () => {
  it('renders shipping cost input', () => {
    render(<ShippingForm shippingCost={0} onChange={() => {}} />)
    expect(screen.getByLabelText('Shipping Cost')).toBeInTheDocument()
  })

  it('displays the current shipping cost value', () => {
    render(<ShippingForm shippingCost={50} onChange={() => {}} />)
    expect(screen.getByLabelText('Shipping Cost')).toHaveValue(50)
  })

  it('calls onChange when shipping cost changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ShippingForm shippingCost={0} onChange={onChange} />)

    await user.type(screen.getByLabelText('Shipping Cost'), '25')
    expect(onChange).toHaveBeenCalled()
  })
})
