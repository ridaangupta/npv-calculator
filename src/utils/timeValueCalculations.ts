import { differenceInDays } from 'date-fns';

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

export const findFurthestPaymentDate = (paymentDates: Date[], leaseStartDate: Date): Date => {
  if (paymentDates.length === 0) {
    return leaseStartDate;
  }
  return paymentDates.reduce((furthest, current) => 
    current > furthest ? current : furthest
  );
};

export const calculateTotalAvailableAtFurthestDate = (
  npv: number,
  discountRate: number,
  leaseStartDate: Date,
  furthestDate: Date
): number => {
  return calculateFutureValue(npv, discountRate, leaseStartDate, furthestDate);
};