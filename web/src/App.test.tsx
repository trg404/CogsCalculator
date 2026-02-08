import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

/**
 * Helper: renders the App, types a piece name and cost into the catalog,
 * and selects it from the dropdown. Returns the userEvent instance for
 * further interactions.
 */
async function setupWithSelectedPiece(name: string, cost: string) {
  const user = userEvent.setup()
  render(<App />)

  await user.type(screen.getByLabelText('Piece Name'), name)
  await user.type(screen.getByLabelText('Wholesale Cost'), cost)

  const select = screen.getByLabelText('Select Piece')
  const option = screen.getByRole('option', { name: new RegExp(name) })
  await user.selectOptions(select, option)

  return user
}

describe('Pottery Studio COGS Calculator', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  // --- Basic rendering ---

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

  // --- Piece selection and breakdown ---

  it('shows cost breakdown when piece is selected', async () => {
    await setupWithSelectedPiece('Snowman', '4.50')
    expect(screen.getByText(/Snowman - Cost Breakdown/)).toBeInTheDocument()
  })

  it('displays correct COGS values in the breakdown panel', async () => {
    await setupWithSelectedPiece('Snowman', '4.50')

    // The breakdown panel should show actual dollar amounts.
    // With default settings (2 staff roles, kiln, and $0 overhead):
    //   Bisque: $4.50
    //   Glazing Guide: ($15 × 20/60) / 4 = $1.25
    //   Manager: ($20 × 5/60) / 3 = $0.56
    //   Kiln: ($17 × 30/60) × 2 / 20 = $0.85
    //   Glaze: $0.75
    //   Overhead: $0 (default overhead items are all $0)
    //   Total: $7.91
    const panel = screen.getByText(/Snowman - Cost Breakdown/).closest('aside')!
    expect(within(panel).getByText('$4.50')).toBeInTheDocument()
    expect(within(panel).getByText('$0.75')).toBeInTheDocument()
    expect(within(panel).getByText('$1.25')).toBeInTheDocument()
    expect(within(panel).getByText('$0.56')).toBeInTheDocument()
    expect(within(panel).getByText('$0.85')).toBeInTheDocument()
    expect(within(panel).getByText('$7.91')).toBeInTheDocument()
  })

  it('clears breakdown when piece is de-selected', async () => {
    const user = await setupWithSelectedPiece('Snowman', '4.50')

    // Verify breakdown is showing
    expect(screen.getByText(/Snowman - Cost Breakdown/)).toBeInTheDocument()

    // De-select by choosing the blank option
    const select = screen.getByLabelText('Select Piece')
    await user.selectOptions(select, '')

    // Breakdown should be replaced by placeholder
    expect(screen.queryByText(/Snowman - Cost Breakdown/)).not.toBeInTheDocument()
    expect(screen.getByText(/Select a piece to see cost breakdown/)).toBeInTheDocument()
  })

  // --- Filtering behavior ---

  it('excludes unnamed pieces from the dropdown', () => {
    render(<App />)

    // The default catalog has one piece with an empty name.
    // The dropdown should only have the placeholder option.
    const select = screen.getByLabelText('Select Piece')
    const options = within(select).getAllByRole('option')
    expect(options).toHaveLength(1) // just "-- Select a piece --"
    expect(options[0]).toHaveTextContent('-- Select a piece --')
  })

  it('excludes unnamed staff roles from COGS calculation', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Set up a piece
    await user.type(screen.getByLabelText('Piece Name'), 'Mug')
    await user.type(screen.getByLabelText('Wholesale Cost'), '3.00')

    // Clear the name of the first staff role (Glazing Guide) to make it unnamed
    const roleNameInputs = screen.getAllByLabelText('Role Name')
    await user.clear(roleNameInputs[0])

    // Select the piece
    const select = screen.getByLabelText('Select Piece')
    const option = screen.getByRole('option', { name: /Mug/ })
    await user.selectOptions(select, option)

    // The breakdown should exist but NOT show "Glazing Guide" labor
    const panel = screen.getByText(/Mug - Cost Breakdown/).closest('aside')!
    expect(within(panel).queryByText('Glazing Guide')).not.toBeInTheDocument()
    // Manager role should still appear (it still has a name)
    expect(within(panel).getByText('Manager')).toBeInTheDocument()
  })

  // --- State interactions ---

  it('updates breakdown when settings change after piece is selected', async () => {
    const user = await setupWithSelectedPiece('Snowman', '4.50')

    // Get the initial total
    const panel = screen.getByText(/Snowman - Cost Breakdown/).closest('aside')!
    expect(within(panel).getByText('$7.91')).toBeInTheDocument()

    // Change glaze cost from $0.75 to $2.00
    const glazeInput = screen.getByLabelText('Glaze Cost per Piece ($)')
    await user.clear(glazeInput)
    await user.type(glazeInput, '2')

    // Total should increase by $1.25 (from $7.91 to $9.16)
    expect(within(panel).getByText('$9.16')).toBeInTheDocument()
  })

  it('shows placeholder when selected piece is deleted from catalog', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Add two pieces so delete button appears
    await user.type(screen.getByLabelText('Piece Name'), 'Mug')
    const addBtn = screen.getByRole('button', { name: /add piece/i })
    await user.click(addBtn)

    // Fill in cost on first piece
    const costInputs = screen.getAllByLabelText('Wholesale Cost')
    await user.type(costInputs[0], '3.00')

    // Select the first piece
    const select = screen.getByLabelText('Select Piece')
    const option = screen.getByRole('option', { name: /Mug/ })
    await user.selectOptions(select, option)

    // Verify breakdown shows
    expect(screen.getByText(/Mug - Cost Breakdown/)).toBeInTheDocument()

    // Delete the first piece (the one we selected) using its × button
    const deleteButtons = screen.getAllByRole('button', { name: '×' })
    // Find the delete button in the catalog section (not in staff or overhead)
    const catalogSection = screen.getByText('Bisque Catalog').closest('section')!
    const catalogDeleteBtn = within(catalogSection).getAllByRole('button', { name: '×' })[0]
    await user.click(catalogDeleteBtn)

    // The selected piece no longer exists, so breakdown should show placeholder
    expect(screen.queryByText(/Mug - Cost Breakdown/)).not.toBeInTheDocument()
    expect(screen.getByText(/Select a piece to see cost breakdown/)).toBeInTheDocument()
  })

  // --- localStorage persistence ---

  it('persists catalog changes across re-renders', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)

    await user.type(screen.getByLabelText('Piece Name'), 'Bowl')
    await user.type(screen.getByLabelText('Wholesale Cost'), '5.00')

    // Unmount and re-render (simulates page refresh with same localStorage)
    unmount()
    render(<App />)

    // The piece should still be there
    expect(screen.getByLabelText('Piece Name')).toHaveValue('Bowl')
  })

  it('loads legacy settings via migration', () => {
    // Seed localStorage with legacy format (monthlyOverhead instead of overhead categories)
    const legacySettings = {
      monthlyOverhead: 6000,
      piecesPerMonth: 400,
      glazeCostPerPiece: 0.75,
      kiln: { hourlyRate: 17, minutesPerFiring: 30, kilnWorkerCount: 2, piecesPerFiring: 20 },
    }
    localStorage.setItem('pottery-settings', JSON.stringify(legacySettings))

    render(<App />)

    // The migrated settings should show the overhead total as $6,000
    // (legacy monthlyOverhead becomes a single "Other" fixed cost item)
    expect(screen.getByText('$6,000.00')).toBeInTheDocument()
  })
})
