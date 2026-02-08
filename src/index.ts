import { calculatePieceCOGS } from './pottery'

// ============================================
// POTTERY STUDIO COGS EXAMPLE
// ============================================
// This file demonstrates how to use the COGS calculator with sample data
// for a fictional pottery piece ("Frosty Snowman Globe"). It calls
// calculatePieceCOGS() and prints a formatted cost breakdown to the console.

const result = calculatePieceCOGS({
  bisqueCost: 4.50,
  glazeCostPerPiece: 0.75,
  staffRoles: [
    { name: 'Glazing Guide', hourlyRate: 15, minutesPerCustomer: 20, customersSimultaneous: 4 },
    { name: 'Manager', hourlyRate: 20, minutesPerCustomer: 5, customersSimultaneous: 3 },
  ],
  kiln: {
    hourlyRate: 17,
    minutesPerFiring: 30,
    kilnWorkerCount: 2,
    piecesPerFiring: 20,
  },
  overhead: {
    monthlyOverhead: 6000,
    piecesPerMonth: 400,
  },
})

console.log('\n╔════════════════════════════════════════╗')
console.log('║   POTTERY STUDIO COGS CALCULATOR       ║')
console.log('╚════════════════════════════════════════╝')

console.log('\n=== FROSTY SNOWMAN GLOBE ===\n')
console.log('Cost Breakdown:')
console.log(`  ${'Bisque Cost'.padEnd(20)} $${result.breakdown.bisqueCost.toFixed(2)}`)
console.log(`  ${'Glaze/Supplies'.padEnd(20)} $${result.breakdown.glazeCost.toFixed(2)}`)
console.log('\nLabor:')
for (const [role, cost] of Object.entries(result.breakdown.laborByRole)) {
  console.log(`  ${role.padEnd(20)} $${cost.toFixed(2)}`)
}
console.log(`  ${'Kiln Labor'.padEnd(20)} $${result.breakdown.kilnCost.toFixed(2)}`)
console.log(`\n  ${'Overhead'.padEnd(20)} $${result.breakdown.overheadCost.toFixed(2)}`)
console.log(`  ${'─'.repeat(24)}`)
console.log(`  ${'TOTAL COGS'.padEnd(20)} $${result.totalCOGS.toFixed(2)}`)
console.log('')
