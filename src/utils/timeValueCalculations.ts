
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

// New function for Present Value Equivalence Method
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

// Custom Schedule Calculations
export const calculateCustomInstallmentPresentValue = (
  dealValue: number,
  percentage: number,
  leaseStartDate: Date,
  paymentDate: Date,
  discountRate: number
): number => {
  const amount = dealValue * (percentage / 100);
  const days = differenceInDays(paymentDate, leaseStartDate);
  
  if (days <= 0) {
    return amount;
  }
  
  const discountFactor = Math.pow(1 + discountRate / 100 / 365, days);
  return amount / discountFactor;
};

export const calculateCustomScheduleInstallments = (
  dealValue: number,
  leaseStartDate: Date,
  discountRate: number,
  installments: Array<{ id: string; paymentDate: Date; percentage: number }>
): CustomLeaseInstallment[] => {
  return installments.map(installment => {
    const amount = dealValue * (installment.percentage / 100);
    const daysFromStart = differenceInDays(installment.paymentDate, leaseStartDate);
    const presentValue = calculateCustomInstallmentPresentValue(
      dealValue,
      installment.percentage,
      leaseStartDate,
      installment.paymentDate,
      discountRate
    );
    
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
