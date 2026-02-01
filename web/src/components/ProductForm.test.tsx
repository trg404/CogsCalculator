import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductForm from './ProductForm'

const emptyProduct = {
  id: '1',
  name: '',
  ingredients: [{ id: '1', name: '', quantity: 0, unitCost: 0 }],
  yield: 1,
  quantity: 1,
}

describe('ProductForm', () => {
  it('renders product name input', () => {
    render(<ProductForm products={[emptyProduct]} onChange={() => {}} />)
    expect(screen.getByLabelText('Product Name')).toBeInTheDocument()
  })

  it('renders ingredient fields', () => {
    render(<ProductForm products={[emptyProduct]} onChange={() => {}} />)
    expect(screen.getByLabelText('Ingredient')).toBeInTheDocument()
    expect(screen.getByLabelText('Quantity')).toBeInTheDocument()
    expect(screen.getByLabelText('Unit Cost')).toBeInTheDocument()
  })

  it('renders yield and quantity fields', () => {
    render(<ProductForm products={[emptyProduct]} onChange={() => {}} />)
    expect(screen.getByLabelText('Yield (units per batch)')).toBeInTheDocument()
    expect(screen.getByLabelText('Quantity to produce')).toBeInTheDocument()
  })

  it('calls onChange when product name changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ProductForm products={[emptyProduct]} onChange={onChange} />)

    await user.type(screen.getByLabelText('Product Name'), 'Cookie')
    expect(onChange).toHaveBeenCalled()
  })

  it('has add ingredient button', () => {
    render(<ProductForm products={[emptyProduct]} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /add ingredient/i })).toBeInTheDocument()
  })

  it('has add product button', () => {
    render(<ProductForm products={[emptyProduct]} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /add product/i })).toBeInTheDocument()
  })

  it('has remove button for ingredients when more than one', () => {
    const productWithIngredients = {
      ...emptyProduct,
      ingredients: [
        { id: '1', name: 'flour', quantity: 1, unitCost: 1 },
        { id: '2', name: 'sugar', quantity: 1, unitCost: 2 },
      ],
    }
    render(<ProductForm products={[productWithIngredients]} onChange={() => {}} />)
    const removeButtons = screen.getAllByRole('button', { name: /×/i })
    expect(removeButtons.length).toBeGreaterThan(0)
  })
})
