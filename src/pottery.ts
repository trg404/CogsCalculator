interface StaffLaborInput {
  hourlyRate: number
  minutesPerCustomer: number
  customersSimultaneous: number
}

export function calculateStaffLaborCost(input: StaffLaborInput): number {
  const { hourlyRate, minutesPerCustomer, customersSimultaneous } = input
  const cost = (hourlyRate * minutesPerCustomer / 60) / customersSimultaneous
  return Math.round(cost * 100) / 100
}
