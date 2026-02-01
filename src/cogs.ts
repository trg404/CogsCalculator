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
