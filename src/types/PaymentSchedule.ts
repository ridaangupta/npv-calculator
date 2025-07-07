export interface PaymentInstallment {
  id: string;
  paymentDate: Date;
  percentageOfDeal: number;
  amountDue: number;
  presentValue: number;
  description?: string;
}

export interface PaymentSchedule {
  installments: PaymentInstallment[];
  totalPercentage: number;
  totalAmount: number;
  remainingAmount: number;
  leaseStartDate: Date;
}