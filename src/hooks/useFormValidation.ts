import { useMemo } from 'react';
import { PaymentSchedule } from '@/types/PaymentSchedule';

interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  completionPercentage: number;
}

interface UseFormValidationProps {
  discountRateInput: string;
  baseCashFlowInput: string;
  increaseValueInput: string;
  increaseType: 'amount' | 'percent';
  timePeriodInput: string;
  totalHectaresInput: string;
  paymentType: 'normal' | 'custom';
  paymentSchedule: PaymentSchedule;
  cashFlows: any[];
  npv: number;
}

export const useFormValidation = ({
  discountRateInput,
  baseCashFlowInput,
  increaseValueInput,
  increaseType,
  timePeriodInput,
  totalHectaresInput,
  paymentType,
  paymentSchedule,
  cashFlows,
  npv
}: UseFormValidationProps): ValidationResult => {
  
  const validation = useMemo(() => {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    let completedFields = 0;
    const totalFields = paymentType === 'custom' ? 8 : 6;

    // Discount Rate Validation
    const discountRate = Number(discountRateInput);
    if (!discountRateInput || discountRateInput.trim() === '') {
      errors.push({ field: 'discountRate', message: 'Discount rate is required', type: 'error' });
    } else if (isNaN(discountRate) || discountRate < 0) {
      errors.push({ field: 'discountRate', message: 'Discount rate must be a valid positive number', type: 'error' });
    } else if (discountRate > 50) {
      warnings.push({ field: 'discountRate', message: 'Discount rate above 50% is unusually high', type: 'warning' });
      completedFields++;
    } else {
      completedFields++;
    }

    // Base Cash Flow Validation
    const baseCashFlow = Number(baseCashFlowInput);
    if (!baseCashFlowInput || baseCashFlowInput.trim() === '') {
      errors.push({ field: 'baseCashFlow', message: 'Base cash flow is required', type: 'error' });
    } else if (isNaN(baseCashFlow) || baseCashFlow <= 0) {
      errors.push({ field: 'baseCashFlow', message: 'Base cash flow must be greater than 0', type: 'error' });
    } else {
      completedFields++;
    }

    // Increase Value Validation
    const increaseValue = Number(increaseValueInput);
    if (!increaseValueInput || increaseValueInput.trim() === '') {
      errors.push({ field: 'increaseValue', message: 'Increase value is required', type: 'error' });
    } else if (isNaN(increaseValue) || increaseValue < 0) {
      errors.push({ field: 'increaseValue', message: 'Increase value must be a valid positive number', type: 'error' });
    } else if (increaseType === 'percent' && increaseValue > 20) {
      warnings.push({ field: 'increaseValue', message: 'Annual increase above 20% is unusually high', type: 'warning' });
      completedFields++;
    } else {
      completedFields++;
    }

    // Time Period Validation
    const timePeriod = Number(timePeriodInput);
    if (!timePeriodInput || timePeriodInput.trim() === '') {
      errors.push({ field: 'timePeriod', message: 'Time period is required', type: 'error' });
    } else if (isNaN(timePeriod) || timePeriod <= 0) {
      errors.push({ field: 'timePeriod', message: 'Time period must be greater than 0', type: 'error' });
    } else if (timePeriod > 50) {
      warnings.push({ field: 'timePeriod', message: 'Time period above 50 years is unusually long', type: 'warning' });
      completedFields++;
    } else {
      completedFields++;
    }

    // Total Hectares Validation
    const totalHectares = Number(totalHectaresInput);
    if (!totalHectaresInput || totalHectaresInput.trim() === '') {
      errors.push({ field: 'totalHectares', message: 'Total hectares is required', type: 'error' });
    } else if (isNaN(totalHectares) || totalHectares <= 0) {
      errors.push({ field: 'totalHectares', message: 'Total hectares must be greater than 0', type: 'error' });
    } else {
      completedFields++;
    }

    // Cash Flow Generation Validation
    if (cashFlows.length === 0 && baseCashFlow > 0 && timePeriod > 0) {
      errors.push({ field: 'cashFlows', message: 'Cash flows could not be generated - check your inputs', type: 'error' });
    } else if (cashFlows.length > 0) {
      completedFields++;
    }

    // Custom Payment Schedule Validation
    if (paymentType === 'custom') {
      // Payment Schedule Validation
      if (paymentSchedule.installments.length === 0) {
        errors.push({ field: 'paymentSchedule', message: 'At least one payment installment is required', type: 'error' });
      } else {
        const incompleteInstallments = paymentSchedule.installments.filter(inst => 
          inst.amountDue <= 0 || inst.percentageOfDeal <= 0 || !inst.paymentDate
        );
        
        if (incompleteInstallments.length > 0) {
          errors.push({ 
            field: 'paymentSchedule', 
            message: `${incompleteInstallments.length} installment(s) have incomplete data`, 
            type: 'error' 
          });
        } else {
          completedFields++;
        }

        // Check percentage allocation
        const totalPercentage = paymentSchedule.installments.reduce((sum, inst) => sum + inst.percentageOfDeal, 0);
        if (totalPercentage < 95) {
          warnings.push({ 
            field: 'paymentSchedule', 
            message: `Payment schedule is incomplete (${totalPercentage.toFixed(1)}% allocated)`, 
            type: 'warning' 
          });
        } else if (totalPercentage > 100.1) {
          errors.push({ 
            field: 'paymentSchedule', 
            message: 'Total percentage exceeds 100%', 
            type: 'error' 
          });
        } else {
          completedFields++;
        }

        // Check for invalid payment dates
        const invalidDates = paymentSchedule.installments.filter(inst => 
          inst.paymentDate < paymentSchedule.leaseStartDate
        );
        if (invalidDates.length > 0) {
          errors.push({ 
            field: 'paymentSchedule', 
            message: `${invalidDates.length} payment(s) scheduled before lease start date`, 
            type: 'error' 
          });
        }
      }
    }

    // NPV Validation
    if (npv <= 0 && baseCashFlow > 0 && timePeriod > 0) {
      warnings.push({ field: 'npv', message: 'NPV is zero or negative - review your parameters', type: 'warning' });
    }

    const completionPercentage = Math.round((completedFields / totalFields) * 100);
    const isValid = errors.length === 0 && completionPercentage >= 90;

    return {
      isValid,
      errors,
      warnings,
      completionPercentage
    };
  }, [
    discountRateInput,
    baseCashFlowInput,
    increaseValueInput,
    increaseType,
    timePeriodInput,
    totalHectaresInput,
    paymentType,
    paymentSchedule,
    cashFlows,
    npv
  ]);

  return validation;
};

export default useFormValidation;