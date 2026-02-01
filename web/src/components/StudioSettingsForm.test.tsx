import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudioSettingsForm from './StudioSettingsForm'
import { StudioSettings } from '../types/pottery'

const defaultSettings: StudioSettings = {
  monthlyOverhead: 0,
  piecesPerMonth: 0,
  glazeCostPerPiece: 0,
  kiln: {
    hourlyRate: 17,
    minutesPerFiring: 30,
    kilnWorkerCount: 2,
    piecesPerFiring: 20,
  },
  staffRoles: [],
}

describe('StudioSettingsForm', () => {
  it('renders overhead input', () => {
    render(<StudioSettingsForm settings={defaultSettings} onChange={() => {}} />)
    expect(screen.getByLabelText('Monthly Overhead ($)')).toBeInTheDocument()
  })

  it('renders pieces per month input', () => {
    render(<StudioSettingsForm settings={defaultSettings} onChange={() => {}} />)
    expect(screen.getByLabelText('Pieces per Month')).toBeInTheDocument()
  })

  it('renders glaze cost input', () => {
    render(<StudioSettingsForm settings={defaultSettings} onChange={() => {}} />)
    expect(screen.getByLabelText('Glaze Cost per Piece ($)')).toBeInTheDocument()
  })

  it('renders kiln settings', () => {
    render(<StudioSettingsForm settings={defaultSettings} onChange={() => {}} />)
    expect(screen.getByLabelText('Kiln Worker Rate ($/hr)')).toBeInTheDocument()
    expect(screen.getByLabelText('Minutes per Firing')).toBeInTheDocument()
    expect(screen.getByLabelText('Kiln Workers')).toBeInTheDocument()
    expect(screen.getByLabelText('Pieces per Firing')).toBeInTheDocument()
  })

  it('calls onChange when overhead changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StudioSettingsForm settings={defaultSettings} onChange={onChange} />)

    await user.type(screen.getByLabelText('Monthly Overhead ($)'), '5000')
    expect(onChange).toHaveBeenCalled()
  })
})
