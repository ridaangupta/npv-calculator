import { useState, useCallback } from 'react';
import { addDays } from 'date-fns';

export interface InstallmentInput {
  id: string;
  paymentDate: Date;
  percentage: number;
}

export const useInstallmentManager = (
  initialCount: number = 1,
  leaseStartDate: Date | undefined
) => {
  const [installments, setInstallments] = useState<InstallmentInput[]>(() => {
    const initial: InstallmentInput[] = [];
    for (let i = 0; i < initialCount; i++) {
      initial.push({
        id: `installment-${i + 1}`,
        paymentDate: leaseStartDate ? addDays(leaseStartDate, (i + 1) * 30) : new Date(),
        percentage: 100 / initialCount
      });
    }
    return initial;
  });

  const addInstallment = useCallback(() => {
    const newId = `installment-${Date.now()}`;
    const defaultDate = leaseStartDate ? addDays(leaseStartDate, 30) : new Date();
    
    setInstallments(prev => [...prev, {
      id: newId,
      paymentDate: defaultDate,
      percentage: 0
    }]);
  }, [leaseStartDate]);

  const removeInstallment = useCallback((id: string) => {
    setInstallments(prev => prev.filter(inst => inst.id !== id));
  }, []);

  const updateInstallment = useCallback((id: string, updates: Partial<Omit<InstallmentInput, 'id'>>) => {
    setInstallments(prev => prev.map(inst => 
      inst.id === id ? { ...inst, ...updates } : inst
    ));
  }, []);

  const setNumberOfInstallments = useCallback((count: number) => {
    setInstallments(prev => {
      const current = [...prev];
      
      if (count > current.length) {
        // Add new installments
        for (let i = current.length; i < count; i++) {
          current.push({
            id: `installment-${Date.now()}-${i}`,
            paymentDate: leaseStartDate ? addDays(leaseStartDate, (i + 1) * 30) : new Date(),
            percentage: 0
          });
        }
      } else if (count < current.length) {
        // Remove excess installments
        current.splice(count);
      }
      
      return current;
    });
  }, [leaseStartDate]);

  const distributePercentagesEvenly = useCallback(() => {
    if (installments.length === 0) return;
    
    const evenPercentage = 100 / installments.length;
    setInstallments(prev => prev.map(inst => ({
      ...inst,
      percentage: evenPercentage
    })));
  }, [installments.length]);

  return {
    installments,
    addInstallment,
    removeInstallment,
    updateInstallment,
    setNumberOfInstallments,
    distributePercentagesEvenly
  };
};