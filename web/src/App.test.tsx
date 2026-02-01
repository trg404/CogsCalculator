import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('Pottery Studio COGS Calculator', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders app title', () => {
    render(<App />)
    expect(screen.getByText('Pottery Studio COGS Calculator')).toBeInTheDocument()
  })

  it('renders bisque piece selector', () => {
    render(<App />)
    expect(screen.getByLabelText('Select Piece')).toBeInTheDocument()
  })

  it('renders settings section', () => {
    render(<App />)
    expect(screen.getByText('Studio Settings')).toBeInTheDocument()
  })

  it('renders staff roles section', () => {
    render(<App />)
    expect(screen.getByText('Staff Roles')).toBeInTheDocument()
  })

  it('renders bisque catalog section', () => {
    render(<App />)
    expect(screen.getByText('Bisque Catalog')).toBeInTheDocument()
  })

  it('shows cost breakdown when piece is selected', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Add a piece to catalog first
    await user.type(screen.getByLabelText('Piece Name'), 'Snowman')
    await user.type(screen.getByLabelText('Wholesale Cost'), '4.50')

    // Select the piece
    await user.selectOptions(screen.getByLabelText('Select Piece'), 'Snowman')

    expect(screen.getByText(/Snowman - Cost Breakdown/)).toBeInTheDocument()
  })
})
