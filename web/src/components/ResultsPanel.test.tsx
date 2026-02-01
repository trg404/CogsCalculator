import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResultsPanel from './ResultsPanel'

describe('ResultsPanel', () => {
  const emptyResults = {
    totalCOGS: 0,
    totalProductCost: 0,
    totalLaborCost: 0,
    shippingCost: 0,
    products: [],
    laborByRole: {},
    costPerUnit: {},
  }

  it('renders total COGS', () => {
    render(<ResultsPanel results={emptyResults} />)
    expect(screen.getByText('Total COGS:')).toBeInTheDocument()
  })

  it('displays formatted dollar amounts', () => {
    const results = {
      ...emptyResults,
      totalCOGS: 150.5,
    }
    render(<ResultsPanel results={results} />)
    expect(screen.getByText('$150.50')).toBeInTheDocument()
  })

  it('shows product breakdown when products exist', () => {
    const results = {
      ...emptyResults,
      products: [
        { name: 'Cookie', totalCost: 10, costPerUnit: 0.5 },
      ],
    }
    render(<ResultsPanel results={results} />)
    expect(screen.getByText('Cookie')).toBeInTheDocument()
  })

  it('shows labor breakdown by role', () => {
    const results = {
      ...emptyResults,
      laborByRole: {
        baker: { count: 2, totalCost: 240 },
      },
    }
    render(<ResultsPanel results={results} />)
    expect(screen.getByText('baker')).toBeInTheDocument()
    expect(screen.getByText('2 employees')).toBeInTheDocument()
  })

  it('shows cost per unit for each product', () => {
    const results = {
      ...emptyResults,
      costPerUnit: {
        Cookie: 3.50,
      },
    }
    render(<ResultsPanel results={results} />)
    expect(screen.getByText('$3.50')).toBeInTheDocument()
  })
})
