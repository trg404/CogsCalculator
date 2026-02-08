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

  it('calls onChange when glaze cost is typed into', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StudioSettingsForm settings={defaultSettings} onChange={onChange} />)

    await user.type(screen.getByLabelText('Glaze Cost per Piece ($)'), '5')
    expect(onChange).toHaveBeenCalled()
    expect(onChange.mock.calls[onChange.mock.calls.length - 1][0]).toHaveProperty('glazeCostPerPiece')
  })

  it('calls onChange when kiln worker rate is typed into', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StudioSettingsForm settings={defaultSettings} onChange={onChange} />)

    await user.type(screen.getByLabelText('Kiln Worker Rate ($/hr)'), '5')
    expect(onChange).toHaveBeenCalled()
    expect(onChange.mock.calls[onChange.mock.calls.length - 1][0].kiln).toHaveProperty('hourlyRate')
  })

  it('calls onChange when minutes per firing is typed into', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StudioSettingsForm settings={defaultSettings} onChange={onChange} />)

    await user.type(screen.getByLabelText('Minutes per Firing'), '5')
    expect(onChange).toHaveBeenCalled()
    expect(onChange.mock.calls[onChange.mock.calls.length - 1][0].kiln).toHaveProperty('minutesPerFiring')
  })

  it('calls onChange when kiln workers is typed into', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StudioSettingsForm settings={defaultSettings} onChange={onChange} />)

    await user.type(screen.getByLabelText('Kiln Workers'), '1')
    expect(onChange).toHaveBeenCalled()
    expect(onChange.mock.calls[onChange.mock.calls.length - 1][0].kiln).toHaveProperty('kilnWorkerCount')
  })

  it('calls onChange when pieces per firing is typed into', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StudioSettingsForm settings={defaultSettings} onChange={onChange} />)

    await user.type(screen.getByLabelText('Pieces per Firing'), '5')
    expect(onChange).toHaveBeenCalled()
    expect(onChange.mock.calls[onChange.mock.calls.length - 1][0].kiln).toHaveProperty('piecesPerFiring')
  })

  it('calls onChange when variable costs are edited', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StudioSettingsForm settings={defaultSettings} onChange={onChange} />)

    // Type into the Utilities name input to trigger the variableCosts onChange path
    const utilitiesInput = screen.getByDisplayValue('Utilities')
    await user.type(utilitiesInput, ' Extra')
    expect(onChange).toHaveBeenCalled()
    expect(onChange.mock.calls[onChange.mock.calls.length - 1][0].overhead).toHaveProperty('variableCosts')
  })

  it('calls onChange when fixed costs are edited', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StudioSettingsForm settings={defaultSettings} onChange={onChange} />)

    // Type into the Rent name input to trigger the fixedCosts onChange path
    const rentInput = screen.getByDisplayValue('Rent')
    await user.type(rentInput, ' Payment')
    expect(onChange).toHaveBeenCalled()
    expect(onChange.mock.calls[onChange.mock.calls.length - 1][0].overhead).toHaveProperty('fixedCosts')
  })

  it('renders empty inputs when values are zero', () => {
    const zeroSettings: StudioSettings = {
      overhead: { fixedCosts: [], variableCosts: [] },
      piecesPerMonth: 0,
      glazeCostPerPiece: 0,
      kiln: {
        hourlyRate: 0,
        minutesPerFiring: 0,
        kilnWorkerCount: 0,
        piecesPerFiring: 0,
      },
    }
    render(<StudioSettingsForm settings={zeroSettings} onChange={() => {}} />)

    // Zero values render as empty inputs (value={x || ''} -> '')
    const piecesInput = screen.getByLabelText('Pieces per Month') as HTMLInputElement
    const glazeInput = screen.getByLabelText('Glaze Cost per Piece ($)') as HTMLInputElement
    const kilnRateInput = screen.getByLabelText('Kiln Worker Rate ($/hr)') as HTMLInputElement
    const minutesInput = screen.getByLabelText('Minutes per Firing') as HTMLInputElement
    const workersInput = screen.getByLabelText('Kiln Workers') as HTMLInputElement
    const piecesPerFiringInput = screen.getByLabelText('Pieces per Firing') as HTMLInputElement
    expect(piecesInput.value).toBe('')
    expect(glazeInput.value).toBe('')
    expect(kilnRateInput.value).toBe('')
    expect(minutesInput.value).toBe('')
    expect(workersInput.value).toBe('')
    expect(piecesPerFiringInput.value).toBe('')
  })

  it('falls back to 0 when pieces per month is cleared', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StudioSettingsForm settings={defaultSettings} onChange={onChange} />)

    await user.clear(screen.getByLabelText('Pieces per Month'))
    expect(onChange).toHaveBeenCalled()
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall).toHaveProperty('piecesPerMonth', 0)
  })

  it('falls back to 0 when glaze cost is cleared', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StudioSettingsForm settings={defaultSettings} onChange={onChange} />)

    await user.clear(screen.getByLabelText('Glaze Cost per Piece ($)'))
    expect(onChange).toHaveBeenCalled()
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall).toHaveProperty('glazeCostPerPiece', 0)
  })

  it('falls back to 0 when kiln worker rate is cleared', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StudioSettingsForm settings={defaultSettings} onChange={onChange} />)

    await user.clear(screen.getByLabelText('Kiln Worker Rate ($/hr)'))
    expect(onChange).toHaveBeenCalled()
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall.kiln).toHaveProperty('hourlyRate', 0)
  })

  it('falls back to 0 when minutes per firing is cleared', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StudioSettingsForm settings={defaultSettings} onChange={onChange} />)

    await user.clear(screen.getByLabelText('Minutes per Firing'))
    expect(onChange).toHaveBeenCalled()
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall.kiln).toHaveProperty('minutesPerFiring', 0)
  })

  it('falls back to 0 when kiln workers is cleared', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StudioSettingsForm settings={defaultSettings} onChange={onChange} />)

    await user.clear(screen.getByLabelText('Kiln Workers'))
    expect(onChange).toHaveBeenCalled()
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall.kiln).toHaveProperty('kilnWorkerCount', 0)
  })

  it('falls back to 0 when pieces per firing is cleared', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StudioSettingsForm settings={defaultSettings} onChange={onChange} />)

    await user.clear(screen.getByLabelText('Pieces per Firing'))
    expect(onChange).toHaveBeenCalled()
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall.kiln).toHaveProperty('piecesPerFiring', 0)
  })
})
