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

  it('calls onChange with new role appended when Add Role is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StaffConfigForm roles={[defaultRole]} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: /add role/i }))

    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        defaultRole,
        expect.objectContaining({
          name: '',
          hourlyRate: 15,
          minutesPerCustomer: 15,
          customersSimultaneous: 1,
        }),
      ])
    )
  })

  it('calls onChange with role removed when delete is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const secondRole: StaffRole = {
      id: '2',
      name: 'Manager',
      hourlyRate: 20,
      minutesPerCustomer: 5,
      customersSimultaneous: 3,
    }
    render(<StaffConfigForm roles={[defaultRole, secondRole]} onChange={onChange} />)

    const deleteButtons = screen.getAllByRole('button', { name: '×' })
    await user.click(deleteButtons[0])

    expect(onChange).toHaveBeenCalledWith([secondRole])
  })

  it('hides delete button when only one role exists', () => {
    render(<StaffConfigForm roles={[defaultRole]} onChange={() => {}} />)
    expect(screen.queryByRole('button', { name: '×' })).not.toBeInTheDocument()
  })

  it('shows delete buttons when multiple roles exist', () => {
    const roles: StaffRole[] = [
      defaultRole,
      { id: '2', name: 'Manager', hourlyRate: 20, minutesPerCustomer: 5, customersSimultaneous: 3 },
    ]
    render(<StaffConfigForm roles={roles} onChange={() => {}} />)
    expect(screen.getAllByRole('button', { name: '×' })).toHaveLength(2)
  })
})
