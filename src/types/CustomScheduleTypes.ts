export interface CustomLeaseInstallment {
  id: string;
  paymentDate: Date;
  percentage: number;
  amount: number;
  presentValue: number;
  daysFromStart: number;
}

export interface CustomLeaseSchedule {
  leaseStartDate: Date;
  numberOfInstallments: number;
  discountRate: number;
  dealValue: number;
  installments: CustomLeaseInstallment[];
  totalNPV: number;
}

export interface CustomScheduleValidation {
  isValid: boolean;
  errors: string[];
  percentageSum: number;
  hasInvalidDates: boolean;
}

export interface CustomScheduleInputs {
  leaseStartDate: Date | undefined;
  numberOfInstallments: number;
  discountRate: number;
  dealValue: number;
}