
import { useMemo } from 'react';

interface CashFlow {
  id: string;
  year: number;
  amount: number;
}

export const useOptimizedCalculations = () => {
  // Memoized NPV calculation
  const calculateNPVMemoized = useMemo(() => {
    return (cashFlows: CashFlow[], discountRate: number) => {
      let npvValue = 0;
      cashFlows.forEach(flow => {
        const presentValue = flow.amount / Math.pow(1 + discountRate / 100, flow.year);
        npvValue += presentValue;
      });
      return npvValue;
    };
  }, []);

  // Memoized cash flow generation
  const generateCashFlowsMemoized = useMemo(() => {
    return (
      baseCashFlow: number,
      increaseValue: number,
      increaseType: 'amount' | 'percent',
      increaseFrequency: number,
      timePeriod: number
    ) => {
      const generatedFlows: CashFlow[] = [];
      const annualIncreaseValue = increaseValue / increaseFrequency;
      let currentCashFlowPerM2 = baseCashFlow;
      
      for (let year = 1; year <= timePeriod; year++) {
        if (year > 1) {
          if (increaseType === 'amount') {
            currentCashFlowPerM2 += annualIncreaseValue;
          } else if (increaseType === 'percent') {
            currentCashFlowPerM2 = currentCashFlowPerM2 * (1 + annualIncreaseValue / 100);
          }
        }
        
        const currentCashFlowPerHectare = currentCashFlowPerM2 * 10000;
        const roundedCashFlow = Math.round(currentCashFlowPerHectare * 100) / 100;
        
        generatedFlows.push({
          id: year.toString(),
          year: year,
          amount: Math.max(0, roundedCashFlow)
        });
      }
      
      return generatedFlows;
    };
  }, []);

  return {
    calculateNPVMemoized,
    generateCashFlowsMemoized
  };
};
