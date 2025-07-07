
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PaymentInstallment, PaymentSchedule } from '@/types/PaymentSchedule';
import PaymentScheduleSummary from './PaymentScheduleSummary';
import PaymentScheduleHeader from './PaymentScheduleHeader';
import PaymentScheduleEmpty from './PaymentScheduleEmpty';
import PaymentScheduleList from './PaymentScheduleList';
import { format } from 'date-fns';
import { calculatePresentValue, calculateFutureValue } from '@/utils/timeValueCalculations';

interface UpfrontPaymentSchedulerProps {
  totalNPV: number;
  paymentSchedule: PaymentSchedule;
  onUpdateSchedule: (schedule: PaymentSchedule) => void;
  discountRate: number;
}

const UpfrontPaymentScheduler: React.FC<UpfrontPaymentSchedulerProps> = ({
  totalNPV,
  paymentSchedule,
  onUpdateSchedule,
  discountRate
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate derived values
  const calculatedValues = useMemo(() => {
    const totalAmount = paymentSchedule.installments.reduce((sum, inst) => sum + inst.amountDue, 0);
    const totalPercentage = paymentSchedule.installments.reduce((sum, inst) => sum + inst.percentageOfDeal, 0);
    const remainingAmount = Math.max(0, totalNPV - totalAmount);
    
    const isValid = totalNPV > 0 ? (totalAmount <= totalNPV && totalPercentage <= 100) : true;
    
    return {
      totalAmount,
      totalPercentage,
      remainingAmount,
      isValid
    };
  }, [paymentSchedule.installments, totalNPV]);

  const updateSchedule = (installments: PaymentInstallment[]) => {
    const newSchedule: PaymentSchedule = {
      installments,
      totalPercentage: calculatedValues.totalPercentage,
      totalAmount: calculatedValues.totalAmount,
      remainingAmount: calculatedValues.remainingAmount,
      leaseStartDate: paymentSchedule.leaseStartDate
    };
    onUpdateSchedule(newSchedule);
  };

  const addInstallment = () => {
    const newInstallment: PaymentInstallment = {
      id: `installment-${Date.now()}`,
      paymentDate: new Date(),
      percentageOfDeal: 0,
      amountDue: 0,
      presentValue: 0,
      description: `Payment ${paymentSchedule.installments.length + 1}`
    };
    
    updateSchedule([...paymentSchedule.installments, newInstallment]);
    setIsExpanded(true);
  };

  const removeInstallment = (id: string) => {
    const updatedInstallments = paymentSchedule.installments.filter(inst => inst.id !== id);
    updateSchedule(updatedInstallments);
  };

  const updateInstallmentAmount = (id: string, amount: number) => {
    const updatedInstallments = paymentSchedule.installments.map(inst => {
      if (inst.id === id) {
        const presentValue = calculatePresentValue(amount, discountRate, paymentSchedule.leaseStartDate, inst.paymentDate);
        const percentage = totalNPV > 0 ? (presentValue / totalNPV) * 100 : 0;
        return { ...inst, amountDue: amount, presentValue, percentageOfDeal: percentage };
      }
      return inst;
    });
    updateSchedule(updatedInstallments);
  };

  const updateInstallmentPercentage = (id: string, percentage: number) => {
    const updatedInstallments = paymentSchedule.installments.map(inst => {
      if (inst.id === id) {
        const presentValueTarget = totalNPV > 0 ? (percentage / 100) * totalNPV : 0;
        const futureValue = calculateFutureValue(presentValueTarget, discountRate, paymentSchedule.leaseStartDate, inst.paymentDate);
        return { ...inst, percentageOfDeal: percentage, amountDue: futureValue, presentValue: presentValueTarget };
      }
      return inst;
    });
    updateSchedule(updatedInstallments);
  };

  const updateInstallmentDate = (id: string, date: Date) => {
    const updatedInstallments = paymentSchedule.installments.map(inst => {
      if (inst.id === id) {
        const presentValue = calculatePresentValue(inst.amountDue, discountRate, paymentSchedule.leaseStartDate, date);
        return { ...inst, paymentDate: date, presentValue };
      }
      return inst;
    });
    updateSchedule(updatedInstallments);
  };

  const updateLeaseStartDate = (dateString: string) => {
    const newStartDate = new Date(dateString);
    if (isNaN(newStartDate.getTime())) return;
    
    const updatedInstallments = paymentSchedule.installments.map(inst => {
      const presentValue = calculatePresentValue(inst.amountDue, discountRate, newStartDate, inst.paymentDate);
      const percentage = totalNPV > 0 ? (presentValue / totalNPV) * 100 : 0;
      return { ...inst, presentValue, percentageOfDeal: percentage };
    });
    
    const newSchedule = {
      ...paymentSchedule,
      leaseStartDate: newStartDate,
      installments: updatedInstallments
    };
    onUpdateSchedule(newSchedule);
  };

  return (
    <div className="w-full space-y-4">
      <Card className="shadow-lg border-0 bg-white">
        <PaymentScheduleHeader
          onAddInstallment={addInstallment}
          isExpanded={isExpanded}
          onToggleExpanded={() => setIsExpanded(!isExpanded)}
        />
        
        <CardContent className="p-6">
          <div className="mb-6 space-y-2">
            <Label htmlFor="lease-start-date" className="text-sm font-medium text-gray-700">
              Lease Start Date
            </Label>
            <Input
              id="lease-start-date"
              type="date"
              value={format(paymentSchedule.leaseStartDate, 'yyyy-MM-dd')}
              onChange={(e) => updateLeaseStartDate(e.target.value)}
              className="w-full"
            />
          </div>

          <PaymentScheduleSummary
            totalNPV={totalNPV}
            paymentSchedule={paymentSchedule}
            totalAmount={calculatedValues.totalAmount}
            totalPercentage={calculatedValues.totalPercentage}
            remainingAmount={calculatedValues.remainingAmount}
            isValid={calculatedValues.isValid}
          />

          {isExpanded && (
            <div className="mt-6 space-y-4">
              {paymentSchedule.installments.length === 0 ? (
                <PaymentScheduleEmpty onAddInstallment={addInstallment} />
              ) : (
                <PaymentScheduleList
                  installments={paymentSchedule.installments}
                  totalNPV={totalNPV}
                  onUpdateAmount={updateInstallmentAmount}
                  onUpdatePercentage={updateInstallmentPercentage}
                  onUpdateDate={updateInstallmentDate}
                  onRemove={removeInstallment}
                  leaseStartDate={paymentSchedule.leaseStartDate}
                  discountRate={discountRate}
                />
              )}
            </div>
          )}

          {!isExpanded && paymentSchedule.installments.length > 0 && (
            <div className="mt-4 text-center py-4 text-gray-600">
              <p className="font-medium">
                {paymentSchedule.installments.length} payment installment{paymentSchedule.installments.length !== 1 ? 's' : ''} configured
              </p>
              <p className="text-sm">Click the arrow to expand and view details</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UpfrontPaymentScheduler;
