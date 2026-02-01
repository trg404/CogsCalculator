import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StaffConfigForm from './StaffConfigForm'
import { StaffRole } from '../types/pottery'

const defaultRole: StaffRole = {
  id: '1',
  name: 'Glazing Guide',
  hourlyRate: 15,
  minutesPerCustomer: 20,
  customersSimultaneous: 4,
}

describe('StaffConfigForm', () => {
  it('renders role name input', () => {
    render(<StaffConfigForm roles={[defaultRole]} onChange={() => {}} />)
    expect(screen.getByLabelText('Role Name')).toBeInTheDocument()
  })

  it('renders hourly rate input', () => {
    render(<StaffConfigForm roles={[defaultRole]} onChange={() => {}} />)
    expect(screen.getByLabelText('Hourly Rate ($)')).toBeInTheDocument()
  })

  it('renders minutes per customer input', () => {
    render(<StaffConfigForm roles={[defaultRole]} onChange={() => {}} />)
    expect(screen.getByLabelText('Minutes per Customer')).toBeInTheDocument()
  })

  it('renders customers simultaneous input', () => {
    render(<StaffConfigForm roles={[defaultRole]} onChange={() => {}} />)
    expect(screen.getByLabelText('Customers at Once')).toBeInTheDocument()
  })

  it('has add role button', () => {
    render(<StaffConfigForm roles={[defaultRole]} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /add role/i })).toBeInTheDocument()
  })

  it('calls onChange when hourly rate changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StaffConfigForm roles={[defaultRole]} onChange={onChange} />)

    const input = screen.getByLabelText('Hourly Rate ($)')
    await user.clear(input)
    await user.type(input, '18')
    expect(onChange).toHaveBeenCalled()
  })
})
