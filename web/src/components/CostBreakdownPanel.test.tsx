import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CostBreakdownPanel from './CostBreakdownPanel'
import { COGSResult } from '../types/pottery'

const mockResult: COGSResult = {
  totalCOGS: 22.91,
  breakdown: {
    bisqueCost: 4.5,
    glazeCost: 0.75,
    laborByRole: {
      'Glazing Guide': 1.25,
      'Manager': 0.56,
    },
    laborTotal: 1.81,
    kilnCost: 0.85,
    overheadCost: 15,
  },
}

describe('CostBreakdownPanel', () => {
  it('renders piece name when provided', () => {
    render(<CostBreakdownPanel pieceName="Frosty Snowman" result={mockResult} />)
    expect(screen.getByText(/Frosty Snowman/)).toBeInTheDocument()
  })

  it('renders total COGS', () => {
    render(<CostBreakdownPanel pieceName="Test" result={mockResult} />)
    expect(screen.getByText('$22.91')).toBeInTheDocument()
  })

  it('renders bisque cost', () => {
    render(<CostBreakdownPanel pieceName="Test" result={mockResult} />)
    expect(screen.getByText('Bisque Cost')).toBeInTheDocument()
    expect(screen.getByText('$4.50')).toBeInTheDocument()
  })

  it('renders labor breakdown by role', () => {
    render(<CostBreakdownPanel pieceName="Test" result={mockResult} />)
    expect(screen.getByText('Glazing Guide')).toBeInTheDocument()
    expect(screen.getByText('$1.25')).toBeInTheDocument()
    expect(screen.getByText('Manager')).toBeInTheDocument()
    expect(screen.getByText('$0.56')).toBeInTheDocument()
  })

  it('renders kiln cost', () => {
    render(<CostBreakdownPanel pieceName="Test" result={mockResult} />)
    expect(screen.getByText('Kiln Labor')).toBeInTheDocument()
    expect(screen.getByText('$0.85')).toBeInTheDocument()
  })

  it('renders overhead cost', () => {
    render(<CostBreakdownPanel pieceName="Test" result={mockResult} />)
    expect(screen.getByText('Overhead')).toBeInTheDocument()
    expect(screen.getByText('$15.00')).toBeInTheDocument()
  })

  it('shows select piece message when no result', () => {
    render(<CostBreakdownPanel pieceName={null} result={null} />)
    expect(screen.getByText(/select a piece/i)).toBeInTheDocument()
  })
})
