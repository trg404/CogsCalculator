import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />)
    expect(screen.getByText('COGS Calculator')).toBeInTheDocument()
  })

  it('renders all form sections', () => {
    render(<App />)
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByText('Labor')).toBeInTheDocument()
    expect(screen.getByText('Shipping')).toBeInTheDocument()
    expect(screen.getByText('Results')).toBeInTheDocument()
  })

  it('starts with one empty product', () => {
    render(<App />)
    expect(screen.getByLabelText('Product Name')).toBeInTheDocument()
  })

  it('starts with one empty employee', () => {
    render(<App />)
    expect(screen.getByLabelText('Hourly Rate')).toBeInTheDocument()
  })

  it('shows results panel with zero values initially', () => {
    render(<App />)
    expect(screen.getByText('Total COGS:')).toBeInTheDocument()
    // Multiple $0.00 values are expected (product, labor, shipping, total)
    expect(screen.getAllByText('$0.00').length).toBeGreaterThan(0)
  })
})
