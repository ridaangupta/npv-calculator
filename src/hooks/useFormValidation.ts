import { useMemo } from 'react';
import { ValidationError, ValidationResult } from '@/types/LeaseTypes';

interface UseFormValidationProps {
  discountRateInput: string;
  baseCashFlowInput: string;
  increaseValueInput: string;
  increaseType: 'amount' | 'percent';
  timePeriodInput: string;
  totalHectaresInput: string;
  paymentTiming: 'beginning' | 'middle' | 'end';
  totalValue: number;
  cashFlows: any[];
  leaseValue: number;
  touchedFields?: Set<string>;
}

export const useFormValidation = ({
  discountRateInput,
  baseCashFlowInput,
  increaseValueInput,
  increaseType,
  timePeriodInput,
  totalHectaresInput,
  paymentTiming,
  totalValue,
  cashFlows,
  leaseValue,
  touchedFields = new Set()
}: UseFormValidationProps): ValidationResult => {
  
  const validation = useMemo(() => {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    let completedFields = 0;
    const totalFields = 6;

    // Discount Rate Validation
    const discountRate = Number(discountRateInput);
    if (touchedFields.has('discountRate')) {
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
    } else if (discountRateInput && discountRateInput.trim() !== '' && !isNaN(discountRate) && discountRate >= 0) {
      completedFields++;
    }

    // Base Cash Flow Validation
    const baseCashFlow = Number(baseCashFlowInput);
    if (touchedFields.has('baseCashFlow')) {
      if (!baseCashFlowInput || baseCashFlowInput.trim() === '') {
        errors.push({ field: 'baseCashFlow', message: 'Base cash flow is required', type: 'error' });
      } else if (isNaN(baseCashFlow) || baseCashFlow <= 0) {
        errors.push({ field: 'baseCashFlow', message: 'Base cash flow must be greater than 0', type: 'error' });
      } else {
        completedFields++;
      }
    } else if (baseCashFlowInput && baseCashFlowInput.trim() !== '' && !isNaN(baseCashFlow) && baseCashFlow > 0) {
      completedFields++;
    }

    // Increase Value Validation
    const increaseValue = Number(increaseValueInput);
    if (touchedFields.has('increaseValue')) {
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
    } else if (increaseValueInput && increaseValueInput.trim() !== '' && !isNaN(increaseValue) && increaseValue >= 0) {
      completedFields++;
    }

    // Time Period Validation
    const timePeriod = Number(timePeriodInput);
    if (touchedFields.has('timePeriod')) {
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
    } else if (timePeriodInput && timePeriodInput.trim() !== '' && !isNaN(timePeriod) && timePeriod > 0) {
      completedFields++;
    }

    // Total Hectares Validation
    const totalHectares = Number(totalHectaresInput);
    if (touchedFields.has('totalHectares')) {
      if (!totalHectaresInput || totalHectaresInput.trim() === '') {
        errors.push({ field: 'totalHectares', message: 'Total hectares is required', type: 'error' });
      } else if (isNaN(totalHectares) || totalHectares <= 0) {
        errors.push({ field: 'totalHectares', message: 'Total hectares must be greater than 0', type: 'error' });
      } else {
        completedFields++;
      }
    } else if (totalHectaresInput && totalHectaresInput.trim() !== '' && !isNaN(totalHectares) && totalHectares > 0) {
      completedFields++;
    }

    // Cash Flow Generation Validation
    if (cashFlows.length === 0 && baseCashFlow > 0 && timePeriod > 0) {
      errors.push({ field: 'cashFlows', message: 'Cash flows could not be generated - check your inputs', type: 'error' });
    } else if (cashFlows.length > 0) {
      completedFields++;
    }

    // Lease Value Validation
    if (leaseValue <= 0 && baseCashFlow > 0 && timePeriod > 0) {
      warnings.push({ field: 'leaseValue', message: 'Lease value is zero or negative - review your parameters', type: 'warning' });
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
    paymentTiming,
    totalValue,
    cashFlows,
    leaseValue,
    touchedFields
  ]);

  return validation;
};

export default useFormValidation;