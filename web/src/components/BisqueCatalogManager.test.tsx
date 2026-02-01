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
})
