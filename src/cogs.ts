interface COGSInput {
  purchaseCost: number;
  shippingCost: number;
  laborCost: number;
  quantity?: number;
}

interface COGSBreakdown {
  purchaseCost: number;
  shippingCost: number;
  laborCost: number;
}

interface COGSResult {
  totalCOGS: number;
  costPerUnit?: number;
  breakdown: COGSBreakdown;
}

interface Employee {
  hourlyRate: number;
  hoursWorked: number;
  role?: string;
  shift?: string;
}

interface LaborInput {
  employees: Employee[];
}

interface GroupBreakdown {
  count: number;
  totalCost: number;
}

interface LaborResult {
  totalLaborCost: number;
  employeeCount: number;
  averageCostPerEmployee?: number;
  byRole?: Record<string, GroupBreakdown>;
  byShift?: Record<string, GroupBreakdown>;
}

export function calculateLaborCost(input: LaborInput): LaborResult {
  const { employees } = input;

  const totalLaborCost = employees.reduce(
    (sum, emp) => sum + emp.hourlyRate * emp.hoursWorked,
    0
  );

  const result: LaborResult = {
    totalLaborCost,
    employeeCount: employees.length,
  };

  if (employees.length > 0) {
    result.averageCostPerEmployee = Math.round((totalLaborCost / employees.length) * 100) / 100;
  }

  // Group by role if any employee has a role
  const hasRoles = employees.some((emp) => emp.role);
  if (hasRoles) {
    result.byRole = {};
    for (const emp of employees) {
      const role = emp.role || 'unassigned';
      const cost = emp.hourlyRate * emp.hoursWorked;
      if (!result.byRole[role]) {
        result.byRole[role] = { count: 0, totalCost: 0 };
      }
      result.byRole[role].count += 1;
      result.byRole[role].totalCost += cost;
    }
  }

  // Group by shift if any employee has a shift
  const hasShifts = employees.some((emp) => emp.shift);
  if (hasShifts) {
    result.byShift = {};
    for (const emp of employees) {
      const shift = emp.shift || 'unassigned';
      const cost = emp.hourlyRate * emp.hoursWorked;
      if (!result.byShift[shift]) {
        result.byShift[shift] = { count: 0, totalCost: 0 };
      }
      result.byShift[shift].count += 1;
      result.byShift[shift].totalCost += cost;
    }
  }

  return result;
}

// Pro-rated labor allocation per product
interface LaborAllocation {
  employeeIndex: number;
  percentage: number;
}

interface AllocateLaborInput {
  employees: Employee[];
  allocations: Record<string, LaborAllocation[]>;
}

interface EmployeeDetail {
  role: string;
  percentage: number;
  cost: number;
}

interface AllocateLaborResult {
  laborByProduct: Record<string, number>;
  detailByProduct: Record<string, EmployeeDetail[]>;
  totalAllocated: number;
  unallocatedLabor: number;
}

export function allocateLabor(input: AllocateLaborInput): AllocateLaborResult {
  const { employees, allocations } = input;

  // Calculate total labor cost
  const employeeCosts = employees.map((emp) =>
    Math.round(emp.hourlyRate * emp.hoursWorked * 100) / 100
  );
  const totalLabor = employeeCosts.reduce((sum, cost) => sum + cost, 0);

  const laborByProduct: Record<string, number> = {};
  const detailByProduct: Record<string, EmployeeDetail[]> = {};
  let totalAllocated = 0;

  for (const [productName, productAllocations] of Object.entries(allocations)) {
    let productLaborCost = 0;
    const details: EmployeeDetail[] = [];

    for (const alloc of productAllocations) {
      const employee = employees[alloc.employeeIndex];
      const employeeCost = employeeCosts[alloc.employeeIndex];
      const allocatedCost = Math.round(employeeCost * (alloc.percentage / 100) * 100) / 100;

      productLaborCost += allocatedCost;
      totalAllocated += allocatedCost;

      details.push({
        role: employee.role || 'unassigned',
        percentage: alloc.percentage,
        cost: allocatedCost,
      });
    }

    laborByProduct[productName] = Math.round(productLaborCost * 100) / 100;
    detailByProduct[productName] = details;
  }

  return {
    laborByProduct,
    detailByProduct,
    totalAllocated: Math.round(totalAllocated * 100) / 100,
    unallocatedLabor: Math.round((totalLabor - totalAllocated) * 100) / 100,
  };
}

// Product cost calculation from ingredients
interface Ingredient {
  name: string;
  quantity: number;
  unitCost: number;
}

interface ProductInput {
  name: string;
  ingredients: Ingredient[];
  yield?: number;
}

interface ProductResult {
  productName: string;
  totalCost: number;
  costPerUnit?: number;
  breakdown: Record<string, number>;
}

export function calculateProductCost(input: ProductInput): ProductResult {
  const { name, ingredients, yield: batchYield } = input;

  const breakdown: Record<string, number> = {};
  let totalCost = 0;

  for (const ingredient of ingredients) {
    const ingredientCost = Math.round(ingredient.quantity * ingredient.unitCost * 100) / 100;
    breakdown[ingredient.name] = ingredientCost;
    totalCost += ingredientCost;
  }

  totalCost = Math.round(totalCost * 100) / 100;

  const result: ProductResult = {
    productName: name,
    totalCost,
    breakdown,
  };

  if (batchYield && batchYield > 0) {
    result.costPerUnit = Math.round((totalCost / batchYield) * 100) / 100;
  }

  return result;
}

// Multi-product COGS calculation
interface ProductEntry {
  name: string;
  unitCost: number;
  quantity: number;
}

interface MultiProductInput {
  products: ProductEntry[];
  shippingCost: number;
  laborCost: number;
}

interface ProductBreakdown {
  quantity: number;
  productCost: number;
}

interface MultiProductResult {
  totalCOGS: number;
  totalProductCost: number;
  byProduct: Record<string, ProductBreakdown>;
  costPerUnit: Record<string, number>;
}

export function calculateMultiProductCOGS(input: MultiProductInput): MultiProductResult {
  const { products, shippingCost, laborCost } = input;

  const byProduct: Record<string, ProductBreakdown> = {};
  let totalProductCost = 0;
  let totalUnits = 0;

  for (const product of products) {
    const productCost = Math.round(product.unitCost * product.quantity * 100) / 100;
    byProduct[product.name] = {
      quantity: product.quantity,
      productCost,
    };
    totalProductCost += productCost;
    totalUnits += product.quantity;
  }

  totalProductCost = Math.round(totalProductCost * 100) / 100;
  const sharedCosts = shippingCost + laborCost;
  const totalCOGS = Math.round((totalProductCost + sharedCosts) * 100) / 100;

  // Calculate cost per unit with shared costs distributed
  const costPerUnit: Record<string, number> = {};
  const sharedCostPerUnit = totalUnits > 0 ? sharedCosts / totalUnits : 0;

  for (const product of products) {
    const perUnitWithShared = product.unitCost + sharedCostPerUnit;
    costPerUnit[product.name] = Math.round(perUnitWithShared * 100) / 100;
  }

  return {
    totalCOGS,
    totalProductCost,
    byProduct,
    costPerUnit,
  };
}

export function calculateCOGS(input: COGSInput): COGSResult {
  const { purchaseCost, shippingCost, laborCost, quantity } = input;

  const rawTotal = purchaseCost + shippingCost + laborCost;
  const totalCOGS = Math.round(rawTotal * 100) / 100;

  const result: COGSResult = {
    totalCOGS,
    breakdown: {
      purchaseCost,
      shippingCost,
      laborCost,
    },
  };

  if (quantity && quantity > 0) {
    result.costPerUnit = Math.round((totalCOGS / quantity) * 100) / 100;
  }

  return result;
}
