export interface LeaseInstallment {
  id: string;
  paymentDate: Date;
  percentageOfDeal: number;
  amountDue: number;
  presentValue: number;
  description?: string;
}

export interface LeaseSchedule {
  installments: LeaseInstallment[];
  totalPercentage: number;
  totalAmount: number;
  remainingAmount: number;
  leaseStartDate: Date;
}

export interface LeaseCashFlow {
  id: string;
  year: number;
  amount: number;
}

export interface LeaseCalculationResult {
  leaseValue: number;
  totalInvestment: number;
  cashFlows: LeaseCashFlow[];
  isValid: boolean;
}

export interface LeaseProperty {
  totalHectares: number;
  valuePerHectare: number;
  valuePerSquareMeter: number;
  totalValue: number;
}

export interface LeaseTerms {
  baseCashFlow: number;
  increaseValue: number;
  increaseType: 'amount' | 'percent';
  increaseFrequency: number;
  timePeriod: number;
  discountRate: number;
  paymentTiming: 'beginning' | 'middle' | 'end';
  paymentType: 'normal' | 'custom';
}

// Legacy compatibility - keep for gradual migration
export interface PaymentInstallment extends LeaseInstallment {}
export interface PaymentSchedule extends LeaseSchedule {}

// Common validation types
export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  completionPercentage: number;
}
