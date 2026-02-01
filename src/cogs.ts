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
