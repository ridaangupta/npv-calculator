import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { PaymentInstallment, PaymentSchedule } from '@/types/PaymentSchedule';
import { useCurrency } from '@/contexts/CurrencyContext';
import PaymentInstallmentRow from './PaymentInstallmentRow';

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
  const { formatCurrency } = useCurrency();
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate derived values
  const calculatedValues = useMemo(() => {
    const totalAmount = paymentSchedule.installments.reduce((sum, inst) => sum + inst.amountDue, 0);
    const totalPercentage = paymentSchedule.installments.reduce((sum, inst) => sum + inst.percentageOfDeal, 0);
    const remainingAmount = totalNPV - totalAmount;
    const remainingPercentage = 100 - totalPercentage;
    
    const isValid = totalAmount <= totalNPV && totalPercentage <= 100;
    const isComplete = Math.abs(totalAmount - totalNPV) < 0.01;
    
    return {
      totalAmount,
      totalPercentage,
      remainingAmount,
      remainingPercentage,
      isValid,
      isComplete
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
      id: Date.now().toString(),
      paymentDate: new Date(),
      percentageOfDeal: 0,
      amountDue: 0,
      description: `Payment ${paymentSchedule.installments.length + 1}`
    };
    
    updateSchedule([...paymentSchedule.installments, newInstallment]);
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
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Custom Payment Schedule
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-white/20"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Total NPV Available</div>
            <div className="text-xl font-semibold text-blue-700">
              {formatCurrency(totalNPV)}
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Scheduled Payments</div>
            <div className="text-xl font-semibold text-green-700">
              {formatCurrency(calculatedValues.totalAmount)}
            </div>
            <div className="text-xs text-gray-500">
              {calculatedValues.totalPercentage.toFixed(1)}% of total
            </div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Remaining Amount</div>
            <div className="text-xl font-semibold text-orange-700">
              {formatCurrency(calculatedValues.remainingAmount)}
            </div>
            <div className="text-xs text-gray-500">
              {calculatedValues.remainingPercentage.toFixed(1)}% remaining
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Payment Schedule Progress</span>
            <div className="flex items-center gap-2">
              {calculatedValues.isValid ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm text-gray-600">
                {calculatedValues.totalPercentage.toFixed(1)}% scheduled
              </span>
            </div>
          </div>
          <Progress 
            value={Math.min(calculatedValues.totalPercentage, 100)} 
            className="h-2"
          />
          {!calculatedValues.isValid && (
            <p className="text-red-500 text-xs mt-1">
              Total scheduled payments exceed available NPV amount
            </p>
          )}
        </div>

        {/* Installments Section */}
        {isExpanded && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold text-gray-800">Payment Installments</h4>
              <Button onClick={addInstallment} size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Installment
              </Button>
            </div>

            {paymentSchedule.installments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No payment installments scheduled yet.</p>
                <p className="text-sm">Click "Add Installment" to create your first payment schedule.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentSchedule.installments.map((installment) => (
                  <PaymentInstallmentRow
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
          <div className="text-center py-4 text-gray-600">
            <p>{paymentSchedule.installments.length} installment{paymentSchedule.installments.length !== 1 ? 's' : ''} configured</p>
            <p className="text-sm">Click "Expand" to view and edit payment schedule</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpfrontPaymentScheduler;