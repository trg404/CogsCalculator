import { useState, useMemo } from 'react'
import ProductForm from './components/ProductForm'
import LaborForm from './components/LaborForm'
import ShippingForm from './components/ShippingForm'
import ResultsPanel from './components/ResultsPanel'
import './App.css'

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

interface Employee {
  id: string
  hourlyRate: number
  hoursWorked: number
  role: string
  shift: string
}

function App() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: crypto.randomUUID(),
      name: '',
      ingredients: [{ id: crypto.randomUUID(), name: '', quantity: 0, unitCost: 0 }],
      yield: 1,
      quantity: 1,
    },
  ])

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: crypto.randomUUID(),
      hourlyRate: 0,
      hoursWorked: 0,
      role: '',
      shift: '',
    },
  ])

  const [shippingCost, setShippingCost] = useState(0)

  const results = useMemo(() => {
    // Calculate product costs
    const productResults = products
      .filter((p) => p.name)
      .map((product) => {
        const totalCost = product.ingredients.reduce(
          (sum, ing) => sum + ing.quantity * ing.unitCost,
          0
        )
        const costPerUnit = product.yield > 0 ? totalCost / product.yield : 0
        return {
          name: product.name,
          totalCost: Math.round(totalCost * 100) / 100,
          costPerUnit: Math.round(costPerUnit * 100) / 100,
          quantity: product.quantity,
        }
      })

    // Calculate total product cost
    const totalProductCost = productResults.reduce(
      (sum, p) => sum + p.costPerUnit * p.quantity,
      0
    )

    // Calculate labor costs
    const totalLaborCost = employees.reduce(
      (sum, emp) => sum + emp.hourlyRate * emp.hoursWorked,
      0
    )

    // Group labor by role
    const laborByRole: Record<string, { count: number; totalCost: number }> = {}
    employees.forEach((emp) => {
      if (emp.hourlyRate > 0 || emp.hoursWorked > 0) {
        const role = emp.role || 'unassigned'
        if (!laborByRole[role]) {
          laborByRole[role] = { count: 0, totalCost: 0 }
        }
        laborByRole[role].count += 1
        laborByRole[role].totalCost += emp.hourlyRate * emp.hoursWorked
      }
    })

    // Calculate total COGS
    const totalCOGS = totalProductCost + totalLaborCost + shippingCost

    // Calculate cost per unit with shared costs
    const totalUnits = productResults.reduce((sum, p) => sum + p.quantity, 0)
    const sharedCostPerUnit = totalUnits > 0 ? (totalLaborCost + shippingCost) / totalUnits : 0

    const costPerUnit: Record<string, number> = {}
    productResults.forEach((p) => {
      costPerUnit[p.name] = Math.round((p.costPerUnit + sharedCostPerUnit) * 100) / 100
    })

    return {
      totalCOGS: Math.round(totalCOGS * 100) / 100,
      totalProductCost: Math.round(totalProductCost * 100) / 100,
      totalLaborCost: Math.round(totalLaborCost * 100) / 100,
      shippingCost,
      products: productResults,
      laborByRole,
      costPerUnit,
    }
  }, [products, employees, shippingCost])

  return (
    <div className="app">
      <header>
        <h1>COGS Calculator</h1>
      </header>

      <main>
        <div className="forms-container">
          <ProductForm products={products} onChange={setProducts} />
          <LaborForm employees={employees} onChange={setEmployees} />
          <ShippingForm shippingCost={shippingCost} onChange={setShippingCost} />
        </div>

        <aside>
          <ResultsPanel results={results} />
        </aside>
      </main>
    </div>
  )
}

export default App
