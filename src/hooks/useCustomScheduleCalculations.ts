
import { useMemo } from 'react';
import { CustomLeaseInstallment, CustomScheduleValidation } from '@/types/CustomScheduleTypes';
import { 
  calculateCustomScheduleInstallments, 
  calculateCustomScheduleNPV 
} from '@/utils/timeValueCalculations';

export const useCustomScheduleCalculations = (
  dealValue: number,
  leaseStartDate: Date | undefined,
  discountRate: number,
  installments: Array<{ id: string; paymentDate: Date; percentage: number }>
) => {
  const calculatedInstallments = useMemo(() => {
    if (!leaseStartDate || dealValue <= 0 || installments.length === 0) {
      return [];
    }

    return calculateCustomScheduleInstallments(
      dealValue,
      leaseStartDate,
      discountRate,
      installments
    );
  }, [dealValue, leaseStartDate, discountRate, installments]);

  const totalNPV = useMemo(() => {
    return calculateCustomScheduleNPV(calculatedInstallments);
  }, [calculatedInstallments]);

  const validation = useMemo((): CustomScheduleValidation => {
    const errors: string[] = [];
    
    if (!leaseStartDate) {
      errors.push('Lease start date is required');
    }
    
    if (dealValue <= 0) {
      errors.push('Deal value must be greater than 0');
    }
    
    if (installments.length === 0) {
      errors.push('At least one installment is required');
    }
    
    const percentageSum = installments.reduce((sum, inst) => sum + inst.percentage, 0);
    if (Math.abs(percentageSum - 100) > 0.01) {
      errors.push(`Installment percentages must sum to 100%. Current sum: ${percentageSum.toFixed(2)}%`);
    }
    
    const hasInvalidDates = leaseStartDate ? installments.some(inst => 
      inst.paymentDate < leaseStartDate
    ) : false;
    
    if (hasInvalidDates) {
      errors.push('All payment dates must be on or after the lease start date');
    }
    
    const hasInvalidPercentages = installments.some(inst => 
      inst.percentage <= 0 || inst.percentage > 100
    );
    
    if (hasInvalidPercentages) {
      errors.push('All percentages must be between 0 and 100');
    }

    // Validate that NPV equals deal value (within tolerance)
    if (calculatedInstallments.length > 0 && percentageSum === 100) {
      const npvDifference = Math.abs(totalNPV - dealValue);
      const tolerance = dealValue * 0.0001; // 0.01% tolerance
      
      if (npvDifference > tolerance) {
        errors.push(`NPV calculation error: Expected ${dealValue.toLocaleString()}, got ${totalNPV.toLocaleString()}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      percentageSum,
      hasInvalidDates
    };
  }, [leaseStartDate, dealValue, installments, calculatedInstallments, totalNPV]);

  return {
    calculatedInstallments,
    totalNPV,
    validation
  };
};
