import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudioSettingsForm from './StudioSettingsForm'
import { StudioSettings } from '../types/pottery'

const defaultSettings: StudioSettings = {
  overhead: {
    fixedCosts: [
      { id: '1', name: 'Rent', amount: 2000 },
    ],
    variableCosts: [
      { id: '2', name: 'Utilities', amount: 400 },
    ],
  },
  piecesPerMonth: 400,
  glazeCostPerPiece: 0.75,
  kiln: {
    hourlyRate: 17,
    minutesPerFiring: 30,
    kilnWorkerCount: 2,
    piecesPerFiring: 20,
  },
  staffRoles: [],
}

describe('StudioSettingsForm', () => {
  it('renders Fixed Costs section', () => {
    render(<StudioSettingsForm settings={defaultSettings} onChange={() => {}} />)
    expect(screen.getByText('Fixed Costs')).toBeInTheDocument()
  })

  it('renders Variable Costs section', () => {
    render(<StudioSettingsForm settings={defaultSettings} onChange={() => {}} />)
    expect(screen.getByText('Variable Costs')).toBeInTheDocument()
  })

  it('displays monthly overhead total', () => {
    render(<StudioSettingsForm settings={defaultSettings} onChange={() => {}} />)
    expect(screen.getByText(/Monthly Overhead Total/)).toBeInTheDocument()
    expect(screen.getByText('$2,400.00')).toBeInTheDocument()
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

  it('calls onChange when pieces per month changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StudioSettingsForm settings={defaultSettings} onChange={onChange} />)

    await user.clear(screen.getByLabelText('Pieces per Month'))
    await user.type(screen.getByLabelText('Pieces per Month'), '500')
    expect(onChange).toHaveBeenCalled()
  })
})
