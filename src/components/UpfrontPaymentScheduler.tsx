
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { PaymentInstallment, PaymentSchedule } from '@/types/PaymentSchedule';
import PaymentScheduleSummary from './PaymentScheduleSummary';
import PaymentScheduleHeader from './PaymentScheduleHeader';
import PaymentScheduleEmpty from './PaymentScheduleEmpty';
import PaymentScheduleList from './PaymentScheduleList';
import { format } from 'date-fns';
import { 
  calculatePresentValue, 
  calculateFutureValue, 
  calculatePresentValuePortion,
  calculatePercentageFromPresentValue 
} from '@/utils/timeValueCalculations';

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
  // Auto-expand when there are installments for better mobile UX
  const [isExpanded, setIsExpanded] = useState(true);

// Enhanced validation logic with comprehensive error checking
  const calculatedValues = useMemo(() => {
    const totalPresentValue = paymentSchedule.installments.reduce((sum, inst) => sum + inst.presentValue, 0);
    const totalAmount = paymentSchedule.installments.reduce((sum, inst) => sum + inst.amountDue, 0);
    const totalPercentage = paymentSchedule.installments.reduce((sum, inst) => sum + inst.percentageOfDeal, 0);
    
    // Remaining amount is based on present value (NPV)
    const remainingPresentValue = Math.max(0, totalNPV - totalPresentValue);
    
    // Enhanced validation with detailed error tracking
    const validationErrors = [];
    let isValid = true;
    
    // Check if total NPV is valid
    if (totalNPV <= 0) {
      validationErrors.push('Invalid total NPV value');
      isValid = false;
    }
    
    // Check if installments exist for custom payment type
    if (paymentSchedule.installments.length === 0) {
      validationErrors.push('No payment installments configured');
      isValid = false;
    }
    
    // Check for incomplete installment data
    const incompleteInstallments = paymentSchedule.installments.filter(inst => 
      inst.amountDue <= 0 || inst.percentageOfDeal <= 0 || !inst.paymentDate
    );
    if (incompleteInstallments.length > 0) {
      validationErrors.push(`${incompleteInstallments.length} installment(s) have incomplete data`);
      isValid = false;
    }
    
    // Check if present value exceeds NPV
    if (totalNPV > 0 && totalPresentValue > totalNPV * 1.01) { // Allow 1% tolerance for rounding
      validationErrors.push('Total present value exceeds available deal value');
      isValid = false;
    }
    
    // Check if percentage is too high
    if (totalPercentage > 100.1) { // Allow small tolerance for rounding
      validationErrors.push('Total percentage exceeds 100%');
      isValid = false;
    }
    
    // Check if schedule is incomplete (not close to 100%)
    const percentageAllocated = totalNPV > 0 ? (totalPresentValue / totalNPV) * 100 : 0;
    const isIncomplete = percentageAllocated < 95; // Less than 95% allocated
    if (isIncomplete && paymentSchedule.installments.length > 0) {
      validationErrors.push(`Payment schedule incomplete (${percentageAllocated.toFixed(1)}% allocated)`);
    }
    
    // Check for future payment dates that might be invalid
    const currentDate = new Date();
    const invalidDates = paymentSchedule.installments.filter(inst => 
      inst.paymentDate < paymentSchedule.leaseStartDate
    );
    if (invalidDates.length > 0) {
      validationErrors.push(`${invalidDates.length} payment(s) scheduled before lease start date`);
      isValid = false;
    }
    
    // Debug logging with enhanced info
    console.log('Payment Schedule Validation:', {
      totalNPV,
      totalPresentValue,
      totalAmount,
      totalPercentage,
      remainingPresentValue,
      percentageAllocated,
      isValid,
      isIncomplete,
      validationErrors,
      installmentCount: paymentSchedule.installments.length
    });
    
    return {
      totalAmount,
      totalPercentage,
      totalPresentValue,
      remainingPresentValue,
      isValid,
      isIncomplete,
      validationErrors,
      percentageAllocated
    };
  }, [paymentSchedule.installments, totalNPV, paymentSchedule.leaseStartDate]);

  const updateSchedule = (installments: PaymentInstallment[]) => {
    // Recalculate values for the new schedule to avoid circular dependency
    const newTotalPresentValue = installments.reduce((sum, inst) => sum + inst.presentValue, 0);
    const newTotalAmount = installments.reduce((sum, inst) => sum + inst.amountDue, 0);
    const newTotalPercentage = installments.reduce((sum, inst) => sum + inst.percentageOfDeal, 0);
    const newRemainingAmount = Math.max(0, totalNPV - newTotalPresentValue);
    
    const newSchedule: PaymentSchedule = {
      installments,
      totalPercentage: newTotalPercentage,
      totalAmount: newTotalAmount,
      remainingAmount: newRemainingAmount,
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

  // Updated to use Present Value Equivalence Method
  const updateInstallmentAmount = (id: string, amount: number) => {
    const updatedInstallments = paymentSchedule.installments.map(inst => {
      if (inst.id === id) {
        // Calculate present value of the entered amount
        const presentValue = calculatePresentValue(amount, discountRate, paymentSchedule.leaseStartDate, inst.paymentDate);
        // Calculate percentage based on present value portion of total NPV
        const percentage = calculatePercentageFromPresentValue(presentValue, totalNPV);
        return { ...inst, amountDue: amount, presentValue, percentageOfDeal: percentage };
      }
      return inst;
    });
    updateSchedule(updatedInstallments);
  };

  // Updated to use Present Value Equivalence Method
  const updateInstallmentPercentage = (id: string, percentage: number) => {
    const updatedInstallments = paymentSchedule.installments.map(inst => {
      if (inst.id === id) {
        // Calculate present value portion based on percentage of total NPV
        const presentValuePortion = calculatePresentValuePortion(percentage, totalNPV);
        // Convert this present value portion to future value at the payment date
        const futureValue = calculateFutureValue(presentValuePortion, discountRate, paymentSchedule.leaseStartDate, inst.paymentDate);
        
        // Debug logging
        console.log(`Payment ${inst.id}: ${percentage}% = PV ${presentValuePortion} -> FV ${futureValue}`);
        
        return { ...inst, percentageOfDeal: percentage, amountDue: futureValue, presentValue: presentValuePortion };
      }
      return inst;
    });
    updateSchedule(updatedInstallments);
  };

  const updateInstallmentDate = (id: string, date: Date) => {
    const updatedInstallments = paymentSchedule.installments.map(inst => {
      if (inst.id === id) {
        // Recalculate present value with new date
        const presentValue = calculatePresentValue(inst.amountDue, discountRate, paymentSchedule.leaseStartDate, date);
        // Recalculate percentage based on new present value
        const percentage = calculatePercentageFromPresentValue(presentValue, totalNPV);
        return { ...inst, paymentDate: date, presentValue, percentageOfDeal: percentage };
      }
      return inst;
    });
    updateSchedule(updatedInstallments);
  };

  const updateLeaseStartDate = (dateString: string) => {
    const newStartDate = new Date(dateString);
    if (isNaN(newStartDate.getTime())) return;
    
    // Recalculate all installments with new start date using Present Value Equivalence
    const updatedInstallments = paymentSchedule.installments.map(inst => {
      const presentValue = calculatePresentValue(inst.amountDue, discountRate, newStartDate, inst.paymentDate);
      const percentage = calculatePercentageFromPresentValue(presentValue, totalNPV);
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
        
        <CardContent className="p-4 sm:p-6">
          <div className="mb-6 space-y-2">
            <Label htmlFor="lease-start-date" className="text-sm font-medium text-gray-700">
              Lease Start Date
            </Label>
            <Input
              id="lease-start-date"
              type="date"
              value={format(paymentSchedule.leaseStartDate, 'yyyy-MM-dd')}
              onChange={(e) => updateLeaseStartDate(e.target.value)}
              className="w-full min-h-[40px]"
            />
          </div>

          <PaymentScheduleSummary
            totalNPV={totalNPV}
            paymentSchedule={paymentSchedule}
            totalAmount={calculatedValues.totalAmount}
            totalPercentage={calculatedValues.totalPercentage}
            remainingAmount={calculatedValues.remainingPresentValue}
            isValid={calculatedValues.isValid}
            totalPresentValue={calculatedValues.totalPresentValue}
            isIncomplete={calculatedValues.isIncomplete}
            validationErrors={calculatedValues.validationErrors}
            percentageAllocated={calculatedValues.percentageAllocated}
          />

          {isExpanded && (
            <div className="mt-6 space-y-3 sm:space-y-4">
              {paymentSchedule.installments.length === 0 ? (
                <PaymentScheduleEmpty onAddInstallment={addInstallment} />
              ) : (
                <>
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
                  
                  {/* Add Payment Button at Bottom */}
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      onClick={addInstallment}
                      variant="outline"
                      className="w-full sm:w-auto flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Plus className="w-4 h-4" />
                      Add Payment Installment
                    </Button>
                  </div>
                </>
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
