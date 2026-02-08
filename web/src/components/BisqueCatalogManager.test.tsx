import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BisqueCatalogManager from './BisqueCatalogManager'
import { BisquePiece } from '../types/pottery'

describe('BisqueCatalogManager', () => {
  const emptyPiece: BisquePiece = { id: '1', name: '', wholesaleCost: 0 }

  it('renders add piece button', () => {
    render(<BisqueCatalogManager pieces={[]} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /add piece/i })).toBeInTheDocument()
  })

  it('renders piece name and cost inputs', () => {
    render(<BisqueCatalogManager pieces={[emptyPiece]} onChange={() => {}} />)
    expect(screen.getByLabelText('Piece Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Wholesale Cost')).toBeInTheDocument()
  })

  it('calls onChange when piece name changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<BisqueCatalogManager pieces={[emptyPiece]} onChange={onChange} />)

    await user.type(screen.getByLabelText('Piece Name'), 'Snowman')
    expect(onChange).toHaveBeenCalled()
  })

  it('calls onChange with new piece appended when Add Piece is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const existingPiece: BisquePiece = { id: '1', name: 'Mug', wholesaleCost: 3.00 }
    render(<BisqueCatalogManager pieces={[existingPiece]} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: /add piece/i }))

    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        existingPiece,
        expect.objectContaining({ name: '', wholesaleCost: 0 }),
      ])
    )
  })

  it('calls onChange with piece removed when delete is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const pieces: BisquePiece[] = [
      { id: '1', name: 'Mug', wholesaleCost: 3.00 },
      { id: '2', name: 'Bowl', wholesaleCost: 5.00 },
    ]
    render(<BisqueCatalogManager pieces={pieces} onChange={onChange} />)

    // Click the first delete button (×)
    const deleteButtons = screen.getAllByRole('button', { name: '×' })
    await user.click(deleteButtons[0])

    expect(onChange).toHaveBeenCalledWith([pieces[1]])
  })

  it('hides delete button when only one piece exists', () => {
    render(<BisqueCatalogManager pieces={[emptyPiece]} onChange={() => {}} />)
    expect(screen.queryByRole('button', { name: '×' })).not.toBeInTheDocument()
  })

  it('shows delete buttons when multiple pieces exist', () => {
    const pieces: BisquePiece[] = [
      { id: '1', name: 'Mug', wholesaleCost: 3.00 },
      { id: '2', name: 'Bowl', wholesaleCost: 5.00 },
    ]
    render(<BisqueCatalogManager pieces={pieces} onChange={() => {}} />)
    expect(screen.getAllByRole('button', { name: '×' })).toHaveLength(2)
  })

  it('calls onChange with updated cost when wholesale cost changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<BisqueCatalogManager pieces={[emptyPiece]} onChange={onChange} />)

    await user.type(screen.getByLabelText('Wholesale Cost'), '4.50')
    expect(onChange).toHaveBeenCalled()
  })
})
