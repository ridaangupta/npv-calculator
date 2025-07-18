
import { differenceInDays } from 'date-fns';
import { CustomLeaseInstallment } from '@/types/CustomScheduleTypes';

export const calculatePresentValue = (
  futureValue: number,
  discountRate: number,
  startDate: Date,
  paymentDate: Date
): number => {
  const daysDifference = differenceInDays(paymentDate, startDate);
  const yearsDifference = daysDifference / 365.25;
  
  if (yearsDifference <= 0) {
    return futureValue;
  }
  
  const presentValue = futureValue / Math.pow(1 + discountRate / 100, yearsDifference);
  return presentValue;
};

export const calculateFutureValue = (
  presentValue: number,
  discountRate: number,
  startDate: Date,
  paymentDate: Date
): number => {
  const daysDifference = differenceInDays(paymentDate, startDate);
  const yearsDifference = daysDifference / 365.25;
  
  if (yearsDifference <= 0) {
    return presentValue;
  }
  
  const futureValue = presentValue * Math.pow(1 + discountRate / 100, yearsDifference);
  return futureValue;
};

export const calculateDaysToPayment = (startDate: Date, paymentDate: Date): number => {
  return differenceInDays(paymentDate, startDate);
};

// New function to calculate future payment amount from present value contribution
export const calculateFuturePaymentAmount = (
  presentValueContribution: number,
  leaseStartDate: Date,
  paymentDate: Date,
  discountRate: number
): number => {
  const days = differenceInDays(paymentDate, leaseStartDate);
  
  if (days <= 0) {
    return presentValueContribution;
  }
  
  const years = days / 365.25;
  const futureAmount = presentValueContribution * Math.pow(1 + discountRate / 100, years);
  return futureAmount;
};

// Present Value Equivalence Method functions
export const calculatePresentValuePortion = (
  percentage: number,
  totalNPV: number
): number => {
  return (percentage / 100) * totalNPV;
};

export const calculatePercentageFromPresentValue = (
  presentValue: number,
  totalNPV: number
): number => {
  return totalNPV > 0 ? (presentValue / totalNPV) * 100 : 0;
};

// Updated Custom Schedule Calculations - treating dealValue as target NPV
export const calculateCustomScheduleInstallments = (
  dealValue: number,
  leaseStartDate: Date,
  discountRate: number,
  installments: Array<{ id: string; paymentDate: Date; percentage: number }>
): CustomLeaseInstallment[] => {
  return installments.map(installment => {
    // Present value contribution = dealValue * percentage
    const presentValue = dealValue * (installment.percentage / 100);
    
    // Future payment amount = present value compounded to payment date
    const amount = calculateFuturePaymentAmount(
      presentValue,
      leaseStartDate,
      installment.paymentDate,
      discountRate
    );
    
    const daysFromStart = differenceInDays(installment.paymentDate, leaseStartDate);
    
    return {
      id: installment.id,
      paymentDate: installment.paymentDate,
      percentage: installment.percentage,
      amount,
      presentValue,
      daysFromStart: Math.max(0, daysFromStart)
    };
  });
};

export const calculateCustomScheduleNPV = (installments: CustomLeaseInstallment[]): number => {
  return installments.reduce((total, installment) => total + installment.presentValue, 0);
};
