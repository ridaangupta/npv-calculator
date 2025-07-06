
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { PaymentInstallment, PaymentSchedule } from '@/types/PaymentSchedule';
import PaymentInstallmentCard from './PaymentInstallmentCard';
import PaymentScheduleSummary from './PaymentScheduleSummary';

interface UpfrontPaymentSchedulerProps {
  totalNPV: number;
  paymentSchedule: PaymentSchedule;
  onUpdateSchedule: (schedule: PaymentSchedule) => void;
}

const UpfrontPaymentScheduler: React.FC<UpfrontPaymentSchedulerProps> = ({
  totalNPV,
  paymentSchedule,
  onUpdateSchedule
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate derived values
  const calculatedValues = useMemo(() => {
    const totalAmount = paymentSchedule.installments.reduce((sum, inst) => sum + inst.amountDue, 0);
    const totalPercentage = paymentSchedule.installments.reduce((sum, inst) => sum + inst.percentageOfDeal, 0);
    const remainingAmount = totalNPV - totalAmount;
    
    const isValid = totalAmount <= totalNPV && totalPercentage <= 100;
    
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
      remainingAmount: calculatedValues.remainingAmount
    };
    onUpdateSchedule(newSchedule);
  };

  const addInstallment = () => {
    const newInstallment: PaymentInstallment = {
      id: `installment-${Date.now()}`,
      paymentDate: new Date(),
      percentageOfDeal: 0,
      amountDue: 0,
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
        const percentage = totalNPV > 0 ? (amount / totalNPV) * 100 : 0;
        return { ...inst, amountDue: amount, percentageOfDeal: percentage };
      }
      return inst;
    });
    updateSchedule(updatedInstallments);
  };

  const updateInstallmentPercentage = (id: string, percentage: number) => {
    const updatedInstallments = paymentSchedule.installments.map(inst => {
      if (inst.id === id) {
        const amount = (percentage / 100) * totalNPV;
        return { ...inst, percentageOfDeal: percentage, amountDue: amount };
      }
      return inst;
    });
    updateSchedule(updatedInstallments);
  };

  const updateInstallmentDate = (id: string, date: Date) => {
    const updatedInstallments = paymentSchedule.installments.map(inst => 
      inst.id === id ? { ...inst, paymentDate: date } : inst
    );
    updateSchedule(updatedInstallments);
  };

  if (totalNPV <= 0) {
    return null;
  }

  return (
    <div className="w-full space-y-4">
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Custom Payment Schedule
            </span>
            <div className="flex items-center gap-2">
              <Button
                onClick={addInstallment}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Payment
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white hover:bg-white/20"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Summary Section */}
          <PaymentScheduleSummary
            totalNPV={totalNPV}
            paymentSchedule={paymentSchedule}
            totalAmount={calculatedValues.totalAmount}
            totalPercentage={calculatedValues.totalPercentage}
            remainingAmount={calculatedValues.remainingAmount}
            isValid={calculatedValues.isValid}
          />

          {/* Installments Section */}
          {isExpanded && (
            <div className="mt-6 space-y-4">
              {paymentSchedule.installments.length === 0 ? (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="p-8 text-center">
                    <div className="text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No Payment Installments</h3>
                      <p className="text-sm mb-4">
                        Create custom payment installments to structure your upfront payment schedule.
                      </p>
                      <Button onClick={addInstallment} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add First Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Payment Installments ({paymentSchedule.installments.length})
                    </h4>
                  </div>
                  
                  {paymentSchedule.installments.map((installment) => (
                    <PaymentInstallmentCard
                      key={installment.id}
                      installment={installment}
                      totalNPV={totalNPV}
                      onUpdateAmount={updateInstallmentAmount}
                      onUpdatePercentage={updateInstallmentPercentage}
                      onUpdateDate={updateInstallmentDate}
                      onRemove={removeInstallment}
                    />
                  ))}
                </div>
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
