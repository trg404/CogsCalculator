import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LaborForm from './LaborForm'

const emptyEmployee = {
  id: '1',
  hourlyRate: 0,
  hoursWorked: 0,
  role: '',
  shift: '',
}

describe('LaborForm', () => {
  it('renders hourly rate input', () => {
    render(<LaborForm employees={[emptyEmployee]} onChange={() => {}} />)
    expect(screen.getByLabelText('Hourly Rate')).toBeInTheDocument()
  })

  it('renders hours worked input', () => {
    render(<LaborForm employees={[emptyEmployee]} onChange={() => {}} />)
    expect(screen.getByLabelText('Hours Worked')).toBeInTheDocument()
  })

  it('renders role input', () => {
    render(<LaborForm employees={[emptyEmployee]} onChange={() => {}} />)
    expect(screen.getByLabelText('Role')).toBeInTheDocument()
  })

  it('renders shift input', () => {
    render(<LaborForm employees={[emptyEmployee]} onChange={() => {}} />)
    expect(screen.getByLabelText('Shift')).toBeInTheDocument()
  })

  it('calls onChange when hourly rate changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<LaborForm employees={[emptyEmployee]} onChange={onChange} />)

    await user.type(screen.getByLabelText('Hourly Rate'), '15')
    expect(onChange).toHaveBeenCalled()
  })

  it('has add employee button', () => {
    render(<LaborForm employees={[emptyEmployee]} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /add employee/i })).toBeInTheDocument()
  })

  it('has remove button when more than one employee', () => {
    const employees = [emptyEmployee, { ...emptyEmployee, id: '2' }]
    render(<LaborForm employees={employees} onChange={() => {}} />)
    const removeButtons = screen.getAllByRole('button', { name: /×/i })
    expect(removeButtons.length).toBe(2)
  })
})
