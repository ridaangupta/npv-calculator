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