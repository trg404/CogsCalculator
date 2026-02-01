import { calculateCOGS, calculateLaborCost } from './cogs';

// ============================================
// EDIT YOUR VALUES HERE
// ============================================

// Define your employees
const laborResult = calculateLaborCost({
  employees: [
    { hourlyRate: 15, hoursWorked: 8, role: 'stocker', shift: 'morning' },
    { hourlyRate: 15, hoursWorked: 8, role: 'stocker', shift: 'morning' },
    { hourlyRate: 18, hoursWorked: 8, role: 'cashier', shift: 'morning' },
    { hourlyRate: 25, hoursWorked: 8, role: 'supervisor', shift: 'morning' },
    { hourlyRate: 15, hoursWorked: 8, role: 'stocker', shift: 'evening' },
    { hourlyRate: 18, hoursWorked: 8, role: 'cashier', shift: 'evening' },
  ]
});

// Calculate total COGS
const cogsResult = calculateCOGS({
  purchaseCost: 1000,      // Cost to purchase the goods
  shippingCost: 150,       // Shipping/freight costs
  laborCost: laborResult.totalLaborCost,  // Calculated from employees above
  quantity: 200,           // Number of units (for per-unit cost)
});

// ============================================
// OUTPUT
// ============================================

console.log('\n=== LABOR BREAKDOWN ===\n');
console.log(`Total Labor Cost:    $${laborResult.totalLaborCost.toFixed(2)}`);
console.log(`Employee Count:      ${laborResult.employeeCount}`);
console.log(`Avg per Employee:    $${laborResult.averageCostPerEmployee?.toFixed(2)}`);

if (laborResult.byRole) {
  console.log('\nBy Role:');
  for (const [role, data] of Object.entries(laborResult.byRole)) {
    console.log(`  ${role}: ${data.count} employees, $${data.totalCost.toFixed(2)}`);
  }
}

if (laborResult.byShift) {
  console.log('\nBy Shift:');
  for (const [shift, data] of Object.entries(laborResult.byShift)) {
    console.log(`  ${shift}: ${data.count} employees, $${data.totalCost.toFixed(2)}`);
  }
}

console.log('\n=== COGS SUMMARY ===\n');
console.log(`Purchase Cost:       $${cogsResult.breakdown.purchaseCost.toFixed(2)}`);
console.log(`Shipping Cost:       $${cogsResult.breakdown.shippingCost.toFixed(2)}`);
console.log(`Labor Cost:          $${cogsResult.breakdown.laborCost.toFixed(2)}`);
console.log(`─────────────────────────`);
console.log(`Total COGS:          $${cogsResult.totalCOGS.toFixed(2)}`);
if (cogsResult.costPerUnit) {
  console.log(`Cost per Unit:       $${cogsResult.costPerUnit.toFixed(2)}`);
}
console.log('');
