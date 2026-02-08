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

  it('calls onChange when minutes per customer is typed into', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StaffConfigForm roles={[defaultRole]} onChange={onChange} />)

    await user.type(screen.getByLabelText('Minutes per Customer'), '5')
    expect(onChange).toHaveBeenCalled()
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall[0]).toHaveProperty('minutesPerCustomer')
  })

  it('calls onChange when customers at once is typed into', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StaffConfigForm roles={[defaultRole]} onChange={onChange} />)

    await user.type(screen.getByLabelText('Customers at Once'), '2')
    expect(onChange).toHaveBeenCalled()
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall[0]).toHaveProperty('customersSimultaneous')
  })

  it('calls onChange when role name is typed into', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StaffConfigForm roles={[defaultRole]} onChange={onChange} />)

    await user.type(screen.getByLabelText('Role Name'), ' Sr')
    expect(onChange).toHaveBeenCalled()
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall[0]).toHaveProperty('name')
  })

  it('renders empty inputs when values are zero', () => {
    const zeroRole: StaffRole = {
      id: '1',
      name: 'Test',
      hourlyRate: 0,
      minutesPerCustomer: 0,
      customersSimultaneous: 0,
    }
    render(<StaffConfigForm roles={[zeroRole]} onChange={() => {}} />)

    // Zero values render as empty inputs (value={x || ''} -> '')
    const hourlyInput = screen.getByLabelText('Hourly Rate ($)') as HTMLInputElement
    const minutesInput = screen.getByLabelText('Minutes per Customer') as HTMLInputElement
    const customersInput = screen.getByLabelText('Customers at Once') as HTMLInputElement
    expect(hourlyInput.value).toBe('')
    expect(minutesInput.value).toBe('')
    expect(customersInput.value).toBe('')
  })

  it('falls back to 0 when hourly rate is cleared', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StaffConfigForm roles={[defaultRole]} onChange={onChange} />)

    await user.clear(screen.getByLabelText('Hourly Rate ($)'))
    expect(onChange).toHaveBeenCalled()
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall[0]).toHaveProperty('hourlyRate', 0)
  })

  it('falls back to 0 when minutes per customer is cleared', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StaffConfigForm roles={[defaultRole]} onChange={onChange} />)

    await user.clear(screen.getByLabelText('Minutes per Customer'))
    expect(onChange).toHaveBeenCalled()
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall[0]).toHaveProperty('minutesPerCustomer', 0)
  })

  it('falls back to 1 when customers at once is cleared', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StaffConfigForm roles={[defaultRole]} onChange={onChange} />)

    await user.clear(screen.getByLabelText('Customers at Once'))
    expect(onChange).toHaveBeenCalled()
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall[0]).toHaveProperty('customersSimultaneous', 1)
  })
})
