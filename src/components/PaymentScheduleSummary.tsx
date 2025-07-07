
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { PaymentSchedule } from '@/types/PaymentSchedule';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PaymentScheduleSummaryProps {
  totalNPV: number;
  paymentSchedule: PaymentSchedule;
  totalAmount: number;
  totalPercentage: number;
  remainingAmount: number;
  isValid: boolean;
  furthestDate?: Date;
  totalAvailableAtFurthest?: number;
}

const PaymentScheduleSummary: React.FC<PaymentScheduleSummaryProps> = ({
  totalNPV,
  totalAmount,
  totalPercentage,
  remainingAmount,
  isValid,
  furthestDate,
  totalAvailableAtFurthest
}) => {
  const { formatCurrency } = useCurrency();

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        {furthestDate && totalAvailableAtFurthest && (
          <div className="mb-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Reference Date: {format(furthestDate, 'MMM dd, yyyy')}</span>
            </div>
            <p className="text-xs text-blue-700">
              All percentages are calculated based on the value at the furthest payment date to ensure consistent timing.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Present Value (NPV)</div>
            <div className="text-lg font-bold text-blue-700">
              {formatCurrency(totalNPV)}
            </div>
            {totalAvailableAtFurthest && (
              <div className="text-xs text-gray-500 mt-1">
                At ref. date: {formatCurrency(totalAvailableAtFurthest)}
              </div>
            )}
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Scheduled</div>
            <div className="text-xl font-bold text-green-700">
              {formatCurrency(totalAmount)}
            </div>
            <div className="text-xs text-gray-500">
              {totalPercentage.toFixed(1)}%
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Remaining</div>
            <div className="text-xl font-bold text-orange-700">
              {formatCurrency(remainingAmount)}
            </div>
            <div className="text-xs text-gray-500">
              {(100 - totalPercentage).toFixed(1)}%
            </div>
          </div>

          <div className="flex items-center justify-center">
            {isValid ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                <span className="font-medium">Valid</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                <span className="font-medium">Invalid</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Payment Schedule Progress
            </span>
            <span className="text-sm text-gray-600">
              {totalPercentage.toFixed(1)}% of total
            </span>
          </div>
          <Progress 
            value={Math.min(totalPercentage, 100)} 
            className="h-3"
          />
          {!isValid && (
            <p className="text-red-500 text-sm mt-2">
              Total scheduled payments exceed available amount
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentScheduleSummary;
