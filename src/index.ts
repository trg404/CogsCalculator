import { calculateCOGS, calculateLaborCost, calculateProductCost, calculateMultiProductCOGS } from './cogs';

// ============================================
// EDIT YOUR VALUES HERE
// ============================================

// Define your products with ingredients
const cookie = calculateProductCost({
  name: 'Chocolate Chip Cookie',
  ingredients: [
    { name: 'flour', quantity: 2, unitCost: 1.50 },
    { name: 'sugar', quantity: 1, unitCost: 2.00 },
    { name: 'butter', quantity: 0.5, unitCost: 4.00 },
    { name: 'chocolate chips', quantity: 1, unitCost: 3.50 },
    { name: 'eggs', quantity: 0.5, unitCost: 0.40 },
  ],
  yield: 24  // makes 24 cookies
});

const muffin = calculateProductCost({
  name: 'Blueberry Muffin',
  ingredients: [
    { name: 'flour', quantity: 3, unitCost: 1.50 },
    { name: 'sugar', quantity: 1.5, unitCost: 2.00 },
    { name: 'butter', quantity: 0.75, unitCost: 4.00 },
    { name: 'blueberries', quantity: 2, unitCost: 4.00 },
    { name: 'eggs', quantity: 1, unitCost: 0.40 },
  ],
  yield: 12  // makes 12 muffins
});

// Define your employees
const laborResult = calculateLaborCost({
  employees: [
    { hourlyRate: 15, hoursWorked: 8, role: 'baker', shift: 'morning' },
    { hourlyRate: 15, hoursWorked: 8, role: 'baker', shift: 'morning' },
    { hourlyRate: 18, hoursWorked: 8, role: 'cashier', shift: 'morning' },
    { hourlyRate: 25, hoursWorked: 4, role: 'supervisor', shift: 'morning' },
  ]
});

// Calculate multi-product COGS
const multiProductResult = calculateMultiProductCOGS({
  products: [
    { name: cookie.productName, unitCost: cookie.costPerUnit!, quantity: 100 },
    { name: muffin.productName, unitCost: muffin.costPerUnit!, quantity: 50 },
  ],
  shippingCost: 25,
  laborCost: laborResult.totalLaborCost,
});

// ============================================
// OUTPUT
// ============================================

console.log('\n╔════════════════════════════════════════╗');
console.log('║         COGS CALCULATOR REPORT         ║');
console.log('╚════════════════════════════════════════╝');

console.log('\n=== PRODUCT: ' + cookie.productName.toUpperCase() + ' ===\n');
console.log('Ingredients:');
for (const [ingredient, cost] of Object.entries(cookie.breakdown)) {
  console.log(`  ${ingredient.padEnd(20)} $${cost.toFixed(2)}`);
}
console.log(`  ${'─'.repeat(24)}`);
console.log(`  ${'Batch Cost'.padEnd(20)} $${cookie.totalCost.toFixed(2)}`);
console.log(`  ${'Yield'.padEnd(20)} 24 units`);
console.log(`  ${'Cost per Unit'.padEnd(20)} $${cookie.costPerUnit?.toFixed(2)}`);

console.log('\n=== PRODUCT: ' + muffin.productName.toUpperCase() + ' ===\n');
console.log('Ingredients:');
for (const [ingredient, cost] of Object.entries(muffin.breakdown)) {
  console.log(`  ${ingredient.padEnd(20)} $${cost.toFixed(2)}`);
}
console.log(`  ${'─'.repeat(24)}`);
console.log(`  ${'Batch Cost'.padEnd(20)} $${muffin.totalCost.toFixed(2)}`);
console.log(`  ${'Yield'.padEnd(20)} 12 units`);
console.log(`  ${'Cost per Unit'.padEnd(20)} $${muffin.costPerUnit?.toFixed(2)}`);

console.log('\n=== LABOR BREAKDOWN ===\n');
console.log(`Total Labor Cost:    $${laborResult.totalLaborCost.toFixed(2)}`);
console.log(`Employee Count:      ${laborResult.employeeCount}`);
console.log(`Avg per Employee:    $${laborResult.averageCostPerEmployee?.toFixed(2)}`);

if (laborResult.byRole) {
  console.log('\nBy Role:');
  for (const [role, data] of Object.entries(laborResult.byRole)) {
    console.log(`  ${role.padEnd(15)} ${data.count} @ $${data.totalCost.toFixed(2)}`);
  }
}

console.log('\n=== MULTI-PRODUCT COGS ===\n');
console.log('Products:');
for (const [name, data] of Object.entries(multiProductResult.byProduct)) {
  console.log(`  ${name.padEnd(25)} ${data.quantity} units @ $${data.productCost.toFixed(2)}`);
}
console.log(`\nTotal Product Cost:  $${multiProductResult.totalProductCost.toFixed(2)}`);
console.log(`Shipping Cost:       $25.00`);
console.log(`Labor Cost:          $${laborResult.totalLaborCost.toFixed(2)}`);
console.log(`─────────────────────────────`);
console.log(`Total COGS:          $${multiProductResult.totalCOGS.toFixed(2)}`);

console.log('\n=== COST PER UNIT (with shared costs) ===\n');
for (const [name, cost] of Object.entries(multiProductResult.costPerUnit)) {
  console.log(`  ${name.padEnd(25)} $${cost.toFixed(2)}`);
}
console.log('');
