interface Ingredient {
  id: string
  name: string
  quantity: number
  unitCost: number
}

interface Product {
  id: string
  name: string
  ingredients: Ingredient[]
  yield: number
  quantity: number
}

interface ProductFormProps {
  products: Product[]
  onChange: (products: Product[]) => void
}

export default function ProductForm({ products, onChange }: ProductFormProps) {
  const updateProduct = (productId: string, field: keyof Product, value: unknown) => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, [field]: value } : p
    )
    onChange(updated)
  }

  const updateIngredient = (
    productId: string,
    ingredientId: string,
    field: keyof Ingredient,
    value: string | number
  ) => {
    const updated = products.map((p) => {
      if (p.id !== productId) return p
      return {
        ...p,
        ingredients: p.ingredients.map((ing) =>
          ing.id === ingredientId ? { ...ing, [field]: value } : ing
        ),
      }
    })
    onChange(updated)
  }

  const addIngredient = (productId: string) => {
    const newIngredient: Ingredient = {
      id: crypto.randomUUID(),
      name: '',
      quantity: 0,
      unitCost: 0,
    }
    const updated = products.map((p) => {
      if (p.id !== productId) return p
      return { ...p, ingredients: [...p.ingredients, newIngredient] }
    })
    onChange(updated)
  }

  const removeIngredient = (productId: string, ingredientId: string) => {
    const updated = products.map((p) => {
      if (p.id !== productId) return p
      return {
        ...p,
        ingredients: p.ingredients.filter((ing) => ing.id !== ingredientId),
      }
    })
    onChange(updated)
  }

  const addProduct = () => {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: '',
      ingredients: [{ id: crypto.randomUUID(), name: '', quantity: 0, unitCost: 0 }],
      yield: 1,
      quantity: 1,
    }
    onChange([...products, newProduct])
  }

  const removeProduct = (productId: string) => {
    onChange(products.filter((p) => p.id !== productId))
  }

  return (
    <div className="form-section">
      <h2>Products</h2>

      {products.map((product, productIndex) => (
        <div key={product.id} className="form-card">
          <div className="form-card-header">
            <span>Product {productIndex + 1}</span>
            {products.length > 1 && (
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeProduct(product.id)}
              >
                ×
              </button>
            )}
          </div>

          <div className="form-group">
            <label htmlFor={`productName-${product.id}`}>Product Name</label>
            <input
              type="text"
              id={`productName-${product.id}`}
              value={product.name}
              onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
              placeholder="e.g., Chocolate Chip Cookie"
            />
          </div>

          <div className="ingredients-section">
            <h4>Ingredients</h4>
            {product.ingredients.map((ingredient, ingIndex) => (
              <div key={ingredient.id} className="ingredient-row">
                <div className="form-group">
                  <label htmlFor={`ingName-${ingredient.id}`}>
                    {ingIndex === 0 ? 'Ingredient' : ''}
                  </label>
                  <input
                    type="text"
                    id={`ingName-${ingredient.id}`}
                    value={ingredient.name}
                    onChange={(e) =>
                      updateIngredient(product.id, ingredient.id, 'name', e.target.value)
                    }
                    placeholder="e.g., flour"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`ingQty-${ingredient.id}`}>
                    {ingIndex === 0 ? 'Quantity' : ''}
                  </label>
                  <input
                    type="number"
                    id={`ingQty-${ingredient.id}`}
                    value={ingredient.quantity || ''}
                    onChange={(e) =>
                      updateIngredient(
                        product.id,
                        ingredient.id,
                        'quantity',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    min="0"
                    step="0.01"
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`ingCost-${ingredient.id}`}>
                    {ingIndex === 0 ? 'Unit Cost' : ''}
                  </label>
                  <input
                    type="number"
                    id={`ingCost-${ingredient.id}`}
                    value={ingredient.unitCost || ''}
                    onChange={(e) =>
                      updateIngredient(
                        product.id,
                        ingredient.id,
                        'unitCost',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                {product.ingredients.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn small"
                    onClick={() => removeIngredient(product.id, ingredient.id)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="add-btn small"
              onClick={() => addIngredient(product.id)}
            >
              + Add Ingredient
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`yield-${product.id}`}>Yield (units per batch)</label>
              <input
                type="number"
                id={`yield-${product.id}`}
                value={product.yield || ''}
                onChange={(e) =>
                  updateProduct(product.id, 'yield', parseInt(e.target.value) || 1)
                }
                min="1"
                placeholder="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor={`quantity-${product.id}`}>Quantity to produce</label>
              <input
                type="number"
                id={`quantity-${product.id}`}
                value={product.quantity || ''}
                onChange={(e) =>
                  updateProduct(product.id, 'quantity', parseInt(e.target.value) || 1)
                }
                min="1"
                placeholder="1"
              />
            </div>
          </div>
        </div>
      ))}

      <button type="button" className="add-btn" onClick={addProduct}>
        + Add Product
      </button>
    </div>
  )
}
